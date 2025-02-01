from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.planners import Planners
from app.models.expenses import Expenses, CashFlows
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime
from app.core.custom_logging import create_custom_log
from typing import List, Dict
import math
from app.core.database import redis_client
import json
import locale

# logging.basicConfig(level=logging.DEBUG)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_planner(planner: Planners, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']

    df = pd.DataFrame(planner.expenses)
    total_expenses = df['amount'].sum()

    # cash_flows = [cash_flow.model_dump() for cash_flow in planner.cash_flows]
    df = pd.DataFrame(planner.cash_flows)
    total_cash_flows = df['amount'].sum()
    
    planner_data = {
        "date_added": datetime.now(),
        "user_id": user_id,
        "planner_name": planner.planner_name,
        "expenses": planner.expenses,
        "cash_flows": planner.cash_flows,
        "total_expenses": float(total_expenses),
        "total_cash_flows": float(total_cash_flows)
    }
    result = await db.planners.insert_one(planner_data)
    object_id = str(result.inserted_id)
    await create_custom_log(
        event= "add planner",
        user_id = user_id,
        objectid = result.inserted_id,
        new_doc = await db.planners.find_one({"_id": ObjectId(result.inserted_id)})
    )
    return {"message": "Planner created successfully", "object_id": object_id}


@router.put("/{planner_id}")
async def update_planner(planner_id: str, updated_planner: Planners, token_data: dict = Depends(verify_token)):
    if not ObjectId.is_valid(planner_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid planner ID format"
        )

    old_doc = await db.planners.find_one({"_id": ObjectId(planner_id)})

    user_id = token_data['account_id']

    df = pd.DataFrame(updated_planner.expenses)
    total_expenses = df['amount'].sum()

    # cash_flows = [cash_flow.model_dump() for cash_flow in planner.cash_flows]
    df = pd.DataFrame(updated_planner.cash_flows)
    total_cash_flows = df['amount'].sum()
    
    planner_data = {
        "date_added": datetime.now(),
        "user_id": user_id,
        "planner_name": updated_planner.planner_name,
        "expenses": updated_planner.expenses,
        "cash_flows": updated_planner.cash_flows,
        "total_expenses": float(total_expenses),
        "total_cash_flows": float(total_cash_flows),
        "date_updated": datetime.now()
    }

    # Perform the update operation
    result = await db.planners.update_one(
        {"_id": ObjectId(planner_id)},
        {"$set": planner_data}
    )
    new_doc = await db.planners.find_one({"_id": ObjectId(planner_id)})
    await create_custom_log(
        event= "update planner",
        user_id = user_id,
        objectid = planner_id,
        old_doc=old_doc,
        new_doc = new_doc
    )
    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Planner not found"
        )

    return {"message": "Planner updated successfully"}

@router.delete("/{planner_id}")
async def delete_planner(planner_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    
    # Validate if the provided planner_id is a valid ObjectId
    if not ObjectId.is_valid(planner_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid planner ID format"
        )
    old_doc = await db.planners.find_one({"_id": ObjectId(planner_id)})

    # Perform the delete operation
    result = await db.planners.delete_one(
        {"_id": ObjectId(planner_id)}  # Match the document with the provided ID
    )
    await create_custom_log(
        event= "delete planner",
        user_id = user_id,
        objectid=None,
        old_doc=old_doc
    )
    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Planner not found"
        )

    return {"message": "Planner deleted successfully"}

@router.get("/", response_model=Dict[str, object])
async def get_planners(page: int = 1, limit: int = 10, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    if limit > 10:
        limit = 10

    # Calculate the skip value based on the page and limit
    skip = (page - 1) * limit

    # Fetch the paginated data from MongoDB
    planners = await db.planners.find({"user_id": user_id}).sort({"date_added": -1}).skip(skip).limit(limit).to_list(length=limit)
    if not planners:
        return {
            "data": {
                "limit": limit,
                "page": page,
                "total_pages": 1,
                "total_items": 0,
                "items": []
            }
        }
    new_planners = []
    for i in planners:
        len_of_expenses = len(i['expenses'])
        len_of_cash_flows = len(i['cash_flows'])
        i['_id'] = str(i['_id'])
        i['date_added'] = i['date_added'].strftime('%b %d, %Y')
        del i['expenses']
        del i['cash_flows']
        i['expenses'] = len_of_expenses
        i['cash_flows'] = len_of_cash_flows
        new_planners.append(i)

    total_count = await db.planners.count_documents({"user_id": user_id})
    total_pages = math.ceil(total_count / limit)

    # Check if no planners were found
    if not planners:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No planners found"
        )

    await create_custom_log(
        event= "get planners",
        user_id = user_id,
        objectid=None,
        account_id = user_id,
        page_number= page
    )
        
    return {
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items": new_planners
        }    

@router.get("/get_planner/{planner_id}", response_model=Dict[str, Dict[str, object]])
async def get_planner(planner_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    planner = await db.planners.find_one({"_id": ObjectId(planner_id)})
    planner["_id"] = str(planner['_id'])
    planner['date_added'] = planner['date_added'].strftime('%Y-%m-%d')
    expenses_amounts = []
    for i in planner['expenses']:
        expenses_amounts.append(i['amount'])        
    planner['total_expenses'] = float(pd.Series(expenses_amounts).sum()).__round__(2)

    cash_flows_amounts = []
    for i in planner['cash_flows']:
        cash_flows_amounts.append(i['amount'])        
    planner['total_cash_flows'] = float(pd.Series(cash_flows_amounts).sum()).__round__(2)
    planner['cash_flow_left'] = float(planner['total_cash_flows'] - planner['total_expenses']).__round__(2)

    if not planner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No planner found"
        )
    
    await create_custom_log(
        event= "get one planner",
        user_id = user_id,
        account_id = user_id,
        objectid=None,
        page_number= None,
        new_doc = None,
        error= None
    )
    
    return {
        "planner": planner
    }
    
@router.get("/get_options", response_model=Dict[str, Dict[str, object]])
async def get_options(token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    cached_options = await redis_client.get('planners_options')
    
    if cached_options:
        # Return from cache if available
        return json.loads(cached_options)

    expenses = await db.expenses.find({"user_id": user_id}).to_list(length=None)
    new_expenses = []
    for i in expenses:
        i['expense_label'] = f"{i['description']} on {i['date_of_transaction']}"
        i['date_synched'] = pd.to_datetime(i['date_synched']).strftime("%Y-%m-%d")
        i['date_added'] = pd.to_datetime(i['date_added']).strftime("%Y-%m-%d")
        i['date_of_transaction'] = pd.to_datetime(i['date_of_transaction']).strftime("%Y-%m-%d")
        try:
            del i['date_updated']
        except KeyError as e:
            print(e)
        i['_id'] = str(i['_id'])
        new_expenses.append(i)

    cash_flows = await db.cash_flows.find({"user_id": user_id}).to_list(length=None)
    new_cash_flows = []
    for i in cash_flows:
        i['cash_flow_label'] = f"{i['cash_flow_name']} on {pd.to_datetime(i['date_of_transaction']).strftime("%m-%d-%Y")}"
        i['_id'] = str(i['_id'])
        i['date_of_transaction'] = pd.to_datetime(i['date_of_transaction']).strftime("%Y-%m-%d")
        i['date_synched'] = pd.to_datetime(i['date_synched']).strftime("%Y-%m-%d")
        i['date_added'] = pd.to_datetime(i['date_added']).strftime("%Y-%m-%d")
        try:
            del i['date_updated']
        except KeyError as e:
            print(e)
        new_cash_flows.append(i)

    # If not in cache, generate options
    options = {
        "options": {
            "expenses": new_expenses,
            "cash_flows": new_cash_flows
        }
    }
    logging.debug(options)
    # Cache the options for future use (no expiration)
    redis_client.set('planners_options', json.dumps(options), ex=0)
    
    return options
    

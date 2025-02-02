from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.expenses import CashFlows, CashFlowType
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

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_cash_flow(cash_flow: CashFlows, token_data: dict = Depends(verify_token)):
    logging.debug(cash_flow)
    user_id = token_data['account_id']
    payload = token_data['payload']
    cash_flow_data = {
        "date_added": datetime.now(),
        "user_id": user_id,
        "date_of_transaction": pd.to_datetime(cash_flow.date_of_transaction),
        "cash_flow_name": cash_flow.cash_flow_name,
        "amount": cash_flow.amount,
        "cash_flow_type": cash_flow.cash_flow_type.value,
        "platform": cash_flow.platform,
        "remarks": cash_flow.remarks,
        "payment_method": cash_flow.payment_method
    }
    print(cash_flow_data)
    result = await db.cash_flows.insert_one(cash_flow_data)
    object_id = str(result.inserted_id)
    await create_custom_log(
        event= "add cash_flow",
        user_id = user_id,
        objectid = result.inserted_id,
        new_doc = await db.cash_flows.find_one({"_id": ObjectId(result.inserted_id)})
    )
    return {"message": "Cash Flow created successfully", "object_id": object_id}


@router.put("/{cash_flow_id}")
async def update_cash_flow(cash_flow_id: str, updated_cash_flow: CashFlows, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    # Validate if the provided cash_flow_id is a valid ObjectId
    if not ObjectId.is_valid(cash_flow_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid cash_flow ID format"
        )

    old_doc = await db.cash_flows.find_one({"_id": ObjectId(cash_flow_id)})
    # Convert Pydantic model to dictionary and process the date field
    updated_data = updated_cash_flow.dict()
    updated_data["date_of_transaction"] = pd.to_datetime(updated_data["date_of_transaction"])
    updated_data["date_updated"] = datetime.now()

    # Perform the update operation
    result = await db.cash_flows.update_one(
        {"_id": ObjectId(cash_flow_id)},  # Match the document with the provided ID
        {"$set": updated_data}          # Update with the new data
    )
    new_doc = await db.cash_flows.find_one({"_id": ObjectId(cash_flow_id)})
    await create_custom_log(
        event= "update cash_flow",
        user_id = user_id,
        objectid = cash_flow_id,
        old_doc=old_doc,
        new_doc = new_doc
    )
    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cash Flow not found"
        )

    return {"message": "Cash Flow updated successfully"}

@router.delete("/{cash_flow_id}")
async def delete_cash_flow(cash_flow_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    
    # Validate if the provided cash_flow_id is a valid ObjectId
    if not ObjectId.is_valid(cash_flow_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid cash_flow ID format"
        )
    old_doc = await db.cash_flows.find_one({"_id": ObjectId(cash_flow_id)})

    # Perform the delete operation
    result = await db.cash_flows.delete_one(
        {"_id": ObjectId(cash_flow_id)}  # Match the document with the provided ID
    )
    await create_custom_log(
        event= "delete cash_flow",
        user_id = user_id,
        objectid=None,
        old_doc=old_doc
    )
    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cash Flow not found"
        )

    return {"message": "Cash Flow deleted successfully"}

@router.get("/", response_model=Dict[str, object])
async def get_cash_flows(page: int = 1, limit: int = 10, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    if limit > 10:
        limit = 10

    # Calculate the skip value based on the page and limit
    skip = (page - 1) * limit

    # Fetch the paginated data from MongoDB
    cash_flows = await db.cash_flows.find({"user_id": user_id}).sort({"date_added": -1}).skip(skip).limit(limit).to_list(length=limit)
    if not cash_flows:
        return {
            "data": {
                "limit": limit,
                "page": page,
                "total_pages": 1,
                "total_items": 0,
                "items": []
            }
        }
    new_cash_flows = []
    for i in cash_flows:
        i['_id'] = str(i['_id'])
        i['date_added'] = i['date_added'].strftime('%b %d, %Y')
        new_cash_flows.append(i)

    total_count = await db.cash_flows.count_documents({})
    total_pages = math.ceil(total_count / limit)

    # Check if no cash_flows were found
    if not cash_flows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No cash_flows found"
        )

    await create_custom_log(
        event= "get cash_flows",
        user_id = user_id,
        objectid=None,
        account_id = user_id,
        page_number= page
    )
        
    return {
        "data": {
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items": new_cash_flows
        }
    }
    

@router.get("/get_cash_flow/{cash_flow_id}", response_model=Dict[str, Dict[str, object]])
async def get_cash_flow(cash_flow_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    cash_flow = await db.cash_flows.find_one({"_id": ObjectId(cash_flow_id)})
    cash_flow["_id"] = str(cash_flow['_id'])
    cash_flow['date_added'] = cash_flow['date_added'].strftime('%Y-%m-%d')
    cash_flow['date_of_transaction'] = cash_flow['date_of_transaction'].strftime('%Y-%m-%d')
    # Check if no cash_flows were found
    if not cash_flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No cash_flow found"
        )
    
    await create_custom_log(
        event= "get one cash_flow",
        user_id = user_id,
        account_id = user_id,
        objectid=None,
        page_number= None,
        new_doc = None,
        error= None
    )
    
    return {
        "data": {
            "item": cash_flow
        }
    }
    
@router.get("/get_options", response_model=Dict[str, Dict[str, object]])
async def get_options(token_data: dict = Depends(verify_token)):
    cached_options = await redis_client.get('cash_flows_options')
    
    if cached_options:
        # Return from cache if available
        return json.loads(cached_options)

    # If not in cache, generate options
    options = {
        "data": {
            "cash_flow_types": [cash_flow_type.value for cash_flow_type in CashFlowType]
        }
    }
    
    # Cache the options for future use (no expiration)
    redis_client.set('cash_flows_options', json.dumps(options), ex=0)  # Set expiration to 0 (no expiration)
    
    return options
    
@router.get("/report/daily", response_model=List[Dict[str, object]])
async def get_options(token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    cash_flows_data = await db.cash_flows.find({"user_id": user_id}, {"date_of_transaction": 1, "amount": 1}).to_list(length=None)

    # if not cash_flows_data:
    #     raise HTTPException(status_code=404, detail="No cash flows found.")
    
    df_cash_flows = pd.DataFrame(cash_flows_data)
    df_cash_flows['date_of_transaction'] = pd.to_datetime(df_cash_flows['date_of_transaction'])
    df_cash_flows['Day'] = df_cash_flows['date_of_transaction'].dt.strftime("%b %d")
    df_pivot_cf = pd.pivot_table(df_cash_flows, values=['amount'], index='Day', aggfunc='sum').reset_index()
    df_pivot_cf.columns = ['Day', 'Amount']
    df_pivot_cf['Amount Text'] = df_pivot_cf['Amount'].apply(lambda x: f"₱{locale.format_string('%.2f', x, grouping=True)}")

    expenses_data = await db.expenses.find({"user_id": user_id}, {"date_of_transaction": 1, "amount": 1}).to_list(length=None)
    df_expenses = pd.DataFrame(expenses_data)
    df_expenses['date_of_transaction'] = pd.to_datetime(df_expenses['date_of_transaction'])
    df_expenses['Day'] = df_expenses['date_of_transaction'].dt.strftime("%b %d")
    df_pivot_exp = pd.pivot_table(df_expenses, values=['amount'], index='Day', aggfunc='sum').reset_index()
    df_pivot_exp.columns = ['Day', 'Amount']
    df_pivot_exp['Amount Text'] = df_pivot_exp['Amount'].apply(lambda x: f"₱{locale.format_string('%.2f', x, grouping=True)}")

    df_report = pd.merge(left=df_pivot_cf, right=df_pivot_exp, how='outer', on='Day')
    df_report.columns = ['Day', 'Cash Flows', 'Cash Flows Label', 'Expenses', 'Expenses Label']

    return df_report.to_dict(orient="records")
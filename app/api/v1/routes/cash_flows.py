from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.expenses import CashFlows
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime
from app.core.custom_logging import create_custom_log
from typing import List, Dict
import math

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_cash_flow(cash_flow: CashFlows, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    cash_flow_data = {
        "date_added": datetime.now(),
        "user_id": user_id,
        "date_of_transaction": pd.to_datetime(cash_flow.date_of_transaction),
        "description": cash_flow.description,
        "price": cash_flow.price,
        "cash_flow_type": cash_flow.cash_flow_type,
        "platform": cash_flow.platform,
        "store": cash_flow.store,
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
    cash_flows = await db.cash_flows.find().skip(skip).limit(limit).to_list(length=limit)
    for i in cash_flows:
        i['_id'] = str(i['_id'])

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
        "response": {
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items": cash_flows
        }
    }
    
from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db, redis_client
from app.models.expenses import Biller, BillerType, AmountType
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token
import logging
from datetime import datetime
from typing import Dict
import math
from app.core.custom_logging import create_custom_log
import json

router = APIRouter()

@router.post("/")
async def create_biller(biller: Biller, token_data: dict = Depends(verify_token)):
    print(biller)
    user_id = token_data['account_id']
    payload = token_data['payload']
    biller_data = {
        "date_added": datetime.now(),
        "user_id": user_id,
        "biller_name": biller.biller_name,
        "biller_type": biller.biller_type.value,
        "amount_type": biller.amount_type.value,
        "amount": biller.amount,
        "custom_type": biller.custom_type,
        "usual_due_date_day": biller.usual_due_date_day,
        "remarks": biller.remarks,
        "account_id": user_id
    }
    print(biller_data)
    result = await db.billers.insert_one(biller_data)
    object_id = str(result.inserted_id)

    await create_custom_log(
        event= "create biller",
        user_id= user_id,
        account_id= user_id,
        objectid= object_id,
        old_doc= None,
        new_doc= None,
        error= None
    )

    return {"message": "Biller created successfully", "object_id": object_id}


@router.put("/{biller_id}")
async def update_biller(biller_id: str, updated_biller: Biller, token_data: dict = Depends(verify_token)):
    print(updated_biller)
    user_id = token_data['account_id']
    payload = token_data['payload']

    # Validate if the provided biller_id is a valid ObjectId
    if not ObjectId.is_valid(biller_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid biller ID format"
        )

    existing_biller = await db.billers.find_one({"_id": ObjectId(biller_id)})

    # Convert Pydantic model to dictionary and process the date field
    updated_data = updated_biller.dict()
    
    if "date_added" not in updated_data:
        updated_data["date_added"] = datetime.now()
    else:
        updated_data["date_added"] = pd.to_datetime(updated_data['date_added'])

    updated_data["date_updated"] = datetime.now()
    updated_data["biller_type"] = updated_data["biller_type"].value
    updated_data["amount_type"] = updated_data["amount_type"].value

    # Perform the update operation
    result = await db.billers.update_one(
        {"_id": ObjectId(biller_id)},
        {"$set": updated_data}
    )

    new_biller = await db.billers.find_one({"_id": ObjectId(biller_id)})

    await create_custom_log(
        event= "update biller",
        user_id= user_id,
        account_id= user_id,
        objectid= biller_id,
        old_doc= existing_biller,
        new_doc= new_biller,
        error= None
    )

    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Biller not found"
        )

    return {"message": "Biller updated successfully"}

@router.delete("/{biller_id}")
async def delete_biller(biller_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    print(f"Received token: {token_data['account_object']['token']}")
    logging.debug(f"Received token: {token_data['account_object']['token']}")

    existing_biller = await db.billers.find_one({"_id": ObjectId(biller_id)})
    
    # Validate if the provided biller_id is a valid ObjectId
    if not ObjectId.is_valid(biller_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid biller ID format"
        )

    # Perform the delete operation
    result = await db.billers.delete_one(
        {"_id": ObjectId(biller_id)}
    )

    await create_custom_log(
        event= "delete biller",
        user_id = user_id,
        account_id = user_id,
        objectid = biller_id,
        old_doc = existing_biller,
        new_doc = None,
        error= None
    )

    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Biller not found"
        )

    return {"message": "Biller deleted successfully"}

@router.get("/", response_model=Dict[str, Dict[str, object]])
async def get_billers(page: int = 1, limit: int = 10, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    if limit > 10:
        limit = 10

    # Calculate the skip value based on the page and limit
    skip = (page - 1) * limit

    # Fetch the paginated data from MongoDB
    billers = await db.billers.find().skip(skip).limit(limit).to_list(length=limit)
    for i in billers:
        i['_id'] = str(i['_id'])

    total_count = await db.billers.count_documents({})
    total_pages = math.ceil(total_count / limit)

    # Check if no billers were found
    if not billers:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No billers found"
        )
    
    await create_custom_log(
        event= "get billers",
        user_id = user_id,
        account_id = user_id,
        objectid=None,
        page_number= page,
        new_doc = None,
        error= None
    )
    
    return {
        "response": {
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items": billers
        }
    }
    
@router.get("/get_biller/{biller_id}", response_model=Dict[str, Dict[str, object]])
async def get_biller(biller_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    biller = await db.billers.find_one({"_id": ObjectId(biller_id)})
    biller["_id"] = str(biller['_id'])
    biller['date_added'] = biller['date_added'].strftime('%Y-%m-%d')
    # Check if no billers were found
    if not biller:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No biller found"
        )
    
    await create_custom_log(
        event= "get one biller",
        user_id = user_id,
        account_id = user_id,
        objectid=None,
        page_number= None,
        new_doc = None,
        error= None
    )
    
    return {
        "response": {
            "item": biller
        }
    }
    
@router.get("/get_options", response_model=Dict[str, Dict[str, object]])
async def get_options(token_data: dict = Depends(verify_token)):
    cached_options = await redis_client.get('billers_options')
    
    if cached_options:
        # Return from cache if available
        return json.loads(cached_options)

    # If not in cache, generate options
    options = {
        "response": {
            "biller_types": [biller_type.value for biller_type in BillerType],
            "amount_types": [amount_type.value for amount_type in AmountType]
        }
    }
    
    # Cache the options for future use (no expiration)
    redis_client.set('billers_options', json.dumps(options), ex=0)  # Set expiration to 0 (no expiration)
    
    return options
    
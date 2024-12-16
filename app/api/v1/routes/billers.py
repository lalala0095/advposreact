from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from app.models.expenses import Biller
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token
import logging
from datetime import datetime
from typing import Dict
import math

router = APIRouter()

@router.post("/")
async def create_biller(biller: Biller, token: str = Depends(verify_token)):
    # payload = await verify_token(token)
    biller_data = {
        "date_added": pd.to_datetime(biller.date_added),
        "biller_name": biller.biller_name,
        "biller_type": biller.biller_type.value,
        "amount_type": biller.amount_type.value,
        "amount": biller.amount,
        "custom_type": biller.custom_type,
        "usual_due_date_day": biller.usual_due_date_day,
        "remarks": biller.remarks
    }
    print(biller_data)
    result = await db.billers.insert_one(biller_data)
    object_id = str(result.inserted_id)
    return {"message": "Biller created successfully", "object_id": object_id}


@router.put("/{biller_id}")
async def update_biller(biller_id: str, updated_biller: Biller, token: str = Depends(verify_token)):
    # payload = await verify_token(token)

    # Validate if the provided biller_id is a valid ObjectId
    if not ObjectId.is_valid(biller_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid biller ID format"
        )

    # Convert Pydantic model to dictionary and process the date field
    updated_data = updated_biller.dict()
    updated_data["date_added"] = pd.to_datetime(updated_data["date_added"])
    updated_data["date_updated"] = datetime.now()
    updated_data["biller_type"] = updated_data["biller_type"].value
    updated_data["amount_type"] = updated_data["amount_type"].value

    # Perform the update operation
    result = await db.billers.update_one(
        {"_id": ObjectId(biller_id)},
        {"$set": updated_data}
    )

    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Biller not found"
        )

    return {"message": "Biller updated successfully"}

@router.delete("/{biller_id}")
async def delete_biller(biller_id: str, token: str = Depends(verify_token)):
    print(f"Received token: {token}")
    logging.debug(f"Received token: {token}")

    # You can call your verify_token function here to validate the token
    # payload = await verify_token(token)
    
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

    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Biller not found"
        )

    return {"message": "Biller deleted successfully"}

@router.get("/", response_model=Dict[str, Dict[str, object]])
async def get_billers(page: int = 1, limit: int = 10, token: str = Depends(verify_token)):
    # payload = await verify_token(token)

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

    return {
        "response": {
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items": billers
        }
    }
    
from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from app.models.expenses import Bill
import pandas as pd
from bson import ObjectId
from bson.errors import InvalidId
from app.core.auth import verify_token
import logging
from datetime import datetime
from typing import Dict, List
import math

router = APIRouter()

async def get_biller_object(object_id):
    print(f"Object id = {object_id}")
    biller_object = await db.billers.find_one({"_id": ObjectId(object_id)})

    if not biller_object:  # If no biller found in the first collection
        biller_object = await db.predefined_billers.find_one({"_id": ObjectId(object_id)})

    return biller_object

@router.post("/")
async def create_bill(bill: Bill, token: str = Depends(verify_token)):
    try:
        biller_object = await get_biller_object(bill.biller_object_id)

        bill_data = {
            "date_added": datetime.now(),
            "biller": biller_object,
            "total_amount_due": bill.total_amount_due,
            "minimum_amount_due": bill.minimum_amount_due,
            "urgency": bill.urgency.value,
            "due_date": pd.to_datetime(bill.due_date),
            "remarks": bill.remarks
        }
        # print(bill_data)

        result = await db.bills.insert_one(bill_data)
        object_id = str(result.inserted_id)
        return {"message": "Bill created successfully", "object_id": object_id}

    except InvalidId as e:
        biller_object = None
        return {"message": "Invalid ObjectId format", "error": str(e), "object_id": bill.biller_object_id}

@router.put("/{bill_id}")
async def update_bill(bill_id: str, updated_bill: Bill, token: str = Depends(verify_token)):
    # Validate if the provided bill_id is a valid ObjectId
    if not ObjectId.is_valid(bill_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid bill ID format"
        )

    # Convert Pydantic model to dictionary and process the date field
    updated_data = dict(updated_bill)

    biller_object = await get_biller_object(updated_data['biller_object_id'])

    updated_data["date_added"] = pd.to_datetime(updated_data["date_added"])
    updated_data["date_updated"] = datetime.now()
    updated_data["biller"] = biller_object
    updated_data["urgency"] = updated_data['urgency'].value
    updated_data["due_date"] = pd.to_datetime(updated_data['due_date']) 
    del updated_data['biller_object_id']
    print(updated_data)

    # Perform the update operation
    result = await db.bills.update_one(
        {"_id": ObjectId(bill_id)},
        {"$set": updated_data}
    )

    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bill not found"
        )

    return {"message": "Bill updated successfully"}

@router.delete("/{bill_id}")
async def delete_bill(bill_id: str, token: str = Depends(verify_token)):
    print(f"Received token: {token}")
    logging.debug(f"Received token: {token}")

    # You can call your verify_token function here to validate the token
    # payload = await verify_token(token)
    
    # Validate if the provided bill_id is a valid ObjectId
    if not ObjectId.is_valid(bill_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid bill ID format"
        )

    # Perform the delete operation
    result = await db.bills.delete_one(
        {"_id": ObjectId(bill_id)}
    )

    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bill not found"
        )

    return {"message": "Bill deleted successfully"}

@router.get("/", response_model=List[Dict[str, object]])
async def get_bills(page: int = 1, limit: int = 10, token: str = Depends(verify_token)):
    # payload = await verify_token(token)

    if limit > 10:
        limit = 10

    # Calculate the skip value based on the page and limit
    skip = (page - 1) * limit

    # Fetch the paginated data from MongoDB
    bills = await db.bills.find().skip(skip).limit(limit).to_list(length=limit)
    for i in bills:
        i['_id'] = str(i['_id'])
        i['biller']['_id'] = str(i['biller']['_id'])

    total_count = await db.bills.count_documents({})
    total_pages = math.ceil(total_count / limit)

    # Check if no bills were found
    if not bills:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No bills found"
        )

    return {
        "response": {
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items": bills
        }
    }
    
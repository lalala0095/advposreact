from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.expenses import CashFlows
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime

# # Set up logging
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_cash_flow(cash_flow: CashFlows, token: str = Depends(verify_token)):
    # payload = await verify_token(token)
    cash_flow_data = {
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
    return {"message": "Cash Flow created successfully", "object_id": object_id}


@router.put("/{cash_flow_id}")
async def update_cash_flow(cash_flow_id: str, updated_cash_flow: CashFlows, token: str = Depends(verify_token)):
    # payload = await verify_token(token)

    # Validate if the provided cash_flow_id is a valid ObjectId
    if not ObjectId.is_valid(cash_flow_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid cash_flow ID format"
        )

    # Convert Pydantic model to dictionary and process the date field
    updated_data = updated_cash_flow.dict()
    updated_data["date_of_transaction"] = pd.to_datetime(updated_data["date_of_transaction"])
    updated_data["date_updated"] = datetime.now()

    # Perform the update operation
    result = await db.cash_flows.update_one(
        {"_id": ObjectId(cash_flow_id)},  # Match the document with the provided ID
        {"$set": updated_data}          # Update with the new data
    )

    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cash Flow not found"
        )

    return {"message": "Cash Flow updated successfully"}

@router.delete("/{cash_flow_id}")
async def delete_cash_flow(cash_flow_id: str, token: str = Depends(verify_token)):
    print(f"Received token: {token}")
    logging.debug(f"Received token: {token}")  # Debug: Check if token is passed correctly
    
    # You can call your verify_token function here to validate the token
    # payload = await verify_token(token)
    
    # Validate if the provided cash_flow_id is a valid ObjectId
    if not ObjectId.is_valid(cash_flow_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid cash_flow ID format"
        )

    # Perform the delete operation
    result = await db.cash_flows.delete_one(
        {"_id": ObjectId(cash_flow_id)}  # Match the document with the provided ID
    )

    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cash Flow not found"
        )

    return {"message": "Cash Flow deleted successfully"}

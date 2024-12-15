from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.expenses import Expenses 
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging

# # Set up logging
# logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/expenses/")
async def create_expense(expense: Expenses):
    expense_data = {
        "date_of_transaction": pd.to_datetime(expense.date_of_transaction),
        "description": expense.description,
        "price": expense.price,
        "expense_type": expense.expense_type,
        "platform": expense.platform,
        "store": expense.store,
        "remarks": expense.remarks,
        "payment_method": expense.payment_method
    }
    print(expense_data)
    result = await db.expenses.insert_one(expense_data)
    object_id = str(result.inserted_id)
    # expense_id = str(result.inserted_id)
    # expense_inserted = db.expenses.find_one({"_id": ObjectId(expense_id)})
    # return {"message": "Expense created successfully", "data": expense_inserted}
    return {"message": "Expense created successfully", "object_id": object_id}


@router.put("/expenses/{expense_id}")
async def update_expense(expense_id: str, updated_expense: Expenses, token: str = Depends(oauth2_scheme)):
    payload = await verify_token(token)

    # Validate if the provided expense_id is a valid ObjectId
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid expense ID format"
        )

    # Convert Pydantic model to dictionary and process the date field
    updated_data = updated_expense.dict()
    updated_data["date_of_transaction"] = pd.to_datetime(updated_data["date_of_transaction"])

    # Perform the update operation
    result = await db.expenses.update_one(
        {"_id": ObjectId(expense_id)},  # Match the document with the provided ID
        {"$set": updated_data}          # Update with the new data
    )

    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )

    return {"message": "Expense updated successfully"}

@router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str, token: str = Depends(oauth2_scheme)):
    print(f"Received token: {token}")
    logging.debug(f"Received token: {token}")  # Debug: Check if token is passed correctly
    
    # You can call your verify_token function here to validate the token
    payload = await verify_token(token)
    
    # Validate if the provided expense_id is a valid ObjectId
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid expense ID format"
        )

    # Perform the delete operation
    result = await db.expenses.delete_one(
        {"_id": ObjectId(expense_id)}  # Match the document with the provided ID
    )

    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )

    return {"message": "Expense deleted successfully"}

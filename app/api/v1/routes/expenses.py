from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.expenses import Expenses 
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime
from app.core.custom_logging import create_custom_log

logging.basicConfig(
    level=logging.DEBUG
)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_expense(expense: Expenses, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    expense_data = {
        "date_inserted": datetime.now(),
        "user_id": user_id,
        "date_of_transaction": pd.to_datetime(expense.date_of_transaction),
        "description": expense.description,
        "price": expense.price,
        "expense_type": expense.expense_type.value,
        "platform": expense.platform.value,
        "store": expense.store,
        "remarks": expense.remarks,
        "payment_method": expense.payment_method
    }
    print(expense_data)
    result = await db.expenses.insert_one(expense_data)
    object_id = str(result.inserted_id)
    new_doc = await db.expenses.find_one({"_id": ObjectId(result.inserted_id)})
    await create_custom_log(
        event= "add expense",
        objectid=result.inserted_id,
        user_id = user_id,
        new_doc=new_doc
    )
    return {"message": "Expense created successfully", "object_id": object_id}


@router.put("/{expense_id}")
async def update_expense(expense_id: str, updated_expense: Expenses, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    # Validate if the provided expense_id is a valid ObjectId
    if not ObjectId.is_valid(expense_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid expense ID format"
        )
    old_doc = await db.expenses.find_one({"_id": ObjectId(expense_id)})

    # Convert Pydantic model to dictionary and process the date field
    updated_data = updated_expense.dict()
    updated_data["date_of_transaction"] = pd.to_datetime(updated_data["date_of_transaction"])
    updated_data["date_updated"] = datetime.now()
    updated_data['expense_type'] = updated_data['expense_type'].value
    updated_data['platform'] = updated_data['platform'].value
    logging.debug(str(updated_data))
    # Perform the update operation
    result = await db.expenses.update_one(
        {"_id": ObjectId(expense_id)},  # Match the document with the provided ID
        {"$set": updated_data}          # Update with the new data
    )
    new_doc = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    await create_custom_log(
        event= "update expense",
        user_id = user_id,
        objectid = expense_id,
        old_doc=old_doc,
        new_doc=new_doc
    )
    # Check if the document was updated
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )

    return {"message": "Expense updated successfully"}

@router.delete("/{expense_id}")
async def delete_expense(expense_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    old_doc = await db.expenses.find_one({"_id": ObjectId(expense_id)})

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
    await create_custom_log(
        event= "delete expense",
        user_id = user_id,
        old_doc=old_doc
    )

    # Check if the document was deleted
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )

    return {"message": "Expense deleted successfully"}

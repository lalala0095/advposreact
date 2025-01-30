from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
from app.models.expenses import Expenses, ExpenseType, ExpensePlatform
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime
from app.core.custom_logging import create_custom_log
import math
from typing import List, Dict
from app.core.database import redis_client
import json
import locale

# logging.basicConfig(
#     level=logging.DEBUG
# )

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def create_expense(expense: Expenses, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    expense_data = {
        "date_added": datetime.now(),
        "user_id": user_id,
        "date_of_transaction": pd.to_datetime(expense.date_of_transaction).strftime("%Y-%m-%d"),
        "description": expense.description,
        "amount": expense.amount,
        "expense_type": expense.expense_type.value,
        "platform": expense.platform.value,
        "store": expense.store,
        "remarks": expense.remarks,
        "payment_method": expense.payment_method
    }
    logging.debug(expense_data)
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
    updated_data["date_of_transaction"] = pd.to_datetime(updated_data["date_of_transaction"]).strftime("%Y-%m-%d")
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

@router.get("/get_expense/{expense_id}", response_model=Dict[str, Dict[str, object]])
async def get_expense(expense_id: str, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    expense = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    expense["_id"] = str(expense['_id'])
    # expense['date_added'] = expense['date_added'].strftime('%Y-%m-%d')
    expense['date_of_transaction'] = expense['date_of_transaction'].strftime('%Y-%m-%d')
    logging.debug(expense['date_of_transaction'])
    # Check if no expenses were found
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No expense found"
        )
    
    await create_custom_log(
        event= "get one expense",
        user_id = user_id,
        account_id = user_id,
        objectid=None,
        page_number= None,
        new_doc = None,
        error= None
    )
    
    return {
        "data": {
            "item": expense
        }
    }
    

@router.get("/", response_model=Dict[str, object])
async def get_expenses(page: int = 1, limit: int = 10, token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']

    if limit > 10:
        limit = 10

    # Calculate the skip value based on the page and limit
    skip = (page - 1) * limit

    # Fetch the paginated data from MongoDB
    expenses = await db.expenses.find({"user_id": user_id}).skip(skip).limit(limit).to_list(length=limit)
    if not expenses:
        return {
            "data": {
                "limit": limit,
                "page": page,
                "total_pages": 1,
                "total_items": 0,
                "items": []
            }
        }
    for i in expenses:
        i['_id'] = str(i['_id'])

    total_count = await db.expenses.count_documents({"user_id": user_id})
    total_pages = math.ceil(total_count / limit)

    await create_custom_log(
        event= "get expenses",
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
            "items": expenses
        }
    }
    

@router.get("/get_options", response_model=Dict[str, Dict[str, object]])
async def get_options(token_data: dict = Depends(verify_token)):
    cached_options = await redis_client.get('expenses_options')
    
    if cached_options:
        # Return from cache if available
        return json.loads(cached_options)

    # If not in cache, generate options
    options = {
        "data": {
            "expense_types": [expense_type.value for expense_type in ExpenseType],
            "platforms": [platform.value for platform in ExpensePlatform]
        }
    }
    
    # Cache the options for future use (no expiration)
    redis_client.set('expenses_options', json.dumps(options), ex=0)  # Set expiration to 0 (no expiration)
    
    return options

@router.get("/report/daily", response_model=List[Dict[str, object]])
async def get_options(token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    expenses_data = await db.expenses.find({"user_id": user_id}).to_list(length=None)

    if not expenses_data:
        raise HTTPException(status_code=404, detail="No expenses found.")
    
    df = pd.DataFrame(expenses_data)
    df['date_of_transaction'] = pd.to_datetime(df['date_of_transaction'])
    df['Day'] = df['date_of_transaction'].dt.strftime("%b %d")
    df_pivot = pd.pivot_table(df, values=['amount'], index='Day', aggfunc='sum').reset_index()
    df_pivot.columns = ['Day', 'Amount']

    df_pivot['Amount Text'] = df_pivot['Amount'].apply(lambda x: f"₱{locale.format_string('%.2f', x, grouping=True)}")

    return df_pivot.to_dict(orient="records")

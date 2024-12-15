from pydantic import BaseModel, EmailStr, Field, ValidationError
from typing import Literal, Optional
from datetime import date

class Expenses(BaseModel):
    date_of_transaction: date = Field(..., description="The date when the transaction occurred")
    description: str = Field(..., max_length=255, description="Description of the expense")
    price: float = Field(..., ge=0, description="Price of the expense")
    expense_type: str = Field(..., max_length=100, description="Type/category of the expense")
    platform: str = Field(..., max_length=100, description="Platform where the expense was made")
    store: str = Field(..., max_length=255, description="Store or vendor name")
    remarks: str = Field(None, max_length=1000, description="Additional remarks or notes")
    payment_method: str = Field(..., max_length=100, description="Payment method used for the expense")

    

from pydantic import BaseModel, EmailStr, Field, ValidationError
from enum import Enum
from typing import Literal, Optional
from datetime import date

fields = ['utilities', 'rent', 'loan', 'credit_card', 'investment', 'insurance', 'others']
BillerType = Enum(
    "BillerType",
    {field: field.replace('_', '').title() for field in fields}
)

fields = ['fix', 'changing']
AmountType = Enum(
    "AmountType",
    {field: field.replace('_', '').title() for field in fields}
)

class Biller(BaseModel):
    biller_name: str = Field(..., max_length=100, description="Biller Name")
    biller_type: BillerType = Field(..., description="Choose if it the amount changes or not")
    amount_type: AmountType = Field(..., description="Choose if it the amount changes or not")
    amount: float = Field(0, ge=0, description="Amount (Leave Blank if Amount Type = Changing)")
    custom_type: str = Field(..., max_length=255, description="Custom Type")
    usual_due_date_day: int = Field(1, ge=1, le=31, description="Usual Due Date Day")
    remarks: str = Field(..., max_length=500, description="Remarks")

fields = ['need', 'want']
ExpenseType = Enum(
    "ExpenseType",
    {field: field.replace('_', '').title() for field in fields}
)
fields = ['Shopee', 'Tiktok', 'Lazada', 'Physical Store', 'Amazon', 'Ali Express', 'Others']
ExpensePlatform = Enum(
    "ExpensePlatform",
    {field: field.replace('_', '').title() for field in fields}
)
class Expenses(BaseModel):
    date_of_transaction: date = Field(..., description="The date when the transaction occurred")
    description: str = Field(..., max_length=255, description="Description of the expense")
    price: float = Field(..., ge=0, description="Price of the expense")
    expense_type: ExpenseType = Field(..., description="Type/category of the expense")
    platform: ExpensePlatform = Field(..., description="Platform where the expense was made")
    store: str = Field(..., max_length=255, description="Store or vendor name")
    remarks: str = Field(None, max_length=1000, description="Additional remarks or notes")
    payment_method: str = Field(..., max_length=100, description="Payment method used for the expense")

class CashFlows(BaseModel):
    date_of_transaction: date = Field(..., description="The date when the transaction occurred")
    description: str = Field(..., max_length=255, description="Description of the cash flow")
    price: float = Field(..., ge=0, description="Price of the cash flow")
    expense_type: str = Field(..., max_length=100, description="Type/category of the cash flow")
    platform: str = Field(..., max_length=100, description="Platform where the cash flow was made")
    store: str = Field(..., max_length=255, description="Store or vendor name")
    remarks: str = Field(None, max_length=1000, description="Additional remarks or notes")
    payment_method: str = Field(..., max_length=100, description="Payment method used for the cash flow")

fields = ['urgent', 'normal', 'low']
BillType = Enum(
    "BillType",
    {field: field.replace('_', '').title() for field in fields}
)
class Bill(BaseModel):
    biller_object_id: str = Field(..., max_length=100, description="The ObjectId of the specified Biller")
    total_amount_due: float = Field(0, ge=0, description="Total Amount Due")
    minimum_amount_due: float = Field(0, ge=0, description="Minimum Amount Due")
    urgency: BillType = Field(..., description="Urgency")
    due_date: date = Field(..., description="Due date")
    remarks: str = Field(..., max_length=500, description="Remarks")



from pydantic import BaseModel, EmailStr, Field, ValidationError
from typing import Literal, Optional

class AdminSignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    name: str = Field(..., max_length=100)
    email: EmailStr
    subscription: Literal["Free", "Basic", "Premium"]

    class Config:
        schema_extra = {
            "example": {
                "username": "admin_user",
                "password": "securepassword",
                "confirm_password": "securepassword",
                "name": "Admin Account",
                "email": "admin@example.com",
                "subscription": "basic"
            }
        }

class LoginRequest(BaseModel):
    username: Optional[str] = None
    # email: Optional[EmailStr] = None
    password: str


def is_email(value: str) -> bool:
    try:
        EmailStr.validate(value)
        return True
    except ValidationError:
        return False
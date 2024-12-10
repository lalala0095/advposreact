from fastapi import APIRouter, HTTPException, status, Depends
from app.models.accounts import AdminSignupRequest, LoginRequest
from app.core.database import db
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def admin_signup(admin: AdminSignupRequest):
    if admin.password != admin.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # Check if username or email already exists
    existing_admin = await db.admins.find_one({"$or": [
        {"username": admin.username}, {"email": admin.email}
    ]})
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered."
        )

    # Hash the password
    hashed_password = pwd_context.hash(admin.password)

    # Insert into MongoDB
    admin_data = {
        "username": admin.username,
        "password": hashed_password,
        "name": admin.name,
        "email": admin.email,
        "subscription": admin.subscription
    }
    result = await db.admins.insert_one(admin_data)
    return {"message": "Admin account created successfully", "id": str(result.inserted_id)}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/login")
async def login(request: LoginRequest):
    # Check if either email or username is provided
    if not request.username:
        raise HTTPException(status_code=400, detail="Username or Email is required")

    # Find the user based on username or email (await the query)
    user = None
    if "@" in request.username:  # If the input contains "@" it is likely an email
        user = await db.admins.find_one({"email": request.username})
    else:  # Otherwise, it is treated as a username
        user = await db.admins.find_one({"username": request.username})

    # If user doesn't exist
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect Username/Email or Password.")

    # Verify password
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Successful login
    return {"message": "Login successful", "user_id": str(user["_id"])}  # Return user data as needed
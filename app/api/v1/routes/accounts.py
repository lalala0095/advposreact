from fastapi import Request, Response, APIRouter, HTTPException, status, Depends
from app.models.accounts import AdminSignupRequest, LoginRequest
from app.core.database import db
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import logging
from app.core.config import settings
from app.core.auth import store_token_in_redis, delete_token_from_redis, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.core.custom_logging import create_custom_log
from app.core.auth import verify_token
from datetime import datetime

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # tokenUrl points to the /login endpoint
expiration_duration = ACCESS_TOKEN_EXPIRE_MINUTES * 60

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def admin_signup(admin: AdminSignupRequest):
    if admin.password != admin.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match.")

    existing_admin = await db.accounts.find_one({"$or": [{"username": admin.username}, {"email": admin.email}]})
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already registered.")

    hashed_password = pwd_context.hash(admin.password)

    admin_data = {
        "date_inserted": datetime.now(),
        "username": admin.username,
        "password": hashed_password,
        "name": admin.name,
        "email": admin.email,
        "subscription": admin.subscription
    }
    result = await db.accounts.insert_one(admin_data)
    await create_custom_log(
        event= "account signup",
        user_id= None,
        account_id= result['_id'],
        objectid= result['_id'],
        old_doc= None,
        new_doc= result,
        error= None
    )
    return {"message": "Admin account created successfully", "id": str(result.inserted_id)}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/login")
async def login(request: LoginRequest):
    if not request.username:
        raise HTTPException(status_code=400, detail="Username or Email is required")

    user = await db.accounts.find_one({"$or": [{"username": request.username}, {"email": request.username}]})
    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid Credentials.")

    access_token = create_access_token(data={"sub": str(user["_id"])})

    # Store the token in Redis with expiration
    await store_token_in_redis(user_id=str(user["_id"]), token=access_token, expiration=expiration_duration)

    await create_custom_log(
        event= "account login",
        user_id= user['_id'],
        account_id= user['_id'],
        objectid= user['_id'],
        old_doc= None,
        new_doc= None,
        error= None
    )

    return {"access_token": access_token, 
            "token_expiration": f"{expiration_duration / 60:.0f} minutes" ,
            "token_type": "bearer",
            "account_id": str(user['_id'])}

# Define the /protected route
@router.get("/protected")
async def protected_route(token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    payload = token_data['payload']
    try:
        user_id = payload.get("sub")

        logging.debug(f"Token decoded successfully: {payload}")

        return {"message": "Access granted", "user_id": user_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

@router.post("/logout")
async def logout(token: str = Depends(verify_token)):
    try:
        # Decode the token to find the user ID
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token.")

        # Delete the token from Redis
        await delete_token_from_redis(user_id)

        return {"message": "Logged out successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error revoking token: {str(e)}")

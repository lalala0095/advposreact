from fastapi import Request, Response, APIRouter, HTTPException, status, Depends
from app.models.accounts import AdminSignupRequest, LoginRequest
from app.core.database import db
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import logging
from app.core.config import settings
from app.core.auth import store_token_in_redis, delete_token_from_redis, ALGORITHM, create_access_token
from app.core.custom_logging import create_custom_log
from app.core.auth import verify_token
from datetime import datetime, timedelta
from bson import ObjectId
import json

router = APIRouter()
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # tokenUrl points to the /login endpoint
expiration_duration = 3600
logging.basicConfig(level=logging.DEBUG)

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def admin_signup(admin: AdminSignupRequest):
    if admin.password != admin.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match.")

    existing_admin = await db.accounts.find_one({"$or": [{"username": admin.username}, {"email": admin.email}]})
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already registered.")

    hashed_password = pwd_context.hash(admin.password)
    registration_datetime = datetime.now()
    expiration = datetime.now() + timedelta(days=30)
    admin_data = {
        "date_added": registration_datetime,
        "username": admin.username,
        "password": hashed_password,
        "name": admin.name,
        "email": admin.email,
        "subscription": admin.subscription,
        "subscription_expiration": expiration,
        "role": "root"
    }
    result = await db.accounts.insert_one(admin_data)
    inserted_id = result.inserted_id
    new_doc = await db.accounts.find_one({"_id": ObjectId(inserted_id)})
    await create_custom_log(
        event= "account signup",
        account_id= None,
        user_id= inserted_id,
        objectid= inserted_id,
        old_doc= None,
        new_doc= new_doc,
        error= None
    )
    return {"message": "Admin account created successfully", 
            "account_id": str(inserted_id), 
            "subscription_expiration": expiration}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/login")
async def login(request: LoginRequest):
    if not request.username:
        raise HTTPException(status_code=400, detail="Username or Email is required")

    user = await db.accounts.find_one({"$or": [{"username": request.username}, {"email": request.username}]})
    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid Credentials.")
    # user_dict = json.dumps(user)

    access_token = create_access_token(data={"sub": str(user['_id'])})
    logging.debug(f"access token: {access_token}")
    logging.debug(f"access token type: {type(access_token)}")
    
    # Store the token in Redis with expiration
    await store_token_in_redis(account_id=str(user["_id"]), token=access_token)

    await create_custom_log(
        event= "account login",
        account_id= str(user['_id']),
        user_id= str(user['_id']),
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
    logging.debug(token_data)
    account_id = token_data['account_id']
    payload = token_data['payload']
    account_object = token_data['account_object']
    try:
        logging.debug(f"Token decoded successfully: {payload}")

        return {"message": "Access granted", "account_id": account_id, "account_object": account_object}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

@router.post("/logout")
async def logout(token_data: str = Depends(verify_token)):
    account_id = token_data['account_id']
    payload = token_data['payload']
    account_object = token_data['account_object']
    access_token = account_object['token']
    try:
        # Decode the token to find the user ID
        payload = jwt.decode(access_token, settings.secret_key, algorithms=[ALGORITHM])
        if not account_id:
            raise HTTPException(status_code=401, detail="Invalid token.")

        # Delete the token from Redis
        await delete_token_from_redis(account_id)

        return {"message": "Logged out successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error revoking token: {str(e)}")

@router.get("/get_options")
async def get_options():
    try:
        return {"options": [
            "Free", "Basic", "Premium"
        ]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error revoking token: {str(e)}")

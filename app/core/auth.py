import jwt
from fastapi import HTTPException, Depends, status
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer, OAuth2AuthorizationCodeBearer
import logging
import redis.asyncio as redis
from datetime import datetime, timedelta
from app.core.database import db, redis_client
from bson import ObjectId
import json
import pandas as pd

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/accounts/login", scopes={"read": "Read access", "write": "Write access"})

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_token.decode('utf-8')

async def store_token_in_redis(account_id: str, token: str, expiration: int = 3600):
    """
    Store a token in Redis with an expiration time.
    :param account_id: The key (account ID or subject in JWT).
    :param token: The token to store.
    :param expiration: Time in seconds before the token expires.
    """
    account_object = await db.accounts.find_one({"_id": ObjectId(account_id)})
    account_object["sub"] = str(account_object["_id"])
    del account_object["_id"] 
    del account_object["date_added"]
    try:
        del account_object["date_synched"]
    except Exception as e:
        print(e)
    del account_object["password"]
    account_object['token'] = token
    account_object['subscription_expiration'] = pd.to_datetime(account_object['subscription_expiration']).strftime("%Y-%m-%d %H:%M")
    serialized_object = json.dumps(account_object)
    try:
        await redis_client.setex(account_id, 
                                expiration,
                                serialized_object)
    except redis.RedisError as e:
        logger.error(e)
        logger.error("Failed to store token in Redis: %s", e)
        logger.error(f"Redis client URL: redis: {settings.redis_url}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to store token in Redis"
        )

async def get_token_from_redis(account_id: str):
    """
    Retrieve a token from Redis.
    :param account_id: The key (account ID or subject in JWT).
    :return: The token if found, otherwise None.
    """
    try:
        account_object = await redis_client.get(account_id)
        logger.debug(account_object)
        account_object_dict = json.loads(account_object)
        return account_object_dict
    except TypeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to process event, please contact us developers.",
            "others_details": str(e)}
        )
    except redis.RedisError as e:
        logger.error("Failed to retrieve token from Redis: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve token from Redis"
        )

# Dependency to validate the access token from Redis
async def verify_token(token: str = Depends(oauth2_scheme)):
    if not isinstance(token, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token format"
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        account_id = payload.get("sub")
        if not account_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        stored_token_dict = await get_token_from_redis(account_id)
        try:
            stored_token = stored_token_dict['token']
            if not stored_token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token not found in Redis"
                )

            # Compare the token from the request with the one stored in Redis
            if stored_token != token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token mismatch or invalid"
                )
            
            # logging.debug(f"User ID from token: {account_id}: {stored_token}")
            return {"account_id": account_id, "payload": payload, "account_object": stored_token_dict}

        except TypeError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token."
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.PyJWTError as e:
        logging.error("JWT error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except redis.RedisError as e:
        logging.error("Redis error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Redis error"
        )

async def delete_token_from_redis(account_id: str):
    """
    Delete a token from Redis.
    :param account_id: The key (account ID or subject in JWT).
    """
    try:
        await redis_client.delete(account_id)
    except redis.RedisError as e:
        logger.error("Failed to delete token from Redis: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete token from Redis"
        )

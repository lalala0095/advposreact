import jwt
from fastapi import HTTPException, Depends, status
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer, OAuth2AuthorizationCodeBearer
import logging
import redis.asyncio as redis
from datetime import datetime, timedelta

# Set up logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/accounts/login", scopes={"read": "Read access", "write": "Write access"})

# Use a single Redis client with async support
redis_client = redis.from_url(f"{settings.redis_url}", decode_responses=True)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "role": "admin"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def store_token_in_redis(user_id: str, token: str, expiration: int = 3600):
    """
    Store a token in Redis with an expiration time.
    :param user_id: The key (user ID or subject in JWT).
    :param token: The token to store.
    :param expiration: Time in seconds before the token expires.
    """
    try:
        await redis_client.setex(user_id, expiration, token)
    except redis.RedisError as e:
        logger.error(e)
        logger.error("Failed to store token in Redis: %s", e)
        logger.error(f"Redis client URL: redis: {settings.redis_url}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to store token in Redis"
        )

async def get_token_from_redis(user_id: str):
    """
    Retrieve a token from Redis.
    :param user_id: The key (user ID or subject in JWT).
    :return: The token if found, otherwise None.
    """
    try:
        return await redis_client.get(user_id)
    except redis.RedisError as e:
        logger.error("Failed to retrieve token from Redis: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve token from Redis"
        )

async def delete_token_from_redis(user_id: str):
    """
    Delete a token from Redis.
    :param user_id: The key (user ID or subject in JWT).
    """
    try:
        await redis_client.delete(user_id)
    except redis.RedisError as e:
        logger.error("Failed to delete token from Redis: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete token from Redis"
        )

# Dependency to validate the access token from Redis
async def verify_token(token: str = Depends(oauth2_scheme)):
    logging.debug(f"Received token: {token}")

    if not isinstance(token, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token format"
        )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        # Fetch the stored token from Redis for the given user_id
        stored_token = await redis_client.get(user_id)

        if not stored_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token not found in Redis"
            )

        # Decode the stored token (as it may be returned in bytes format)
        # stored_token = stored_token.decode('utf-8')

        # If stored_token is bytes, decode it to string
        if isinstance(stored_token, bytes):
            stored_token = stored_token.decode('utf-8')
        
        logging.debug(f"Stored token in Redis for user {user_id}: {stored_token}")

        # Compare the token from the request with the one stored in Redis
        if stored_token != token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token mismatch or invalid"
            )
        
        logging.debug(f"User ID from token: {user_id}: {stored_token}")
        return payload

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


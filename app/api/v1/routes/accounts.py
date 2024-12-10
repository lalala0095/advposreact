from fastapi import Request, Response, APIRouter, HTTPException, status, Depends
from app.models.accounts import AdminSignupRequest, LoginRequest
from app.core.database import db
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
import redis
import logging
from app.core.config import settings

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # tokenUrl points to the /login endpoint

# Initialize the Redis connection
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "role": "admin"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def admin_signup(admin: AdminSignupRequest):
    if admin.password != admin.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match.")

    existing_admin = await db.admins.find_one({"$or": [{"username": admin.username}, {"email": admin.email}]})
    if existing_admin:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username or email already registered.")

    hashed_password = pwd_context.hash(admin.password)

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
    if not request.username:
        raise HTTPException(status_code=400, detail="Username or Email is required")

    user = await db.admins.find_one({"$or": [{"username": request.username}, {"email": request.username}]})
    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid Credentials.")

    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}

# Define the /protected route
@router.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token.")

        logging.debug(f"Token decoded successfully: {payload}")

        return {"message": "Access granted", "user_id": user_id}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    try:
        # Mark token as revoked in Redis (this simulates logout)
        redis_client.setex(token, 3600, "revoked")  # Token will be revoked for 1 hour
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error revoking token: {str(e)}")

def revoke_token(token: str):
    redis_client.setex(token, 3600, "revoked")  # Store the token as revoked in Redis (expires in 1 hour)

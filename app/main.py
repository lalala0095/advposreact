from fastapi import FastAPI
from app.api.v1.routes.accounts import router as admin_router
from itsdangerous import URLSafeSerializer
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI(title="CRM Backend")
serializer = URLSafeSerializer(settings.secret_key)  # Replace with your secret key

# Register routes
app.include_router(admin_router, prefix="/api/v1/accounts", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Admin API"}

@app.get("/favicon.ico")
def favicon():
    return {"message": "Favicon not found"}

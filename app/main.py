from fastapi import FastAPI, Depends, HTTPException, status
from app.api.v1.routes.accounts import router as admin_router
from itsdangerous import URLSafeSerializer
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from app.api.v1.routes.expenses import router as expense_router
from app.api.v1.routes.cash_flows import router as cash_flow_router
from app.api.v1.routes.billers import router as biller_router
from app.api.v1.routes.bills import router as bill_router

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/accounts/login",
                                     scopes={"read": "Read access", "write": "Write access"})

app = FastAPI(title="CRM Backend")
serializer = URLSafeSerializer(settings.secret_key)  # Replace with your secret key

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="My FastAPI App",
        version="1.0.0",
        description="This is a custom OpenAPI schema",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    # openapi_schema["tags"] = [
    #     { "name": "Accounts", "description": "Account related operations" }
    # ]
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Register routes
app.include_router(admin_router, prefix="/api/v1/accounts", tags=["Admin"])
app.include_router(expense_router, prefix="/api/v1/expenses", tags=["Expense"])
app.include_router(cash_flow_router, prefix="/api/v1/cash_flows", tags=["Cash Flow"])
app.include_router(biller_router, prefix="/api/v1/billers", tags=["Biller"])
app.include_router(bill_router, prefix="/api/v1/bills", tags=["Bills"], )

@app.get("/")
def read_root():
    return {"message": "Welcome to the AdvPOS API Dev page"}

@app.get("/favicon.ico")
def favicon():
    return {"message": "Favicon not found"}

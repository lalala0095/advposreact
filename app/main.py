from fastapi import FastAPI, Depends, HTTPException, status
from app.api.v1.routes.accounts import router as admin_router
from itsdangerous import URLSafeSerializer
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer
from fastapi.openapi.utils import get_openapi
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes.expenses import router as expense_router
from app.api.v1.routes.cash_flows import router as cash_flow_router
from app.api.v1.routes.billers import router as biller_router
from app.api.v1.routes.bills import router as bill_router
from app.api.v1.routes.support_tickets import router as support_ticket_router
from app.api.v1.routes.reports import router as report_router
from app.api.v1.routes.planners import router as planner_router

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/accounts/login",
                                     scopes={"read": "Read access", "write": "Write access"})

app = FastAPI(title="CRM Backend")
serializer = URLSafeSerializer(settings.secret_key)  # Replace with your secret key

origins = [
    "http://localhost:3000",
    "http://120.29.98.34:3000",
    "http://127.0.0.1:3000",
    "http://13.250.253.210:3000",
    "https://advposapp.com",
    "https://expensechatbot.store"
]

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="My FastAPI App",
        version="1.0.0",
        description="""
        This is a custom OpenAPI schema for Adv POS App developed by Lemuel Torrefiel.\n
        For Autorization, signup with the /api/v1/accounts/signup endpoint, then /api/v1/accounts/login to get your Bearer access token.\n
        Include the access token for all of the REST requests the you'll be making.\n
        Have fun using the service. 
        """,
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
app.include_router(report_router, prefix="/api/v1/reports", tags=["Reports"], )
app.include_router(bill_router, prefix="/api/v1/bills", tags=["Bills"], )
app.include_router(planner_router, prefix="/api/v1/planners", tags=["Planners"], )
app.include_router(support_ticket_router, prefix="/api/v1/support_tickets", tags=["Support Tickets"], )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/", include_in_schema=False)
def read_root():
    return RedirectResponse(url="/docs")

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return {"message": "Favicon not found"}

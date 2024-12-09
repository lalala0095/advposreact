from fastapi import FastAPI
from app.api.v1.routes.admin import router as admin_router

app = FastAPI(title="CRM Backend")

# Register routes
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Admin API"}

@app.get("/favicon.ico")
def favicon():
    return {"message": "Favicon not found"}

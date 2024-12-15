from fastapi import APIRouter, HTTPException, status, Depends
from app.core.database import db
from passlib.context import CryptContext
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime
from pymongo import MongoClient
from app.core.config import settings

async def create_custom_log(event, user_id, account_id, objectid, old_doc, new_doc, error):
    custom_log_data = {
        "date_of_transaction": datetime.now(),
        "event": event,
        "user_id": user_id,
        "account_id": account_id,
        "object_id": objectid,
        "old_doc": old_doc,
        "new_doc": new_doc,
        "error": error
    }

    result = await db.logs.insert_one(custom_log_data)
    object_id = str(result.inserted_id)
    return {"message": "Log created successfully", "object_id": object_id}

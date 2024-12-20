from fastapi import APIRouter, HTTPException, status, Depends, Form, UploadFile, File
from app.core.database import db
from app.core.config import settings
from app.models.support_tickets import SupportTicket, TicketType, Urgency
import pandas as pd
from bson import ObjectId
from app.core.auth import verify_token, oauth2_scheme
import logging
from datetime import datetime, date
from app.core.custom_logging import create_custom_log
import math
from typing import List, Dict, Optional
from uuid import uuid4
import boto3
import mimetypes

# logging.basicConfig(
#     level=logging.DEBUG
# )

router = APIRouter()
s3_bucket = settings.s3_bucket
s3_base_url = settings.s3_base_url
s3_client = boto3.client("s3")

@router.post("/")
async def create_support_ticket(date_of_the_ticket: date = Form(...),
                                support_ticket_subject: str = Form(...),
                                support_ticket_type: TicketType = Form(...),
                                urgency: Urgency = Form(...),
                                details: str = Form(...),
                                attachments: List[UploadFile] = File(...),
                                token_data: dict = Depends(verify_token)):
    user_id = token_data['account_id']
    logging.debug("now starting upload")
    if len(attachments) >= 3:
        raise HTTPException(
            status_code=400, detail="You can only upload up to 3 attachments"
        )
    attachment_urls = []
    for file in attachments:
        file_key = f"support_ticket_attachments/{user_id}-{str(uuid4())[0:8]}-{file.filename}"
        mime_type, _ = mimetypes.guess_type(file.filename)
        if mime_type is None:
            mime_type = "application/octet-stream"
        try:
            s3_client.upload_fileobj(
                file.file,
                s3_bucket,
                file_key,
                ExtraArgs={"ContentType": mime_type}
            )
            attachment_urls.append(f"{s3_base_url}/{file_key}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading file: {e}")
    support_ticket_data = {
        "date_inserted": datetime.now(),
        "user_id": user_id,
        "date_of_the_ticket": pd.to_datetime(date_of_the_ticket),
        "support_ticket_subject": support_ticket_subject,
        "support_ticket_type": support_ticket_type.value,
        "urgency": urgency.value,
        "details": details,
        "attachments": attachment_urls
    }
    result = await db.support_tickets.insert_one(support_ticket_data)
    object_id = str(result.inserted_id)
    new_doc = await db.support_tickets.find_one({"_id": ObjectId(result.inserted_id)})
    await create_custom_log(
        event= "add support_ticket",
        objectid=result.inserted_id,
        user_id = user_id,
        new_doc=new_doc
    )
    return {"message": "Support Ticket created successfully", "object_id": object_id}

@router.post("/test_post")
async def test_post(attachments: List[UploadFile] = File(...)):
    if len(attachments) >= 3:
        raise HTTPException(
            status_code=400, detail="You can only upload up to 3 attachments"
        )
    attachment_urls = []
    for file in attachments:
        file_key = f"support_ticket_attachments/{uuid4()}-{file.filename}"
        try:
            s3_client.upload_fileobj(
                file.file,
                s3_bucket,
                file_key,
                ExtraArgs={"ContentType": file.content_type}
            )
            attachment_urls.append(f"{s3_base_url}/{file_key}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading file: {e}")
    support_ticket_data = {
        "date_inserted": datetime.now(),
        "attachments": attachment_urls
    }
    print(support_ticket_data)
    result = await db.support_tickets.insert_one(support_ticket_data)
    object_id = str(result.inserted_id)
    return {"message": "Support Ticket created successfully", "object_id": object_id}


# @router.put("/{support_ticket_id}")
# async def update_support_ticket(support_ticket_id: str, updated_support_ticket: Support Tickets, token_data: dict = Depends(verify_token)):
#     user_id = token_data['account_id']
#     payload = token_data['payload']

#     # Validate if the provided support_ticket_id is a valid ObjectId
#     if not ObjectId.is_valid(support_ticket_id):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid support_ticket ID format"
#         )
#     old_doc = await db.support_tickets.find_one({"_id": ObjectId(support_ticket_id)})

#     # Convert Pydantic model to dictionary and process the date field
#     updated_data = updated_support_ticket.dict()
#     updated_data["date_of_transaction"] = pd.to_datetime(updated_data["date_of_transaction"])
#     updated_data["date_updated"] = datetime.now()
#     updated_data['support_ticket_type'] = updated_data['support_ticket_type'].value
#     updated_data['platform'] = updated_data['platform'].value
#     logging.debug(str(updated_data))
#     # Perform the update operation
#     result = await db.support_tickets.update_one(
#         {"_id": ObjectId(support_ticket_id)},  # Match the document with the provided ID
#         {"$set": updated_data}          # Update with the new data
#     )
#     new_doc = await db.support_tickets.find_one({"_id": ObjectId(support_ticket_id)})
#     await create_custom_log(
#         event= "update support_ticket",
#         user_id = user_id,
#         objectid = support_ticket_id,
#         old_doc=old_doc,
#         new_doc=new_doc
#     )
#     # Check if the document was updated
#     if result.matched_count == 0:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Support Ticket not found"
#         )

#     return {"message": "Support Ticket updated successfully"}

# @router.delete("/{support_ticket_id}")
# async def delete_support_ticket(support_ticket_id: str, token_data: dict = Depends(verify_token)):
#     user_id = token_data['account_id']
#     payload = token_data['payload']

#     old_doc = await db.support_tickets.find_one({"_id": ObjectId(support_ticket_id)})

#     # Validate if the provided support_ticket_id is a valid ObjectId
#     if not ObjectId.is_valid(support_ticket_id):
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid support_ticket ID format"
#         )

#     # Perform the delete operation
#     result = await db.support_tickets.delete_one(
#         {"_id": ObjectId(support_ticket_id)}  # Match the document with the provided ID
#     )
#     await create_custom_log(
#         event= "delete support_ticket",
#         user_id = user_id,
#         old_doc=old_doc
#     )

#     # Check if the document was deleted
#     if result.deleted_count == 0:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Support Ticket not found"
#         )

#     return {"message": "Support Ticket deleted successfully"}


# @router.get("/", response_model=Dict[str, object])
# async def get_support_tickets(page: int = 1, limit: int = 10, token_data: dict = Depends(verify_token)):
#     user_id = token_data['account_id']
#     payload = token_data['payload']

#     if limit > 10:
#         limit = 10

#     # Calculate the skip value based on the page and limit
#     skip = (page - 1) * limit

#     # Fetch the paginated data from MongoDB
#     support_tickets = await db.support_tickets.find().skip(skip).limit(limit).to_list(length=limit)
#     for i in support_tickets:
#         i['_id'] = str(i['_id'])

#     total_count = await db.support_tickets.count_documents({})
#     total_pages = math.ceil(total_count / limit)

#     # Check if no support_tickets were found
#     if not support_tickets:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="No support_tickets found"
#         )

#     await create_custom_log(
#         event= "get support_tickets",
#         user_id = user_id,
#         objectid=None,
#         account_id = user_id,
#         page_number= page
#     )
        
#     return {
#         "response": {
#             "limit": limit,
#             "page": page,
#             "total_pages": total_pages,
#             "total_items": total_count,
#             "items": support_tickets
#         }
#     }
    
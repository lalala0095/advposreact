from pydantic import BaseModel, EmailStr, Field, ValidationError
from enum import Enum
from typing import Literal, Optional, List
from datetime import date

fields = ['feedback', 'support_ticket']
TicketType = Enum(
    "SupportTicketType",
    {field: field.replace('_', ' ').title() for field in fields}
)

fields = ['urgent', 'normal', 'low']
Urgency = Enum(
    "Urgency",
    {field: field.replace('_', ' ').title() for field in fields}
)

class SupportTicket(BaseModel):
    date_of_the_ticket: date = Field(..., description="Date of the issue or feedback.")
    support_ticket_subject: str = Field(..., max_length=100, description="Support Ticket Subject")
    support_ticket_type: TicketType = Field(..., description="Choose if it is a Feedback or a Support Ticket.")
    urgency: Urgency = Field(..., description="Choose if it is Urgent, Normal or Low")
    details: str = Field(..., max_length=500, description="Details")
    # attachments: List[str] = Field([], description="List of attachment URLs")

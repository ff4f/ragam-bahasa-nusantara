from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class ContactCreate(BaseModel):
    """Schema for creating a new contact message"""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)


class ContactResponse(BaseModel):
    """Schema for contact message response"""
    id: int
    user_id: Optional[int]
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    
    class Config:
        from_attributes = True

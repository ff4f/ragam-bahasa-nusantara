from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class ContributionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ContributionType(str, Enum):
    VOCABULARY = "vocabulary"
    AUDIO = "audio"
    TRANSLATION = "translation"


class ContributionBase(BaseModel):
    """Base schema for contribution"""
    contribution_type: ContributionType = ContributionType.VOCABULARY
    province: Optional[str] = None
    region: Optional[str] = None
    language: Optional[str] = None
    dialect: Optional[str] = None
    ethnic: Optional[str] = None
    source_text: Optional[str] = None
    target_text: Optional[str] = None
    example_source: Optional[str] = None
    example_target: Optional[str] = None
    audio_url: Optional[str] = None
    notes: Optional[str] = None


class ContributionCreate(ContributionBase):
    """Schema for creating a new contribution"""
    pass


class ContributionUpdate(BaseModel):
    """Schema for updating contribution status"""
    status: ContributionStatus
    notes: Optional[str] = None


class ContributionResponse(ContributionBase):
    """Schema for contribution response"""
    id: int
    user_id: int
    status: ContributionStatus
    created_at: datetime
    updated_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[int] = None
    user_name: Optional[str] = None
    
    class Config:
        from_attributes = True


class ContributionListResponse(BaseModel):
    """Schema for paginated contribution list"""
    items: list[ContributionResponse]
    total: int
    page: int
    limit: int

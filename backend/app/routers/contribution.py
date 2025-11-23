from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List

from ..database import get_db
from ..models.contribution import Contribution, ContributionStatus
from ..models.dictionary import Dictionary
from ..schemas.contribution import (
    ContributionCreate,
    ContributionResponse,
    ContributionListResponse,
    ContributionUpdate
)
from ..dependencies import get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/api/contributions", tags=["Contributions"])


@router.post("/", response_model=ContributionResponse, status_code=status.HTTP_201_CREATED)
async def create_contribution(
    contribution: ContributionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new contribution.
    Requires authentication.
    """
    db_contribution = Contribution(
        user_id=current_user.id,
        contribution_type=contribution.contribution_type,
        province=contribution.province,
        region=contribution.region,
        language=contribution.language,
        dialect=contribution.dialect,
        ethnic=contribution.ethnic,
        source_text=contribution.source_text,
        target_text=contribution.target_text,
        example_source=contribution.example_source,
        example_target=contribution.example_target,
        audio_url=contribution.audio_url,
        notes=contribution.notes,
        status=ContributionStatus.PENDING
    )
    
    db.add(db_contribution)
    db.commit()
    db.refresh(db_contribution)
    
    return db_contribution


@router.get("/", response_model=ContributionListResponse)
async def get_contributions(
    page: int = 1,
    limit: int = 50,
    status_filter: ContributionStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get contributions for the current user.
    Requires authentication.
    """
    skip = (page - 1) * limit
    
    query = db.query(Contribution).options(joinedload(Contribution.user)).filter(Contribution.user_id == current_user.id)
    
    if status_filter:
        query = query.filter(Contribution.status == status_filter)
    
    total = query.count()
    items = query.order_by(Contribution.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"items": items, "total": total, "page": page, "limit": limit}


@router.get("/all", response_model=ContributionListResponse)
async def get_all_contributions(
    page: int = 1,
    limit: int = 50,
    status_filter: ContributionStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all contributions (for validators/admins).
    Requires authentication.
    """
    skip = (page - 1) * limit
    
    query = db.query(Contribution).options(joinedload(Contribution.user))
    
    if status_filter:
        query = query.filter(Contribution.status == status_filter)
    
    total = query.count()
    items = query.order_by(Contribution.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"items": items, "total": total, "page": page, "limit": limit}


@router.patch("/{contribution_id}", response_model=ContributionResponse)
async def update_contribution_status(
    contribution_id: int,
    update: ContributionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update contribution status (approve/reject).
    Requires authentication.
    """
    contribution = db.query(Contribution).filter(Contribution.id == contribution_id).first()
    
    if not contribution:
        raise HTTPException(status_code=404, detail="Contribution not found")
    
    contribution.status = update.status
    if update.notes:
        contribution.notes = update.notes
    contribution.reviewed_by = current_user.id
    
    from datetime import datetime
    contribution.reviewed_at = datetime.utcnow()
    
    # If approved, add to Dictionary
    if update.status == ContributionStatus.APPROVED:
        # Check if already exists to avoid duplicates (optional but good)
        existing = db.query(Dictionary).filter(
            Dictionary.source_text == contribution.source_text,
            Dictionary.target_text == contribution.target_text,
            Dictionary.target_lang == contribution.language
        ).first()
        
        if not existing:
            new_dict = Dictionary(
                source_text=contribution.source_text,
                target_text=contribution.target_text,
                source_lang="id", # Default to Indonesian
                target_lang=contribution.language,
                example_source=contribution.example_source,
                example_target=contribution.example_target,
                category="word",
                dialect=contribution.dialect,
                region=contribution.region
            )
            db.add(new_dict)
    
    db.commit()
    db.refresh(contribution)
    
    return contribution

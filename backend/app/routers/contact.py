from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..schemas.contact import ContactCreate, ContactResponse
from ..models.contact import Contact
from ..models.user import User as UserModel
from ..dependencies import get_current_active_user, get_optional_current_user

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(
    contact_data: ContactCreate,
    db: Session = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_optional_current_user)
):
    """
    Submit a contact message.
    Can be used by both authenticated and non-authenticated users.
    
    Args:
        contact_data: Contact form data
        db: Database session
        current_user: Optional current authenticated user
        
    Returns:
        Created contact message
    """
    # Create contact message
    db_contact = Contact(
        user_id=current_user.id if current_user else None,
        name=contact_data.name,
        email=contact_data.email,
        subject=contact_data.subject,
        message=contact_data.message
    )
    
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    return db_contact


@router.get("/", response_model=list[ContactResponse])
async def get_all_contacts(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get all contact messages (admin only - for now just requires auth).
    
    Args:
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of all contact messages
    """
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    return contacts


@router.get("/my-messages", response_model=list[ContactResponse])
async def get_my_contacts(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's contact messages.
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List of user's contact messages
    """
    contacts = db.query(Contact).filter(
        Contact.user_id == current_user.id
    ).order_by(Contact.created_at.desc()).all()
    
    return contacts

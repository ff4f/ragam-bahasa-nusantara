from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.user import User, UserUpdate
from ..dependencies import get_current_active_user
from ..models.user import User as UserModel

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=User)
async def get_my_profile(
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get current user profile (alias for /api/auth/me).
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user object
    """
    return current_user


@router.put("/profile", response_model=User)
async def update_profile(
    user_data: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user profile.
    
    Args:
        user_data: Updated user data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated user object
    """
    # Update only provided fields
    if user_data.name is not None:
        current_user.name = user_data.name
    
    if user_data.email is not None:
        # Check if email is already taken by another user
        existing_user = db.query(UserModel).filter(
            UserModel.email == user_data.email,
            UserModel.id != current_user.id
        ).first()
        
        if existing_user:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered to another user"
            )
        
        current_user.email = user_data.email
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

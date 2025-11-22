from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from .database import get_db
from .models.user import User
from .schemas.auth import TokenData
from .utils.security import decode_access_token
from .utils.exceptions import CredentialsException

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.
    
    Args:
        token: JWT access token from Authorization header
        db: Database session
        
    Returns:
        Current authenticated user
        
    Raises:
        CredentialsException: If token is invalid or user not found
    """
    # Decode token
    payload = decode_access_token(token)
    if payload is None:
        raise CredentialsException()
    
    # Extract user_id from token
    user_id: Optional[int] = payload.get("sub")
    if user_id is None:
        raise CredentialsException()
    
    # Get user from database
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise CredentialsException()
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to get current active user.
    
    Args:
        current_user: Current user from get_current_user dependency
        
    Returns:
        Current active user
    """
    return current_user


async def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Dependency to get the current user if authenticated, None otherwise.
    
    Args:
        token: Optional JWT access token from Authorization header
        db: Database session
        
    Returns:
        Current authenticated user or None
    """
    if not token:
        return None
    
    try:
        # Decode token
        payload = decode_access_token(token)
        if payload is None:
            return None
        
        # Extract user_id from token
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            return None
        
        # Get user from database
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None or not user.is_active:
            return None
        
        return user
    except Exception:
        return None

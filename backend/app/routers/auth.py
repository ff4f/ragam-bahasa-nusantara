from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from ..database import get_db
from ..schemas.auth import UserLogin, UserRegister, Token
from ..schemas.user import User
from ..services.auth_service import AuthService
from ..dependencies import get_current_active_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register a new user account.
    
    Args:
        user_data: User registration data (email, password, name, role)
        db: Database session
        
    Returns:
        Created user object
        
    Raises:
        400: If user with email already exists
    """
    auth_service = AuthService(db)
    user = auth_service.register_user(user_data)
    return user


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login and get JWT access token.
    
    Args:
        credentials: User login credentials (email, password)
        db: Database session
        
    Returns:
        JWT access token
        
    Raises:
        401: If credentials are invalid
    """
    auth_service = AuthService(db)
    token = auth_service.authenticate_user(credentials)
    return token


@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current authenticated user information.
    
    Args:
        current_user: Current authenticated user from JWT token
        
    Returns:
        Current user object
    """
    return current_user


@router.post("/logout")
async def logout():
    """
    Logout endpoint (client-side token clearing).
    
    Returns:
        Success message
    """
    return {"message": "Successfully logged out. Please clear your token on the client side."}

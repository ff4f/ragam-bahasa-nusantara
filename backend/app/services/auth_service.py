from sqlalchemy.orm import Session
from datetime import timedelta

from ..models.user import User
from ..schemas.auth import UserRegister, UserLogin, Token
from ..schemas.user import UserCreate
from ..utils.security import hash_password, verify_password, create_access_token
from ..utils.exceptions import UserAlreadyExistsException, InvalidCredentialsException
from ..config import settings


class AuthService:
    """Service class for authentication operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def register_user(self, user_data: UserRegister) -> User:
        """
        Register a new user.
        
        Args:
            user_data: User registration data
            
        Returns:
            Created user object
            
        Raises:
            UserAlreadyExistsException: If email already exists
        """
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise UserAlreadyExistsException()
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        db_user = User(
            email=user_data.email,
            password_hash=hashed_password,
            name=user_data.name,
            role=user_data.role,
            is_active=True
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user
    
    def authenticate_user(self, credentials: UserLogin) -> Token:
        """
        Authenticate user and generate JWT token.
        
        Args:
            credentials: User login credentials
            
        Returns:
            JWT access token
            
        Raises:
            InvalidCredentialsException: If email or password is incorrect
        """
        # Get user by email
        user = self.db.query(User).filter(User.email == credentials.email).first()
        
        # Verify user exists and password is correct
        if not user or not verify_password(credentials.password, user.password_hash):
            raise InvalidCredentialsException()
        
        # Check if user is active
        if not user.is_active:
            raise InvalidCredentialsException()
        
        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )
        
        return Token(access_token=access_token, token_type="bearer")
    
    def get_user_by_email(self, email: str) -> User:
        """
        Get user by email address.
        
        Args:
            email: User email
            
        Returns:
            User object or None
        """
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_id(self, user_id: int) -> User:
        """
        Get user by ID.
        
        Args:
            user_id: User ID
            
        Returns:
            User object or None
        """
        return self.db.query(User).filter(User.id == user_id).first()

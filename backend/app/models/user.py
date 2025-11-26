from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.mysql import JSON
import enum
from ..database import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    CONTRIBUTOR = "contributor"
    VALIDATOR = "validator"


class User(Base):
    """User model for authentication and profile management"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Gamification fields
    points = Column(Integer, default=0, nullable=False, comment="User points for contributions and activities")
    coins = Column(Integer, default=0, nullable=False, comment="Virtual currency for rewards")
    level = Column(Integer, default=1, nullable=False, comment="User level based on XP/points")
    badges = Column(JSON, default=list, nullable=False, comment="Array of earned badges")
    
    # Relationships
    from sqlalchemy.orm import relationship
    comments = relationship("Comment", back_populates="user")
    likes = relationship("DictionaryLike", back_populates="user")
    contributions = relationship("Contribution", foreign_keys="Contribution.user_id", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}', level={self.level})>"

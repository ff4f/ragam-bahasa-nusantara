from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dictionary_id = Column(Integer, ForeignKey("dictionaries.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True) # For replies
    
    user = relationship("User", back_populates="comments")
    dictionary = relationship("Dictionary", back_populates="comments")
    
    # Self-referential relationship for replies
    parent = relationship("Comment", remote_side=[id], back_populates="replies")
    replies = relationship("Comment", back_populates="parent", cascade="all, delete-orphan")

class DictionaryLike(Base):
    __tablename__ = "dictionary_likes"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dictionary_id = Column(Integer, ForeignKey("dictionaries.id"), nullable=False)
    
    user = relationship("User", back_populates="likes")
    dictionary = relationship("Dictionary", back_populates="likes")

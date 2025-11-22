from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Dictionary(Base):
    __tablename__ = "dictionaries"

    id = Column(Integer, primary_key=True, index=True)
    source_text = Column(String(255), index=True, nullable=False)  # Bahasa Indonesia
    target_text = Column(String(255), nullable=False)  # Bahasa Daerah
    source_lang = Column(String(10), default="id")
    target_lang = Column(String(10), nullable=False)  # e.g., 'jv_ngapak'
    
    # Metadata
    example_source = Column(Text, nullable=True)
    example_target = Column(Text, nullable=True)
    category = Column(String(50), default="word")  # word, phrase
    dialect = Column(String(100), nullable=True)   # e.g., Banyumasan
    region = Column(String(100), nullable=True)    # e.g., Purbalingga
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    from sqlalchemy.orm import relationship
    comments = relationship("Comment", back_populates="dictionary", cascade="all, delete-orphan")
    likes = relationship("DictionaryLike", back_populates="dictionary", cascade="all, delete-orphan")

    @property
    def like_count(self):
        return len(self.likes)

    @property
    def comment_count(self):
        return len(self.comments)
    
    @property
    def is_liked(self):
        # This is tricky because it depends on the current user.
        # For now, return False. The frontend might need to fetch this separately 
        # or we handle it in the router by attaching it to the object.
        return False

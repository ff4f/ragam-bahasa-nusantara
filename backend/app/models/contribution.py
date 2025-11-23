from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class ContributionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ContributionType(str, enum.Enum):
    VOCABULARY = "vocabulary"
    AUDIO = "audio"
    TRANSLATION = "translation"


class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(Integer, primary_key=True, index=True)
    
    # User who made the contribution
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Contribution type
    contribution_type = Column(SQLEnum(ContributionType), default=ContributionType.VOCABULARY)
    
    # Language information
    province = Column(String(100))  # Province name
    region = Column(String(100))  # Specific region/city
    language = Column(String(100))  # Language name (e.g., "Jawa", "Sunda")
    dialect = Column(String(100))  # Specific dialect (e.g., "Jawa Ngapak", "Sunda Priangan")
    ethnic = Column(String(100))  # Ethnic group
    
    # Vocabulary data
    source_text = Column(String(255))  # Word in Indonesian
    target_text = Column(String(255))  # Word in regional language
    example_source = Column(Text)  # Example sentence in Indonesian
    example_target = Column(Text)  # Example sentence in regional language
    
    # Audio data (if applicable)
    audio_url = Column(String(500))  # URL to uploaded audio file
    
    # Additional notes
    notes = Column(Text)  # Additional notes or context
    
    # Status
    status = Column(SQLEnum(ContributionStatus), default=ContributionStatus.PENDING)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="contributions")
    reviewer = relationship("User", foreign_keys=[reviewed_by])

    @property
    def user_name(self):
        return self.user.name if self.user else None

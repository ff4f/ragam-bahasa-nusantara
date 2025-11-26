from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DictionaryBase(BaseModel):
    source_text: str
    target_text: str
    source_lang: str = "id"
    target_lang: str
    example_source: Optional[str] = None
    example_target: Optional[str] = None
    category: Optional[str] = "word"
    dialect: Optional[str] = None
    region: Optional[str] = None
    audio_url: Optional[str] = None

class DictionaryCreate(DictionaryBase):
    pass

class DictionaryResponse(DictionaryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Interaction counts
    like_count: int = 0
    comment_count: int = 0
    is_liked: bool = False # For current user context

    class Config:
        from_attributes = True

class DictionaryResponsePaginated(BaseModel):
    items: List[DictionaryResponse]
    total: int
    page: int
    limit: int

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "id"
    target_lang: str

class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    matches: List[DictionaryResponse] = []

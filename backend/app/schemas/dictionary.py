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

class DictionaryCreate(DictionaryBase):
    pass

class DictionaryResponse(DictionaryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

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

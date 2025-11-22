from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    user_id: int
    dictionary_id: int
    created_at: datetime
    user_name: str # To display user name
    
    class Config:
        from_attributes = True

class LikeCreate(BaseModel):
    pass # Just hitting the endpoint toggles it

class LikeResponse(BaseModel):
    liked: bool
    total_likes: int

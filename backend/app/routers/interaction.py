from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.interaction import Comment, DictionaryLike
from ..models.dictionary import Dictionary
from ..models.user import User
from ..schemas.interaction import CommentCreate, CommentResponse, LikeResponse
from ..dependencies import get_current_active_user

router = APIRouter(prefix="/api/interactions", tags=["Interactions"])

@router.get("/dictionary/{dictionary_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    dictionary_id: int,
    db: Session = Depends(get_db)
):
    comments = db.query(Comment).filter(Comment.dictionary_id == dictionary_id).order_by(Comment.created_at.desc()).all()
    
    # Map to response to include user_name
    return [
        CommentResponse(
            id=c.id,
            content=c.content,
            user_id=c.user_id,
            dictionary_id=c.dictionary_id,
            created_at=c.created_at,
            parent_id=c.parent_id,
            user_name=c.user.name
        ) for c in comments
    ]

@router.post("/dictionary/{dictionary_id}/comments", response_model=CommentResponse)
async def create_comment(
    dictionary_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if dictionary exists
    dictionary = db.query(Dictionary).filter(Dictionary.id == dictionary_id).first()
    if not dictionary:
        raise HTTPException(status_code=404, detail="Dictionary entry not found")
        
    new_comment = Comment(
        content=comment.content,
        user_id=current_user.id,
        dictionary_id=dictionary_id,
        parent_id=comment.parent_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return CommentResponse(
        id=new_comment.id,
        content=new_comment.content,
        user_id=new_comment.user_id,
        dictionary_id=new_comment.dictionary_id,
        created_at=new_comment.created_at,
        parent_id=new_comment.parent_id,
        user_name=current_user.name
    )

@router.post("/dictionary/{dictionary_id}/like", response_model=LikeResponse)
async def toggle_like(
    dictionary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if dictionary exists
    dictionary = db.query(Dictionary).filter(Dictionary.id == dictionary_id).first()
    if not dictionary:
        raise HTTPException(status_code=404, detail="Dictionary entry not found")
        
    # Check if already liked
    existing_like = db.query(DictionaryLike).filter(
        DictionaryLike.dictionary_id == dictionary_id,
        DictionaryLike.user_id == current_user.id
    ).first()
    
    liked = False
    if existing_like:
        db.delete(existing_like)
        db.commit()
        liked = False
    else:
        new_like = DictionaryLike(user_id=current_user.id, dictionary_id=dictionary_id)
        db.add(new_like)
        db.commit()
        liked = True
        
    # Get total likes
    total_likes = db.query(DictionaryLike).filter(DictionaryLike.dictionary_id == dictionary_id).count()
    
    return LikeResponse(liked=liked, total_likes=total_likes)

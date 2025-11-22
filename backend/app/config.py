from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database - MUST be set via environment variable
    DATABASE_URL: str
    
    # JWT Settings - MUST be set via environment variable  
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings
    CORS_ORIGINS: str = "*"  # Will be set via env var in production
    
    # Application
    PROJECT_NAME: str = "Ragam Bahasa Nusantara API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False  # Default to False for production safety
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

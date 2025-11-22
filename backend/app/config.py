from pydantic_settings import BaseSettings
from typing import Union
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database - MUST be set via environment variable
    DATABASE_URL: str
    
    # JWT Settings - MUST be set via environment variable  
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings - can be string or list
    CORS_ORIGINS: str = "*"
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Convert CORS_ORIGINS to list"""
        if isinstance(self.CORS_ORIGINS, str):
            if self.CORS_ORIGINS == "*":
                return ["*"]
            # Try comma-separated
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS
    
    # Application
    PROJECT_NAME: str = "Ragam Bahasa Nusantara API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False  # Default to False for production safety
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = "mysql+pymysql://rana_user:secure_password@mysql:3306/ragam_bahasa_db"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-in-production-make-it-long-and-random"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings
    CORS_ORIGINS: list[str] = [
        "http://localhost",
        "http://localhost:80",
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
    ]
    
    # Application
    PROJECT_NAME: str = "Ragam Bahasa Nusantara API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

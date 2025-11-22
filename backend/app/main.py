from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from .config import settings
from .database import init_db, SessionLocal
from .routers import auth_router, user_router, contact_router, dictionary_router
from .utils.seeder import seed_dictionaries

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API for Ragam Bahasa Nusantara - Platform for preserving Indonesian local languages",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Startup event - initialize database and seed data
@app.on_event("startup")
async def startup_event():
    """Initialize database and seed data on application startup"""
    # Initialize database tables
    init_db()
    
    # Seed initial data
    db = SessionLocal()
    try:
        seed_dictionaries(db)
    finally:
        db.close()
    
    print(f"✅ {settings.PROJECT_NAME} v{settings.VERSION} started successfully!")
    print(f"📚 API Documentation: /api/docs")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Include routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(contact_router)
app.include_router(dictionary_router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Ragam Bahasa Nusantara API",
        "version": settings.VERSION,
        "docs": "/api/docs"
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": settings.VERSION
    }



# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    print(f"👋 {settings.PROJECT_NAME} shutting down...")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

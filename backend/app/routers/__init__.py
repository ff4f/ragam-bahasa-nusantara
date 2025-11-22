from .auth import router as auth_router
from .user import router as user_router
from .contact import router as contact_router
from .dictionary import router as dictionary_router
from .interaction import router as interaction_router

__all__ = ["auth_router", "user_router", "contact_router", "dictionary_router", "interaction_router"]

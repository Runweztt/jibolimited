from fastapi import APIRouter

from .analytics import router as analytics_router
from .auth import router as auth_router
from .claims import router as claims_router
from .company import router as company_router
from .health import router as health_router
from .policies import router as policies_router
from .super_admin import router as super_router
from .telegram import router as telegram_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(claims_router, prefix="/claims", tags=["claims"])
api_router.include_router(company_router, prefix="/company", tags=["company"])
api_router.include_router(policies_router, prefix="/policies", tags=["policies"])
api_router.include_router(super_router, prefix="/super", tags=["super-admin"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
api_router.include_router(telegram_router, prefix="/telegram", tags=["telegram"])

__all__ = ["api_router"]

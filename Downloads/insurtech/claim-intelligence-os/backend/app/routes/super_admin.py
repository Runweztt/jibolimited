import math
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_super_admin
from app.database import get_db
from app.models.audit import AuditLog
from app.models.claim import Claim
from app.models.company import Company
from app.models.user import Claimant, User
from app.schemas.common import PaginatedResponse
from app.schemas.company import CompanyCreateRequest, CompanyResponse, CompanyUpdateRequest
from app.services.company_service import CompanyService

router = APIRouter()


# ─── Platform-wide analytics summary ─────────────────────────────────────────
@router.get("/analytics")
async def platform_analytics(
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
) -> dict:
    from app.cache.redis_client import cache_get, cache_set

    cached = await cache_get("analytics:platform:summary")
    if cached:
        return cached

    total_companies = (await db.execute(select(func.count(Company.id)))).scalar_one()
    total_claimants = (await db.execute(select(func.count(Claimant.id)))).scalar_one()
    total_claims = (await db.execute(select(func.count(Claim.id)))).scalar_one()
    approved = (await db.execute(select(func.count(Claim.id)).where(Claim.status == "approved"))).scalar_one()
    rejected = (await db.execute(select(func.count(Claim.id)).where(Claim.status == "rejected"))).scalar_one()
    escalated = (await db.execute(select(func.count(Claim.id)).where(Claim.status == "escalated"))).scalar_one()
    high_fraud = (await db.execute(select(func.count(Claim.id)).where(Claim.fraud_score >= 60))).scalar_one()

    result = {
        "total_companies": total_companies,
        "total_claimants": total_claimants,
        "total_claims": total_claims,
        "claims_approved": approved,
        "claims_rejected": rejected,
        "claims_escalated": escalated,
        "high_fraud_claims": high_fraud,
        "fraud_rate": round(high_fraud / total_claims * 100, 1) if total_claims else 0,
    }

    await cache_set("analytics:platform:summary", result, ttl=900)
    return result


# ─── List all companies ────────────────────────────────────────────────────────
@router.get("/companies", response_model=PaginatedResponse)
async def list_companies(
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
    page: int = 1,
    page_size: int = 20,
) -> PaginatedResponse:
    companies, total = await CompanyService.list_companies(db, page=page, page_size=page_size)
    return PaginatedResponse(
        items=[CompanyResponse.model_validate(c) for c in companies],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )


# ─── Create a new company ─────────────────────────────────────────────────────
@router.post("/companies", response_model=CompanyResponse, status_code=201)
async def create_company(
    body: CompanyCreateRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
) -> CompanyResponse:
    company = await CompanyService.create_company(db, body)
    return CompanyResponse.model_validate(company)


# ─── Update a company (suspend, change plan, etc.) ────────────────────────────
@router.patch("/companies/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: uuid.UUID,
    body: CompanyUpdateRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
) -> CompanyResponse:
    company = await CompanyService.update_company(db, company_id, body)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return CompanyResponse.model_validate(company)


# ─── Get a single company with claim stats ────────────────────────────────────
@router.get("/companies/{company_id}")
async def get_company(
    company_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
) -> dict:
    company = await CompanyService.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    total = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id))).scalar_one()
    approved = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.status == "approved"))).scalar_one()
    rejected = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.status == "rejected"))).scalar_one()
    high_fraud = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.fraud_score >= 60))).scalar_one()

    return {
        **CompanyResponse.model_validate(company).model_dump(mode="json"),
        "total_claims": total,
        "approved_claims": approved,
        "rejected_claims": rejected,
        "high_fraud_claims": high_fraud,
        "approval_rate": round(approved / total * 100, 1) if total else 0,
    }


# ─── All claims across all companies (paginated) ──────────────────────────────
@router.get("/claims")
async def all_claims(
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
    page: int = 1,
    page_size: int = 20,
    status: str | None = None,
) -> dict:
    from sqlalchemy.orm import selectinload

    base = select(Claim).options(selectinload(Claim.company))
    if status:
        base = base.where(Claim.status == status)

    count_q = select(func.count(Claim.id))
    if status:
        count_q = count_q.where(Claim.status == status)
    total = (await db.execute(count_q)).scalar_one()

    offset = (page - 1) * page_size
    rows = (await db.execute(
        base.order_by(Claim.created_at.desc()).offset(offset).limit(page_size)
    )).scalars().all()

    return {
        "items": [
            {
                "id": str(c.id),
                "claim_ref": c.claim_ref,
                "claim_type": c.claim_type,
                "claim_amount": float(c.claim_amount),
                "status": c.status,
                "fraud_score": c.fraud_score,
                "company_name": c.company.name if c.company else None,
                "created_at": c.created_at,
            }
            for c in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total else 1,
    }


# ─── Audit logs ───────────────────────────────────────────────────────────────
@router.get("/audit-logs")
async def audit_logs(
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(require_super_admin)],
    page: int = 1,
    page_size: int = 50,
) -> dict:
    total = (await db.execute(select(func.count(AuditLog.id)))).scalar_one()
    offset = (page - 1) * page_size
    logs = (await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).offset(offset).limit(page_size)
    )).scalars().all()

    return {
        "items": [
            {
                "id": str(l.id),
                "actor_email": l.actor_email,
                "action": l.action,
                "resource_type": l.resource_type,
                "resource_id": l.resource_id,
                "description": l.description,
                "created_at": l.created_at,
            }
            for l in logs
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.dependencies import require_company_admin
from app.database import get_db
from app.models.claim import Claim
from app.models.user import CompanyUser, User
from app.schemas.claim import ClaimListResponse
from app.schemas.common import PaginatedResponse
from app.services.claim_service import ClaimService

router = APIRouter()


# ─── Helper: resolve the company_id for the logged-in company admin ───────────
async def _company_id_for_user(user: User, db: AsyncSession) -> uuid.UUID:
    if user.role == "super_admin":
        raise HTTPException(status_code=400, detail="Use /super routes for super admin access")

    cu = (await db.execute(
        select(CompanyUser).where(CompanyUser.user_id == user.id, CompanyUser.is_active == True)
    )).scalar_one_or_none()
    if not cu:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No company assigned to user")
    return cu.company_id


# ─── Company dashboard summary ────────────────────────────────────────────────
@router.get("/dashboard")
async def company_dashboard(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
) -> dict:
    company_id = await _company_id_for_user(current_user, db)

    # Use aggregate queries — never load all claims into memory
    total = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id))).scalar_one()
    approved = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.status == "approved"))).scalar_one()
    rejected = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.status == "rejected"))).scalar_one()
    pending = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.status == "submitted"))).scalar_one()
    high_fraud = (await db.execute(select(func.count(Claim.id)).where(Claim.company_id == company_id, Claim.fraud_score >= 60))).scalar_one()

    return {
        "total_claims": total,
        "approved": approved,
        "rejected": rejected,
        "pending": pending,
        "high_fraud_claims": high_fraud,
        "approval_rate": round(approved / total * 100, 1) if total else 0,
        "rejection_rate": round(rejected / total * 100, 1) if total else 0,
    }


# ─── List claims (paginated, filterable) ──────────────────────────────────────
@router.get("/claims", response_model=PaginatedResponse)
async def list_claims(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
    page: int = 1,
    page_size: int = 20,
    status: str | None = None,
    claim_type: str | None = None,
) -> PaginatedResponse:
    import math

    company_id = await _company_id_for_user(current_user, db)
    claims, total = await ClaimService.list_company_claims(
        db, company_id, page=page, page_size=page_size, status=status, claim_type=claim_type
    )

    return PaginatedResponse(
        items=[ClaimListResponse.model_validate(c) for c in claims],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )


# ─── List staff for the company ───────────────────────────────────────────────
@router.get("/staff")
async def list_staff(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
) -> list[dict]:
    company_id = await _company_id_for_user(current_user, db)
    rows = (await db.execute(
        select(CompanyUser)
        .options(selectinload(CompanyUser.user))
        .where(CompanyUser.company_id == company_id)
        .order_by(CompanyUser.created_at.desc())
    )).scalars().all()

    return [
        {
            "id": str(cu.id),
            "user_id": str(cu.user_id),
            "full_name": cu.user.full_name if cu.user else "—",
            "email": cu.user.email if cu.user else "—",
            "role": cu.role,
            "is_active": cu.is_active,
            "joined_at": cu.created_at,
        }
        for cu in rows
    ]


# ─── Invite a new staff member (company admin creates an account for their own company) ──
@router.post("/staff/invite", status_code=201)
async def invite_staff(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
    email: str,
    full_name: str,
    password: str,
    role: str = "company_admin",
) -> dict:
    from app.auth.password import hash_password

    company_id = await _company_id_for_user(current_user, db)

    existing = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    new_user = User(
        email=email,
        hashed_password=hash_password(password),
        full_name=full_name,
        role=role,
    )
    db.add(new_user)
    await db.flush()

    cu = CompanyUser(user_id=new_user.id, company_id=company_id, role=role)
    db.add(cu)
    await db.commit()

    return {"message": "Staff member created", "user_id": str(new_user.id)}


# ─── Deactivate a staff member ────────────────────────────────────────────────
@router.patch("/staff/{company_user_id}/toggle")
async def toggle_staff(
    company_user_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
) -> dict:
    company_id = await _company_id_for_user(current_user, db)
    cu = (await db.execute(
        select(CompanyUser).where(CompanyUser.id == company_user_id, CompanyUser.company_id == company_id)
    )).scalar_one_or_none()
    if not cu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found")
    if cu.user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate yourself")

    cu.is_active = not cu.is_active
    await db.commit()
    return {"is_active": cu.is_active}

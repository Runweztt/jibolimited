import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import require_company_admin
from app.database import get_db
from app.models.policy import Policy
from app.models.user import CompanyUser, User
from app.services.file_service import FileService

router = APIRouter()


async def _company_id(user: User, db: AsyncSession) -> uuid.UUID:
    cu = (await db.execute(
        select(CompanyUser).where(CompanyUser.user_id == user.id, CompanyUser.is_active == True)
    )).scalar_one_or_none()
    if not cu:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No company assigned")
    return cu.company_id


# ─── List policies ────────────────────────────────────────────────────────────
@router.get("")
async def list_policies(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
) -> list[dict]:
    company_id = await _company_id(current_user, db)
    rows = (await db.execute(
        select(Policy)
        .where(Policy.company_id == company_id)
        .order_by(Policy.created_at.desc())
    )).scalars().all()

    return [
        {
            "id": str(p.id),
            "policy_name": p.policy_name,
            "policy_type": p.policy_type,
            "original_filename": p.original_filename,
            "payout_limit": float(p.payout_limit),
            "waiting_period_days": p.waiting_period_days,
            "max_claim_days_after_incident": p.max_claim_days_after_incident,
            "coverage_types": p.coverage_types,
            "is_active": p.is_active,
            "created_at": p.created_at,
        }
        for p in rows
    ]


# ─── Upload a new policy document ────────────────────────────────────────────
@router.post("", status_code=201)
async def upload_policy(
    file: UploadFile,
    policy_name: str,
    policy_type: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
    payout_limit: float = 100000.0,
    waiting_period_days: int = 0,
    max_claim_days_after_incident: int = 90,
) -> dict:
    company_id = await _company_id(current_user, db)
    FileService.validate_document(file)
    storage_path, safe_filename, _, _ = await FileService.save_file(file, company_id, subfolder="policies")

    policy = Policy(
        company_id=company_id,
        policy_name=policy_name,
        policy_type=policy_type,
        original_filename=file.filename,
        storage_path=storage_path,
        payout_limit=payout_limit,
        waiting_period_days=waiting_period_days,
        max_claim_days_after_incident=max_claim_days_after_incident,
        coverage_types=[],
        excluded_types=[],
        required_documents=[],
    )
    db.add(policy)
    await db.commit()
    await db.refresh(policy)

    return {"message": "Policy uploaded successfully", "policy_id": str(policy.id)}


# ─── Toggle policy active status ─────────────────────────────────────────────
@router.patch("/{policy_id}/toggle")
async def toggle_policy(
    policy_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
) -> dict:
    company_id = await _company_id(current_user, db)
    policy = (await db.execute(
        select(Policy).where(Policy.id == policy_id, Policy.company_id == company_id)
    )).scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")

    policy.is_active = not policy.is_active
    await db.commit()
    return {"is_active": policy.is_active}


# ─── Delete a policy ──────────────────────────────────────────────────────────
@router.delete("/{policy_id}", status_code=204)
async def delete_policy(
    policy_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_company_admin)],
) -> None:
    company_id = await _company_id(current_user, db)
    policy = (await db.execute(
        select(Policy).where(Policy.id == policy_id, Policy.company_id == company_id)
    )).scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")

    await db.delete(policy)
    await db.commit()

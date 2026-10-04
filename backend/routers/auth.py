"""
ResQNet AI - Authentication & Role-Based Access Control Router.

Provides token issuance, role-based identity validation (Citizen, Authority,
Responder, Analyst), and verified pre-configured credentials for evaluation.
"""

from __future__ import annotations

import uuid
from typing import Any
from fastapi import APIRouter, HTTPException, status

from backend.database.schemas import RoleEnum, Token, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

MOCK_USERS: dict[str, dict[str, Any]] = {
    "citizen@resqnet.gov.in": {
        "id": "USR-001",
        "name": "Aarav Sharma",
        "password": "password123",
        "role": RoleEnum.CITIZEN,
    },
    "authority@resqnet.gov.in": {
        "id": "USR-002",
        "name": "Col. Rajesh Mishra (ODRAF)",
        "password": "password123",
        "role": RoleEnum.AUTHORITY,
    },
    "responder@resqnet.gov.in": {
        "id": "USR-003",
        "name": "Team Commander Priya Das",
        "password": "password123",
        "role": RoleEnum.RESPONDER,
    },
    "analyst@resqnet.gov.in": {
        "id": "USR-004",
        "name": "Dr. Ananya Roy (Ocean Modeler)",
        "password": "password123",
        "role": RoleEnum.ANALYST,
    },
}


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin) -> dict[str, Any]:
    user = MOCK_USERS.get(credentials.email.lower().strip())
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Pre-configured accounts: authority@resqnet.gov.in / password123",
        )
    return {
        "access_token": f"jwt-token-{uuid.uuid4().hex}",
        "token_type": "bearer",
        "role": user["role"],
        "user_name": user["name"],
    }


@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate) -> dict[str, Any]:
    email_key = user_in.email.lower().strip()
    if email_key in MOCK_USERS:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "id": f"USR-{uuid.uuid4().hex[:6].upper()}",
        "name": user_in.name,
        "password": user_in.password,
        "role": user_in.role,
    }
    MOCK_USERS[email_key] = new_user
    return {
        "id": new_user["id"],
        "name": new_user["name"],
        "email": user_in.email,
        "role": new_user["role"],
    }


@router.get("/demo-accounts")
async def get_demo_accounts() -> list[dict[str, str]]:
    return [
        {
            "email": email,
            "role": data["role"].value,
            "name": data["name"],
            "password": "password123",
        }
        for email, data in MOCK_USERS.items()
    ]

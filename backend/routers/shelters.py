"""
ResQNet AI - Shelter Inventory & Road Passability Router.

Provides real-time relief shelter capacity, generator/medical availability,
and coastal road inundation status.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Query

from backend.database.schemas import ShelterOut
from backend.database.store import db

router = APIRouter(prefix="/shelters", tags=["Shelters & Roads"])


@router.get("", response_model=list[ShelterOut])
async def list_shelters(
    location: str | None = Query(None, description="Optional target location identifier")
) -> list[dict[str, Any]]:
    if location and location.lower().strip() != "puri":
        return db.get_shelters_for_location(location)
    return db.get_shelters()


@router.get("/roads")
async def list_roads() -> list[dict[str, Any]]:
    return db.get_roads()

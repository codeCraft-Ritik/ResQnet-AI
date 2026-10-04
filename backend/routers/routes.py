"""
ResQNet AI - Safer Evacuation Routing Router.

Calculates dynamic ground trajectories navigating around active flood perimeters
and submerged road segments towards designated operational relief shelters.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter

from backend.database.schemas import SafeRouteRequest, SafeRouteResponse
from backend.database.store import db
from ml.routing.safe_route_engine import route_engine

router = APIRouter(prefix="/routes", tags=["Hazard-Avoidance Safer Route"])


@router.post("/safer", response_model=SafeRouteResponse)
async def generate_safer_route(req: SafeRouteRequest) -> dict[str, Any]:
    return route_engine.find_safer_route(
        start_lat=req.start_lat,
        start_lng=req.start_lng,
        shelters=db.get_shelters(),
        roads=db.get_roads(),
        hazards=db.get_hazards(),
        preferred_shelter_id=req.target_shelter_id,
    )

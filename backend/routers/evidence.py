"""
ResQNet AI - Evidence Fusion & Verification Router.

Computes multi-source Bayesian corroboration matrices across official warnings,
physical buoys, weather stations, satellite feeds, and crowdsourced eyewitnesses.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, HTTPException

from backend.database.schemas import EvidenceMatrixOut
from backend.database.store import db
from ml.fusion.evidence_fusion import fusion_engine

router = APIRouter(prefix="/evidence", tags=["Evidence Fusion & Verification"])


@router.get("/{hazard_id}", response_model=EvidenceMatrixOut)
async def get_evidence_for_hazard(hazard_id: str) -> dict[str, Any]:
    hazard = db.get_hazard_by_id(hazard_id)
    if not hazard:
        hazards = db.get_hazards()
        if hazards:
            hazard = hazards[0]
        else:
            raise HTTPException(status_code=404, detail="Hazard event not found")

    fusion_result = fusion_engine.compute_fusion(
        hazard_title=hazard["title"],
        official_warnings=db.get_official_warnings(),
        weather_obs=db.get_weather(),
        ocean_obs=db.get_ocean(),
        satellite_obs=db.get_satellite(),
        citizen_reports=db.get_citizen_reports(),
        social_signals=db.get_social_signals(),
        news_signals=db.get_news_signals(),
        contradictions_detected=False,
    )

    return {"hazard_id": hazard["id"], **fusion_result}

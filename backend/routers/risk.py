"""
ResQNet AI - Risk Assessment & XAI Attribution Router.

Serves physical multi-factor risk assessments, TreeSHAP feature attributions,
and safety-first operational directives customized by user role.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Query

from backend.database.schemas import RoleEnum, XAIExplanationOut
from backend.database.store import db
from ml.explainability.xai_engine import xai_engine
from ml.risk.risk_model import risk_model

router = APIRouter(prefix="/risk", tags=["AI Risk & Explainability"])


@router.get("/assess", response_model=XAIExplanationOut)
async def assess_current_risk() -> dict[str, Any]:
    weather = db.get_weather()[0] if db.get_weather() else {}
    ocean = db.get_ocean()[0] if db.get_ocean() else {}
    reports = db.get_citizen_reports()
    warnings = db.get_official_warnings()

    risk_score, severity, factors = risk_model.predict_risk(
        wave_height_m=ocean.get("wave_height_m", 4.4),
        wind_speed_kmh=weather.get("wind_speed_kmh", 68.5),
        rainfall_mm_hr=weather.get("rainfall_mm_hr", 44.6),
        coastal_elevation_m=2.8,
        citizen_report_count=len(reports),
        official_warning_active=bool(warnings),
        sea_level_anomaly_m=ocean.get("tide_surge_anomaly_m", 1.45),
    )

    return xai_engine.generate_explanation(
        risk_score=risk_score,
        severity=severity,
        factors=factors,
        location_name="Puri Marine Drive & Pentakota Coastal Zone",
    )


@router.get("/role-action")
async def get_role_action(
    role: RoleEnum = Query(default=RoleEnum.CITIZEN)
) -> dict[str, Any]:
    assessment = await assess_current_risk()
    action = xai_engine.get_role_action(role, assessment["severity"])
    return {
        "role": role.value,
        "current_severity": assessment["severity"].value,
        "risk_score_pct": assessment["risk_score_pct"],
        **action,
    }

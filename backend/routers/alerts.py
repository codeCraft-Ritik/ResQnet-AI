"""
ResQNet AI - Tripartite Alert Feed Router.

Aggregates and clearly separates Official Government Warnings (IMD/INCOIS),
Predictive AI Hazard Alerts, and Verified Crowdsourced Field Events.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter

from backend.database.store import db
from ingestion.providers.imd import IMDProvider

router = APIRouter(prefix="/alerts", tags=["Alert Center (Official vs AI vs Crowdsourced)"])
imd_provider = IMDProvider()


@router.get("")
async def get_all_alerts() -> dict[str, Any]:
    official = db.get_official_warnings()
    hazards = db.get_hazards()
    citizen_verified = [
        r for r in db.get_citizen_reports()
        if r.get("status") in ("VERIFIED", "CORROBORATED")
    ]

    coastal_bulletins = await imd_provider.fetch_coastal_bulletin(target_coast="Odisha")
    city_forecast = await imd_provider.fetch_city_forecast(station_id="42971")

    ai_alerts = [
        {
            "id": f"AI-ALERT-{h['id']}",
            "hazard_id": h["id"],
            "title": h["title"],
            "category": "AI_RISK_ALERT",
            "severity": h["severity"],
            "risk_score_pct": h["ai_risk_score"],
            "confidence_pct": h["ai_confidence"],
            "summary": (
                f"AI detected {h['severity']} risk of coastal flooding around {h['title']}. "
                f"Estimated exposed population: {h['affected_population_estimate']:,}."
            ),
            "disclaimer": "AI RISK ASSESSMENT — NOT AN OFFICIAL GOVERNMENT WARNING",
            "timestamp": "Real-Time Active",
        }
        for h in hazards
    ]

    crowd_alerts = [
        {
            "id": f"CROWD-{c['id']}",
            "report_id": c["id"],
            "title": c["hazard_type"],
            "category": "CROWDSOURCED_VERIFIED",
            "status": c["status"],
            "location": f"Lat {c['lat']}, Lng {c['lng']}",
            "summary": c["description"],
            "confidence": int(c["confidence"] * 100),
            "timestamp": c["timestamp"],
        }
        for c in citizen_verified
    ]

    return {
        "official_warnings": official,
        "imd_coastal_bulletin": coastal_bulletins[0] if coastal_bulletins else None,
        "imd_city_forecast": city_forecast,
        "ai_risk_alerts": ai_alerts,
        "crowdsourced_corroborated_events": crowd_alerts,
        "guidance_banner": (
            "Official Warnings from IMD/INCOIS take absolute operational priority. "
            "AI Alerts provide predictive situational intelligence."
        ),
    }

"""
ResQNet AI - Citizen Crowdsourced Reporting Router.

Ingests citizen ground reports, performs real-time multilingual NLP and
computer vision pre-checks, calculates verification confidence, and supports authority triage.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, HTTPException, Query, Request, status

from backend.database.schemas import (
    CitizenReportCreate,
    CitizenReportOut,
    ReportVerificationAction,
    VerificationStatus,
)
from backend.database.store import db
from ml.nlp.multilingual_parser import nlp_parser
from ml.vision.damage_inspector import vision_inspector

router = APIRouter(prefix="/reports", tags=["Citizen Crowdsourced Reporting"])


@router.get("", response_model=list[CitizenReportOut])
async def list_reports(
    status_filter: VerificationStatus | None = Query(None, alias="status")
) -> list[dict[str, Any]]:
    reports = db.get_citizen_reports()
    if status_filter:
        return [r for r in reports if r.get("status") == status_filter.value]
    return reports


@router.post("", response_model=CitizenReportOut, status_code=status.HTTP_201_CREATED)
async def submit_report(report_in: CitizenReportCreate) -> dict[str, Any]:
    nlp_result = nlp_parser.parse(report_in.description)
    vision_result = vision_inspector.inspect_image(
        file_name=report_in.media_url,
        prompt_hint=f"{report_in.hazard_type} {report_in.description}",
    )

    base_score = 0.55
    if nlp_result["extracted_locations"]:
        base_score += 0.15
    if vision_result["is_actionable_hazard"]:
        base_score += 0.20
    if nlp_result["has_life_threat"]:
        base_score += 0.08
    verification_score = min(0.98, base_score)

    ai_tags = list(vision_result["detected_objects"])
    if nlp_result["extracted_locations"]:
        ai_tags.append(f"Near {nlp_result['extracted_locations'][0]}")

    return db.add_citizen_report(
        report_in=report_in,
        ai_tags=ai_tags,
        verification_score=verification_score,
    )


@router.post("/analyze-preview")
async def analyze_preview(
    request: Request,
    description: str | None = Query(None),
    hazard_type: str | None = Query("COASTAL_FLOODING"),
    media_name: str | None = Query(None),
) -> dict[str, Any]:
    """Generates instant NLP and computer vision preview for active reporting forms."""
    if not description:
        try:
            body = await request.json()
            description = body.get("description") or body.get("text") or ""
            hazard_type = body.get("hazard_type") or hazard_type or "COASTAL_FLOODING"
            media_name = body.get("media_name") or media_name
        except Exception:
            description = ""

    nlp_result = nlp_parser.parse(description or "")
    vision_result = vision_inspector.inspect_image(
        file_name=media_name, prompt_hint=f"{hazard_type} {description}"
    )

    score = 0.85 if nlp_result["extracted_locations"] else 0.65
    return {
        "nlp": nlp_result,
        "vision": vision_result,
        "estimated_verification_score": score,
        "advice_message": (
            "Your report contains clear geospatial landmarks and actionable hazard indicators. "
            "It will be prioritized for authority verification."
        ),
    }


@router.post("/{report_id}/verify", response_model=CitizenReportOut)
async def verify_report(report_id: str, action: ReportVerificationAction) -> dict[str, Any]:
    updated = db.update_report_status(report_id, action.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Report not found")
    return updated

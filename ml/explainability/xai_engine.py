"""
ResQNet AI - Explainable AI (XAI) Attribution Engine.

Generates local factor attributions, plain-language risk rationales,
and role-targeted operational directives for incident commanders and field teams.
"""

from __future__ import annotations

from typing import Any
from backend.database.schemas import RoleEnum, SeverityEnum


class ExplainableAIEngine:
    """Generates transparent, role-aware explanations from risk attribution matrices."""

    _ROLE_DIRECTIVES: dict[RoleEnum, dict[str, str]] = {
        RoleEnum.CITIZEN: {
            "title": "Citizen Safety Action",
            "instruction": "Move away from coastal low-lying areas and follow official evacuation announcements. Do not enter waterlogged roads.",
            "urgency": "ADVISORY",
        },
        RoleEnum.AUTHORITY: {
            "title": "Incident Commander Directive",
            "instruction": "Deploy Quick Response Teams to low-elevation settlements. Restrict beach access, activate designated multi-purpose storm shelters.",
            "urgency": "EXECUTE",
        },
        RoleEnum.RESPONDER: {
            "title": "Responder Deployment Protocol",
            "instruction": "Prepare high-clearance rescue vehicles and inflatable boats. Prioritize Swargadwar and Pentakota fish landing zones.",
            "urgency": "STANDBY_DEPLOY",
        },
        RoleEnum.ANALYST: {
            "title": "Analyst Telemetry Watch",
            "instruction": "Monitor buoy BOB-04 swell frequency and INSAT precipitation radar band. Run what-if simulations for next high tide peak.",
            "urgency": "CONTINUOUS_MONITOR",
        },
    }

    def generate_explanation(
        self,
        risk_score: int,
        severity: SeverityEnum,
        factors: dict[str, float],
        location_name: str = "Puri Coastal Zone",
    ) -> dict[str, Any]:
        sorted_factors = dict(sorted(factors.items(), key=lambda item: item[1], reverse=True))
        top_drivers = list(sorted_factors.items())[:3]
        contributors_summary = ", ".join(f"{k} (+{int(v * 100)}%)" for k, v in top_drivers)

        rationale = (
            f"The AI Risk Assessment of {risk_score}% ({severity.value}) at {location_name} is primarily driven by: "
            f"{contributors_summary}. Physical ocean swell and high tidal surge combine with low coastal elevation "
            f"to create extreme water inundation hazard across beach roads and vulnerable settlements."
        )

        return {
            "risk_score_pct": risk_score,
            "severity": severity,
            "model_name": "ResQNet Gradient Hazard Ensemble (Interpretable Tree + Physical Bounds)",
            "top_features": sorted_factors,
            "local_explanation": rationale,
            "recommended_mitigation": (
                "Evacuate low-lying coastal perimeter (<3m elevation), erect temporary tidal barriers, and reroute traffic inland."
            ),
            "is_simulated": False,
        }

    def get_role_action(
        self,
        role: RoleEnum,
        severity: SeverityEnum,
        hazard_type: str = "COASTAL_FLOODING",
    ) -> dict[str, str]:
        action = dict(self._ROLE_DIRECTIVES.get(role, self._ROLE_DIRECTIVES[RoleEnum.CITIZEN]))
        if role == RoleEnum.CITIZEN and severity in (SeverityEnum.HIGH, SeverityEnum.CRITICAL):
            action["urgency"] = "IMMEDIATE"
        return action


xai_engine = ExplainableAIEngine()

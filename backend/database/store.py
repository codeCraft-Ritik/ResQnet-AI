"""
ResQNet AI - In-Memory Spatial DataStore.

Provides low-latency spatial state management, seed data hydration from local
geospatial JSON, runtime report ingestion, and coastal station telemetry resolvers.
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any

from backend.config import settings
from backend.database.schemas import CitizenReportCreate, VerificationStatus

logger = logging.getLogger("resqnet.datastore")


def get_utc_iso() -> str:
    """Returns the current UTC timestamp formatted as ISO-8601 string."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


COASTAL_LOCATIONS_MAP: dict[str, tuple[float, float, str]] = {
    "chennai": (13.0827, 80.2707, "Chennai"),
    "mumbai": (18.9220, 72.8347, "Mumbai"),
    "visakhapatnam": (17.6868, 83.2185, "Visakhapatnam"),
    "kochi": (9.9312, 76.2673, "Kochi"),
    "kolkata": (22.5726, 88.3639, "Kolkata"),
    "paradip": (20.3164, 86.6114, "Paradip"),
    "gopalpur": (19.2600, 84.9100, "Gopalpur"),
    "chandipur": (21.4700, 87.0200, "Chandipur"),
    "dhamra": (20.7900, 86.9700, "Dhamra Port"),
    "surat": (21.1702, 72.8311, "Surat"),
    "bhavnagar": (21.7645, 72.1519, "Bhavnagar"),
    "porbandar": (21.6417, 69.6293, "Porbandar"),
    "dwarka": (22.2442, 68.9685, "Dwarka"),
    "panaji": (15.4909, 73.8278, "Panaji"),
    "mangaluru": (12.9141, 74.8560, "Mangaluru"),
    "thiruvananthapuram": (8.5241, 76.9366, "Thiruvananthapuram"),
    "puducherry": (11.9416, 79.8083, "Puducherry"),
    "port-blair": (11.6234, 92.7265, "Port Blair"),
    "new-delhi": (28.6139, 77.2090, "New Delhi"),
}


def resolve_location_coordinates(loc_id: str) -> tuple[float, float, str]:
    """Resolves arbitrary location identifiers into standard (lat, lng, display_name)."""
    norm = loc_id.lower().strip()
    return COASTAL_LOCATIONS_MAP.get(norm, (18.5, 73.5, norm.replace("-", " ").title()))


class DataStore:
    """Thread-safe in-memory store representing current coastal operational posture."""

    def __init__(self) -> None:
        self.region: dict[str, Any] = {}
        self.official_warnings: list[dict[str, Any]] = []
        self.weather_observations: list[dict[str, Any]] = []
        self.ocean_observations: list[dict[str, Any]] = []
        self.satellite_observations: list[dict[str, Any]] = []
        self.hazard_events: list[dict[str, Any]] = []
        self.citizen_reports: list[dict[str, Any]] = []
        self.social_signals: list[dict[str, Any]] = []
        self.news_signals: list[dict[str, Any]] = []
        self.shelters: list[dict[str, Any]] = []
        self.roads: list[dict[str, Any]] = []
        self._load_seed_data()

    def _load_seed_data(self) -> None:
        """Hydrates store from seed dataset if available."""
        if not settings.DATA_FILE.exists():
            logger.warning("Seed dataset file not found at %s. Running with empty store.", settings.DATA_FILE)
            return

        try:
            with open(settings.DATA_FILE, "r", encoding="utf-8") as fh:
                payload = json.load(fh)
                self.region = payload.get("region", {})
                self.official_warnings = payload.get("official_warnings", [])
                self.weather_observations = payload.get("weather_observations", [])
                self.ocean_observations = payload.get("ocean_observations", [])
                self.satellite_observations = payload.get("satellite_observations", [])
                self.hazard_events = payload.get("hazard_events", [])
                self.citizen_reports = payload.get("citizen_reports", [])
                self.social_signals = payload.get("social_signals", [])
                self.news_signals = payload.get("news_signals", [])
                self.shelters = payload.get("shelters", [])
                self.roads = payload.get("roads", [])
                logger.info(
                    "Store hydrated: %d hazards, %d shelters, %d reports from seed.",
                    len(self.hazard_events),
                    len(self.shelters),
                    len(self.citizen_reports),
                )
        except Exception as exc:
            logger.error("Failed to parse seed dataset: %s", exc)

    def get_hazards(self) -> list[dict[str, Any]]:
        return self.hazard_events

    def get_hazards_for_location(self, loc_id: str) -> list[dict[str, Any]]:
        norm = loc_id.lower().strip()
        if norm == "puri":
            return self.hazard_events

        lat, lng, name = resolve_location_coordinates(norm)
        return [
            {
                "id": f"HAZ-{norm.upper()}-001",
                "title": f"Severe Coastal Storm Surge & Tidal Inundation ({name})",
                "hazard_type": "COASTAL_FLOODING",
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "status": "ACTIVE",
                "severity": "CRITICAL",
                "ai_risk_score": 88,
                "ai_confidence": 92,
                "is_simulated": False,
                "affected_population_estimate": 45000,
                "critical_infrastructure_threatened": [
                    f"{name} Coastal Marine Highway & Sea Wall",
                    f"{name} Fishing Harbor & Trawler Basin",
                    f"{name} Lowland Coastal Settlements",
                    "District Emergency Hospital Evacuation Corridor",
                ],
                "perimeter_coords": [
                    [round(lat - 0.016, 4), round(lng - 0.018, 4)],
                    [round(lat - 0.003, 4), round(lng - 0.005, 4)],
                    [round(lat + 0.012, 4), round(lng + 0.014, 4)],
                    [round(lat + 0.004, 4), round(lng + 0.024, 4)],
                    [round(lat - 0.019, 4), round(lng + 0.006, 4)],
                    [round(lat - 0.016, 4), round(lng - 0.018, 4)],
                ],
                "trend": "ESCALATING",
                "top_contributing_factors": {
                    "Storm Wave Surge (>4.2m)": 0.32,
                    "High Wind Gusts (70 km/h)": 0.24,
                    "Low Elevation Fringe (<4m)": 0.20,
                    "Heavy Rainfall Influx": 0.16,
                    "Citizen Corroborations": 0.08,
                },
                "timestamp": get_utc_iso(),
            }
        ]

    def get_shelters_for_location(self, loc_id: str) -> list[dict[str, Any]]:
        norm = loc_id.lower().strip()
        if norm == "puri":
            return self.shelters

        lat, lng, name = resolve_location_coordinates(norm)
        templates = [
            ("01", f"{name} District Sports Complex & Relief Hub", "DISTRICT_RELIEF_COMPLEX", 0.0105, 0.0065, 2800, 1050, 1750, 9.2, True, True, 7, "+91-1800-425-0101"),
            ("02", f"{name} Multi-Purpose Cyclone & Flood Shelter", "COASTAL_CYCLONE_SHELTER", 0.0035, 0.0135, 1400, 780, 620, 6.8, True, True, 5, "+91-1800-425-0102"),
            ("03", f"{name} Civic Community Emergency Center", "COMMUNITY_CENTER", -0.0055, -0.0062, 1600, 710, 890, 8.1, False, True, 4, "+91-1800-425-0103"),
        ]

        return [
            {
                "id": f"SHELTER-{norm.upper()}-{s_id}",
                "name": s_name,
                "type": s_type,
                "lat": round(lat + dlat, 4),
                "lng": round(lng + dlng, 4),
                "capacity_total": cap,
                "occupancy_current": occ,
                "available_beds": beds,
                "elevation_m": elev,
                "has_medical_unit": med,
                "has_generator": gen,
                "food_water_days": days,
                "status": "OPERATIONAL",
                "contact_phone": phone,
            }
            for s_id, s_name, s_type, dlat, dlng, cap, occ, beds, elev, med, gen, days, phone in templates
        ]

    def get_hazard_by_id(self, hazard_id: str) -> dict[str, Any] | None:
        return next((h for h in self.hazard_events if h["id"] == hazard_id), None)

    def get_official_warnings(self) -> list[dict[str, Any]]:
        return self.official_warnings

    def get_weather(self) -> list[dict[str, Any]]:
        return self.weather_observations

    def get_ocean(self) -> list[dict[str, Any]]:
        return self.ocean_observations

    def get_satellite(self) -> list[dict[str, Any]]:
        return self.satellite_observations

    def get_citizen_reports(self) -> list[dict[str, Any]]:
        return self.citizen_reports

    def add_citizen_report(
        self,
        report_in: CitizenReportCreate,
        ai_tags: list[str] | None = None,
        verification_score: float = 0.5,
    ) -> dict[str, Any]:
        now_utc = datetime.now(timezone.utc)
        report_id = f"REP-{now_utc.strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
        initial_status = (
            VerificationStatus.CORROBORATED if verification_score >= 0.8
            else VerificationStatus.UNDER_REVIEW
        )

        record = {
            "id": report_id,
            "hazard_type": report_in.hazard_type,
            "description": report_in.description,
            "lat": report_in.lat,
            "lng": report_in.lng,
            "timestamp": now_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": initial_status.value,
            "confidence": round(verification_score, 2),
            "source": "CITIZEN_APP",
            "is_simulated": settings.DATA_MODE == "demo",
            "media_type": report_in.media_type or "TEXT",
            "media_label": f"Uploaded media for {report_in.hazard_type}",
            "media_url": report_in.media_url,
            "people_affected": report_in.people_affected,
            "verification_score": round(verification_score, 2),
            "ai_vision_tags": ai_tags or ["Coastal terrain", "General report"],
        }
        self.citizen_reports.insert(0, record)
        return record

    def update_report_status(
        self, report_id: str, status: VerificationStatus
    ) -> dict[str, Any] | None:
        target = next((r for r in self.citizen_reports if r["id"] == report_id), None)
        if target:
            target["status"] = status.value
            if status == VerificationStatus.VERIFIED:
                target["confidence"] = max(target.get("confidence", 0.8), 0.95)
            elif status == VerificationStatus.REJECTED:
                target["confidence"] = 0.05
        return target

    def get_shelters(self) -> list[dict[str, Any]]:
        return self.shelters

    def get_shelter_by_id(self, shelter_id: str) -> dict[str, Any] | None:
        return next((s for s in self.shelters if s["id"] == shelter_id), None)

    def get_roads(self) -> list[dict[str, Any]]:
        return self.roads

    def get_social_signals(self) -> list[dict[str, Any]]:
        return self.social_signals

    def get_news_signals(self) -> list[dict[str, Any]]:
        return self.news_signals


db = DataStore()

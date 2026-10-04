"""
ResQNet AI - Pydantic Data Contracts and Domain Enums.

Defines validated schemas for authentication, citizen crowdsourcing,
sensor observations, hazard events, explainability (XAI), and routing.
"""

from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class RoleEnum(str, Enum):
    CITIZEN = "CITIZEN"
    AUTHORITY = "AUTHORITY"
    RESPONDER = "RESPONDER"
    ANALYST = "ANALYST"


class VerificationStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    UNDER_REVIEW = "UNDER_REVIEW"
    CORROBORATED = "CORROBORATED"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class SeverityEnum(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class HazardTypeEnum(str, Enum):
    HIGH_WAVES = "HIGH_WAVES"
    COASTAL_FLOODING = "COASTAL_FLOODING"
    STORM_SURGE = "STORM_SURGE"
    TSUNAMI = "TSUNAMI"
    BEACH_EROSION = "BEACH_EROSION"
    OIL_SPILL = "OIL_SPILL"
    INFRASTRUCTURE_DAMAGE = "INFRASTRUCTURE_DAMAGE"
    UNUSUAL_OCEAN = "UNUSUAL_OCEAN"
    OTHER = "OTHER"


# Authentication Schemas
class UserLogin(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: RoleEnum = RoleEnum.CITIZEN


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: RoleEnum


class Token(BaseModel):
    access_token: str
    token_type: str
    role: RoleEnum
    user_name: str


# Citizen Crowdsourced Reports
class CitizenReportCreate(BaseModel):
    hazard_type: str
    description: str
    lat: float
    lng: float
    severity_claimed: SeverityEnum = SeverityEnum.MODERATE
    people_affected: int = 1
    media_url: str | None = None
    media_type: str | None = "TEXT"
    is_anonymous: bool = False
    contact_phone: str | None = None


class CitizenReportOut(BaseModel):
    id: str
    hazard_type: str
    description: str
    lat: float
    lng: float
    timestamp: str
    status: VerificationStatus
    confidence: float
    source: str = "CITIZEN_APP"
    is_simulated: bool = False
    media_type: str | None = None
    media_label: str | None = None
    media_url: str | None = None
    people_affected: int = 1
    verification_score: float = 0.5
    ai_vision_tags: list[str] | None = None


class ReportVerificationAction(BaseModel):
    status: VerificationStatus
    reviewer_notes: str | None = None


# Official Warning Schemas
class OfficialWarningOut(BaseModel):
    id: str
    source: str
    is_official: bool = True
    warning_type: str
    severity_level: str
    headline: str
    description: str
    issued_at: str
    valid_until: str
    coordinates: list[float]
    affected_area: str


# Sensor Telemetry Schemas
class WeatherObservationOut(BaseModel):
    station_id: str
    station_name: str
    source: str
    is_simulated: bool
    lat: float
    lng: float
    timestamp: str
    temperature_c: float
    humidity_pct: float
    wind_speed_kmh: float
    wind_gust_kmh: float
    wind_direction: str
    rainfall_mm_hr: float
    pressure_hpa: float
    trend: str


class OceanObservationOut(BaseModel):
    buoy_id: str
    location_name: str
    source: str
    is_simulated: bool
    lat: float
    lng: float
    timestamp: str
    wave_height_m: float
    wave_period_s: float
    swell_height_m: float
    swell_direction: str
    sea_surface_temp_c: float
    tide_surge_anomaly_m: float
    ocean_state: str


class SatelliteObservationOut(BaseModel):
    id: str
    satellite: str
    provider: str
    product: str
    timestamp: str
    data_latency_mins: int
    is_simulated: bool
    cloud_cover_pct: float | None = None
    max_rain_intensity_mm: float | None = None
    flooded_area_sqkm: float | None = None
    confidence: float | None = None


# Hazard Event & Spatial Perimeters
class HazardEventOut(BaseModel):
    id: str
    title: str
    hazard_type: str
    lat: float
    lng: float
    status: str
    severity: SeverityEnum
    ai_risk_score: int
    ai_confidence: int
    is_simulated: bool
    perimeter_coords: list[list[float]]
    affected_population_estimate: int
    critical_infrastructure_threatened: list[str]
    trend: str
    top_contributing_factors: dict[str, float]


# Bayesian Multi-Source Evidence Matrix
class EvidenceItem(BaseModel):
    source: str
    source_type: str
    timestamp: str
    location: str
    reliability: float
    weight_score: float
    signal_summary: str
    contradiction: bool = False


class EvidenceMatrixOut(BaseModel):
    hazard_id: str
    hazard_title: str
    overall_confidence_pct: int
    total_evidence_sources: int
    source_agreement_pct: int
    contradiction_score: float
    evidence_breakdown: list[EvidenceItem]
    confidence_rationale: str
    is_simulated: bool


# Explainable AI (XAI) Feature Attribution
class XAIExplanationOut(BaseModel):
    risk_score_pct: int
    severity: SeverityEnum
    model_name: str = "ResQNet Coastal Ensemble v1 (RF + XGBoost)"
    top_features: dict[str, float]
    local_explanation: str
    recommended_mitigation: str
    is_simulated: bool


# Parametric Crisis Simulation
class SimulationRequest(BaseModel):
    delta_wave_height_pct: float = Field(default=0.0, ge=-50.0, le=150.0)
    delta_wind_speed_kmh: float = Field(default=0.0, ge=-30.0, le=100.0)
    delta_rainfall_mm_hr: float = Field(default=0.0, ge=-20.0, le=150.0)
    sea_level_rise_m: float = Field(default=0.0, ge=0.0, le=3.0)
    duration_hours: int = Field(default=6, ge=1, le=48)


class SimulationResponse(BaseModel):
    baseline_risk_score: int
    predicted_risk_score: int
    predicted_severity: SeverityEnum
    delta_risk_pct: float
    exposed_population_estimate: int
    affected_zones: list[str]
    inundation_area_sqkm: float
    flooded_road_segments: list[str]
    shelter_capacity_needed: int
    recommended_actions_authority: list[str]
    recommended_actions_citizen: list[str]
    is_simulation: bool = True
    disclaimer: str = "SIMULATION ONLY — NOT AN OFFICIAL GOVERNMENT FORECAST"


# Hazard-Avoidance Evacuation Routing
class SafeRouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    target_shelter_id: str | None = None
    role: RoleEnum = RoleEnum.CITIZEN


class SafeRouteResponse(BaseModel):
    route_id: str
    start_point: list[float]
    target_shelter_id: str
    target_shelter_name: str
    total_distance_km: float
    estimated_travel_time_mins: int
    overall_route_safety_score: int
    path_coordinates: list[list[float]]
    hazards_avoided: list[str]
    step_instructions: list[str]
    disclaimer: str = (
        "AI RECOMMENDED SAFER ROUTE — Follow official on-ground law enforcement "
        "and disaster authority directions"
    )


# Emergency Shelter Logistics
class ShelterOut(BaseModel):
    id: str
    name: str
    type: str
    lat: float
    lng: float
    capacity_total: int
    occupancy_current: int
    available_beds: int
    elevation_m: float
    has_medical_unit: bool
    has_generator: bool
    food_water_days: int
    contact_phone: str
    status: str


# System Diagnostics & Ingestion Health
class ProviderHealth(BaseModel):
    name: str
    status: str
    latency_ms: int
    mode: str
    last_sync: str


class SystemHealthOut(BaseModel):
    status: str
    timestamp: str
    active_data_mode: str
    active_region: str
    database: str
    ai_engine: str
    providers: list[ProviderHealth]

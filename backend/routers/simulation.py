"""
ResQNet AI - Parametric Scenario Simulator & Pipeline Demo Router.

Executes physical what-if crisis stress tests (wave surge, wind, rainfall, sea-level rise)
and powers the 8-stage automated disaster lifecycle pipeline simulation.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter

from backend.database.schemas import SimulationRequest, SimulationResponse
from backend.database.store import db
from ml.risk.risk_model import risk_model

router = APIRouter(prefix="/simulation", tags=["Scenario Simulator & Disaster Simulation"])


@router.post("/run", response_model=SimulationResponse)
async def run_scenario_simulation(req: SimulationRequest) -> dict[str, Any]:
    weather = db.get_weather()[0] if db.get_weather() else {}
    ocean = db.get_ocean()[0] if db.get_ocean() else {}

    base_wave = ocean.get("wave_height_m", 4.4)
    base_wind = weather.get("wind_speed_kmh", 68.5)
    base_rain = weather.get("rainfall_mm_hr", 44.6)

    sim_wave = base_wave * (1.0 + (req.delta_wave_height_pct / 100.0))
    sim_wind = base_wind + req.delta_wind_speed_kmh
    sim_rain = base_rain + req.delta_rainfall_mm_hr
    sim_sea_level = req.sea_level_rise_m

    base_risk, _, _ = risk_model.predict_risk(
        wave_height_m=base_wave,
        wind_speed_kmh=base_wind,
        rainfall_mm_hr=base_rain,
        coastal_elevation_m=2.8,
        citizen_report_count=3,
        official_warning_active=True,
    )

    pred_risk, pred_sev, _ = risk_model.predict_risk(
        wave_height_m=sim_wave,
        wind_speed_kmh=sim_wind,
        rainfall_mm_hr=sim_rain,
        coastal_elevation_m=2.8,
        citizen_report_count=6,
        official_warning_active=True,
        sea_level_anomaly_m=sim_sea_level,
    )

    baseline_pop = 14200
    impact_multiplier = pred_risk / max(1, base_risk)
    sim_pop = int(baseline_pop * (impact_multiplier ** 1.25))

    affected_zones = ["Puri Marine Drive Strip", "Pentakota Fishermen Colony"]
    if pred_risk > 75:
        affected_zones.append("Swargadwar Market Area")
    if pred_risk > 85:
        affected_zones.append("Chakratirtha Coastal Sector")
    if sim_sea_level > 1.0:
        affected_zones.append("Baliguali Lowland Inundation Basin")

    inundation_area = round(
        3.85 * (1.0 + (req.delta_wave_height_pct / 100.0) * 0.4 + (sim_sea_level * 0.6)), 2
    )

    flooded_roads = ["Puri Marine Drive Road"]
    if pred_risk > 70:
        flooded_roads.append("Pentakota Access Link Road")
    if pred_risk > 85:
        flooded_roads.append("VIP Road Southern Segment")

    shelter_beds_needed = int(sim_pop * 0.45)

    return {
        "baseline_risk_score": base_risk,
        "predicted_risk_score": pred_risk,
        "predicted_severity": pred_sev,
        "delta_risk_pct": round(float(pred_risk - base_risk), 1),
        "exposed_population_estimate": sim_pop,
        "affected_zones": affected_zones,
        "inundation_area_sqkm": inundation_area,
        "flooded_road_segments": flooded_roads,
        "shelter_capacity_needed": shelter_beds_needed,
        "recommended_actions_authority": [
            f"Evacuate vulnerable populations across {len(affected_zones)} threatened zones immediately.",
            f"Activate {shelter_beds_needed} additional shelter beds at District Sports Complex.",
            "Impose total vehicular restriction along coastal roads.",
            "Pre-position ODRAF inflatable power-boats at Swargadwar and Pentakota.",
        ],
        "recommended_actions_citizen": [
            "Heed local siren advisories and relocate to nearest designated cyclone shelter immediately.",
            "Do not attempt to drive through water-covered roads or visit beaches.",
            "Secure emergency rations, clean water, and charge communication devices.",
        ],
        "is_simulation": True,
        "disclaimer": "SIMULATION ONLY — NOT AN OFFICIAL GOVERNMENT FORECAST",
    }


@router.post("/execute-pipeline-demo")
async def execute_pipeline_demo() -> dict[str, Any]:
    """Automated 8-stage disaster response lifecycle execution."""
    pipeline_steps = [
        {"step": 1, "stage": "SENSE", "event": "Multi-Source Sensor & Signal Ingestion", "details": "IMD coastal station reports wind 68.5 km/h; INCOIS buoy BOB-04 detects 4.4m wave surge; Citizen uploads geotagged photo of sea water breach at Swargadwar.", "status": "COMPLETED", "timestamp": "T+00:00"},
        {"step": 2, "stage": "EXTRACT", "event": "Multilingual NLP & Computer Vision Processing", "details": "NLP extracts high-urgency waterlogging in Hindi/English; Computer Vision detects submerged road and broken coastal barrier with 91% confidence.", "status": "COMPLETED", "timestamp": "T+00:02"},
        {"step": 3, "stage": "VERIFY", "event": "Evidence Fusion Engine Aggregation", "details": "Combines 7 independent channels (Official IMD Warning + Ocean Buoy + Weather Station + Satellite QPE + 3 Citizen Reports). Confidence climbs to 92%.", "status": "COMPLETED", "timestamp": "T+00:05"},
        {"step": 4, "stage": "PREDICT", "event": "Interpretable Risk Assessment & SHAP Feature Attribution", "details": "AI evaluates risk at 86% (CRITICAL). SHAP attributes 28% to wave surge, 22% to wind velocity, 18% to rain, 15% to low coastal elevation.", "status": "COMPLETED", "timestamp": "T+00:07"},
        {"step": 5, "stage": "MAP & SIMULATE", "event": "Geospatial Hazard Polygon & What-If Forecast", "details": "Hazard perimeter plotted over Puri coastline. Simulates +20% wave increase expanding affected zone to 14,200 exposed citizens.", "status": "COMPLETED", "timestamp": "T+00:09"},
        {"step": 6, "stage": "DECIDE", "event": "Resource Allocation & Shelters Matching", "details": "Puri Sports Complex Relief Center selected (1,820 available beds, medical unit ready). Marine Drive flagged as impassable.", "status": "COMPLETED", "timestamp": "T+00:11"},
        {"step": 7, "stage": "ACT", "event": "Safer Route Generation & Targeted Role Action", "details": "A* engine generates inland evacuation path routing around flooded Marine Drive. Citizen gets localized safety advisory; Authority gets dispatch order.", "status": "COMPLETED", "timestamp": "T+00:13"},
        {"step": 8, "stage": "LEARN", "event": "Audit Log & Model Calibration Archive", "details": "Observation records, verification latency (1.4s), and signal agreements logged for post-event model evaluation and transparency.", "status": "COMPLETED", "timestamp": "T+00:15"},
    ]

    return {
        "scenario_name": "Bay of Bengal Severe Coastal Surge Simulation",
        "pilot_region": "Puri, Odisha",
        "total_execution_time_seconds": 15,
        "stages_executed": len(pipeline_steps),
        "pipeline_timeline": pipeline_steps,
        "final_confidence": 92,
        "final_risk_score": 86,
        "disclaimer": "SIMULATION DEMO — ALL PIPELINE STAGES OPERATING ON SYNTHETIC PILOT TELEMETRY",
    }

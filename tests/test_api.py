import sys
from pathlib import Path

# Ensure project root (ResQnet AI) is in sys.path regardless of how the test is run
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import pytest
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["project"] == "RESQNET AI"
    assert data["status"] == "OPERATIONAL"

def test_get_hazards():
    res = client.get("/api/v1/hazards")
    assert res.status_code == 200
    hazards = res.json()
    assert len(hazards) >= 1
    assert hazards[0]["id"] == "HAZ-PURI-001"
    assert hazards[0]["severity"] == "CRITICAL"

def test_evidence_fusion_endpoint():
    res = client.get("/api/v1/evidence/HAZ-PURI-001")
    assert res.status_code == 200
    data = res.json()
    assert data["overall_confidence_pct"] >= 75
    assert len(data["evidence_breakdown"]) >= 5

def test_risk_assess_endpoint():
    res = client.get("/api/v1/risk/assess")
    assert res.status_code == 200
    data = res.json()
    assert "risk_score_pct" in data
    assert "top_features" in data
    assert "local_explanation" in data

def test_scenario_simulation_endpoint():
    payload = {
        "delta_wave_height_pct": 25.0,
        "delta_wind_speed_kmh": 15.0,
        "delta_rainfall_mm_hr": 20.0,
        "sea_level_rise_m": 0.5,
        "duration_hours": 6
    }
    res = client.post("/api/v1/simulation/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_simulation"] is True
    assert data["predicted_risk_score"] >= data["baseline_risk_score"]
    assert "SIMULATION ONLY" in data["disclaimer"]

def test_citizen_report_submission():
    payload = {
        "hazard_type": "HIGH_WAVES",
        "description": "High waves splashing over sea road near Swargadwar, waterlogging beginning.",
        "lat": 19.806,
        "lng": 85.822,
        "severity_claimed": "HIGH",
        "people_affected": 15
    }
    res = client.post("/api/v1/reports", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert "id" in data
    assert data["status"] in ["UNDER_REVIEW", "CORROBORATED"]
    assert data["confidence"] > 0.5

def test_system_health_endpoint():
    res = client.get("/api/v1/system/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    assert len(data["providers"]) == 7

def test_imd_coastal_bulletin_endpoint():
    res = client.get("/api/v1/hazards/imd/coastal-bulletin?coast=Odisha")
    assert res.status_code == 200
    data = res.json()
    assert data["source"] == "IMD Coastal Bulletin"
    assert "data" in data
    assert len(data["data"]) >= 1
    bulletin = data["data"][0]
    assert "Layer" in bulletin
    assert "Wind" in bulletin
    assert "Sea Condition" in bulletin
    assert "Port Signal" in bulletin

def test_imd_city_forecast_endpoint():
    res = client.get("/api/v1/hazards/imd/city-forecast?station_id=42971")
    assert res.status_code == 200
    data = res.json()
    assert data["source"] == "IMD City Weather Forecast (7-day)"
    forecast = data["data"]
    assert forecast["Station_Code"] == "42971"
    assert "Forecast_Days" in forecast
    assert len(forecast["Forecast_Days"]) == 7

def test_imd_city_mapping_endpoint():
    res = client.get("/api/v1/hazards/imd/city-mapping")
    assert res.status_code == 200
    data = res.json()
    assert data["source"] == "IMD City Forecast Mapping"
    assert len(data["stations"]) >= 5

def test_alerts_endpoint():
    res = client.get("/api/v1/alerts")
    assert res.status_code == 200
    data = res.json()
    assert "official_warnings" in data
    assert "imd_coastal_bulletin" in data
    assert "imd_city_forecast" in data
    assert data["imd_coastal_bulletin"]["Layer"] == "North and South Odisha coast"
    assert len(data["imd_city_forecast"]["Forecast_Days"]) == 7

def test_incois_wind_stress_endpoint():
    res = client.get("/api/v1/hazards/incois/wind-stress?location=puri")
    assert res.status_code == 200
    data = res.json()
    assert data["source"] == "INCOIS QuikSCAT Scatterometer"
    obs = data["data"]["latest_observation"]
    assert "wind_speed_ms" in obs
    assert "zonal_wind_speed_ms" in obs
    assert "meri_wind_speed_ms" in obs
    assert "wind_stress_pa" in obs
    assert "zonal_wind_stress_pa" in obs
    assert "meri_wind_stress_pa" in obs
    assert "wind_stress_curl_pa_m" in obs
    assert "vorticity_state" in obs

def test_incois_ocean_grid_endpoint():
    res = client.get("/api/v1/hazards/incois/ocean-grid?limit=50")
    assert res.status_code == 200
    data = res.json()
    assert data["source"] == "INCOIS QuikSCAT Spatial Grid"
    assert len(data["points"]) > 0

def test_dispatch_alert_endpoint():
    res = client.post("/api/v1/system/dispatch-alert", json={
        "sector": "Puri Coastal Belt, Odisha",
        "target_shelter": "Puri District Sports Complex",
        "urgency": "CRITICAL_SURGE_EVACUATION"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "DISPATCHED"
    assert data["cost_incurred_inr"] == 0.0
    assert "CELL_BROADCAST_SERVICE" in data["channels_activated"]
    assert data["estimated_population_reached"] > 0

if __name__ == "__main__":
    sys.exit(pytest.main(["-v", __file__]))


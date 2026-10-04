import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import pytest
from ml.fusion.evidence_fusion import fusion_engine

def test_evidence_fusion_calculation():
    official_warnings = [{
        "source": "IMD",
        "severity_level": "ORANGE",
        "headline": "High Wave Alert",
        "affected_area": "Puri Coastal Belt",
        "issued_at": "2025-05-18T10:00:00Z"
    }]
    ocean_obs = [{
        "wave_height_m": 4.5,
        "swell_height_m": 3.8,
        "swell_direction": "SE",
        "tide_surge_anomaly_m": 1.5,
        "timestamp": "2025-05-18T10:15:00Z",
        "location_name": "Bay of Bengal"
    }]
    weather_obs = [{
        "wind_speed_kmh": 70.0,
        "wind_gust_kmh": 82.0,
        "rainfall_mm_hr": 45.0,
        "pressure_hpa": 994.0,
        "station_name": "Puri Observatory",
        "timestamp": "2025-05-18T10:15:00Z"
    }]
    satellite_obs = [{
        "satellite": "INSAT-3DR",
        "provider": "MOSDAC",
        "product": "QPE",
        "cloud_cover_pct": 95,
        "timestamp": "2025-05-18T10:00:00Z"
    }]
    citizen_reports = [
        {"id": "REP-1", "status": "VERIFIED", "lat": 19.8, "lng": 85.8, "timestamp": "Recent"},
        {"id": "REP-2", "status": "CORROBORATED", "lat": 19.81, "lng": 85.82, "timestamp": "Recent"}
    ]

    res = fusion_engine.compute_fusion(
        hazard_title="Test Surge",
        official_warnings=official_warnings,
        weather_obs=weather_obs,
        ocean_obs=ocean_obs,
        satellite_obs=satellite_obs,
        citizen_reports=citizen_reports,
        social_signals=[],
        news_signals=[]
    )

    assert 0 <= res["overall_confidence_pct"] <= 100
    assert res["overall_confidence_pct"] >= 75
    assert res["total_evidence_sources"] >= 5
    assert len(res["evidence_breakdown"]) >= 5
    assert res["contradiction_score"] == 0.0
    assert "High confidence" in res["confidence_rationale"]

def test_evidence_fusion_with_contradiction():
    res = fusion_engine.compute_fusion(
        hazard_title="Test Surge",
        official_warnings=[],
        weather_obs=[],
        ocean_obs=[],
        satellite_obs=[],
        citizen_reports=[],
        social_signals=[],
        news_signals=[],
        contradictions_detected=True
    )

    assert res["contradiction_score"] == 4.0

if __name__ == "__main__":
    sys.exit(pytest.main(["-v", __file__]))

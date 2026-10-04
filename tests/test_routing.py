import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import pytest
from ml.routing.safe_route_engine import route_engine

def test_safe_route_calculation():
    shelters = [
        {
            "id": "SHL-01",
            "name": "Puri Sports Complex Shelter",
            "lat": 19.8265,
            "lng": 85.8285,
            "available_beds": 1800
        }
    ]
    roads = [
        {"name": "Puri Marine Drive", "status": "FLOODED_IMPASSABLE"}
    ]
    hazards = []

    res = route_engine.find_safer_route(
        start_lat=19.8055,
        start_lng=85.8210,
        shelters=shelters,
        roads=roads,
        hazards=hazards
    )

    assert res["target_shelter_id"] == "SHL-01"
    assert res["total_distance_km"] > 0
    assert res["estimated_travel_time_mins"] > 0
    assert len(res["path_coordinates"]) >= 3
    assert "AI RECOMMENDED SAFER ROUTE" in res["disclaimer"]
    assert any("Marine Drive" in avoided for avoided in res["hazards_avoided"])

if __name__ == "__main__":
    sys.exit(pytest.main(["-v", __file__]))

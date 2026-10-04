"""
ResQNet AI - INCOIS QuikSCAT Satellite Scatterometer Adapter.

Serves pre-processed daily ocean surface wind vectors, zonal/meridional wind stress,
and cyclonic wind stress curl (vorticity) across Indian coastal monitoring stations.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger("resqnet.incois_wind")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIONS_FILE = BASE_DIR / "data" / "incois_coastal_stations_clean.json"
GRID_FILE = BASE_DIR / "data" / "incois_ocean_wind_grid.json"


class INCOISOceanWindProvider:
    """Adapter for processed INCOIS QuikSCAT scatterometer datasets."""

    def __init__(self) -> None:
        self.stations_data: dict[str, Any] = {}
        self.grid_data: list[dict[str, Any]] = []
        self._load_datasets()

    def _load_datasets(self) -> None:
        if STATIONS_FILE.exists():
            try:
                with open(STATIONS_FILE, "r", encoding="utf-8") as fh:
                    self.stations_data = json.load(fh).get("stations", {})
            except Exception as exc:
                logger.warning("Failed to parse stations dataset: %s", exc)

        if GRID_FILE.exists():
            try:
                with open(GRID_FILE, "r", encoding="utf-8") as fh:
                    self.grid_data = json.load(fh).get("points", [])
            except Exception as exc:
                logger.warning("Failed to parse ocean wind grid: %s", exc)

    def get_station_metrics(self, location_id: str = "puri") -> dict[str, Any] | None:
        loc_key = location_id.lower().strip()
        if loc_key in self.stations_data:
            return self.stations_data[loc_key]

        for k, v in self.stations_data.items():
            if loc_key in k or loc_key in v.get("station", {}).get("name", "").lower():
                return v

        return self.stations_data.get("puri")

    def get_all_stations_summary(self) -> list[dict[str, Any]]:
        return [
            {
                "id": sid,
                "name": sdata.get("station", {}).get("name"),
                "state": sdata.get("station", {}).get("state"),
                "lat": sdata.get("station", {}).get("lat"),
                "lng": sdata.get("station", {}).get("lng"),
                "wind_speed_kmh": sdata.get("wind_metrics", {}).get("wind_speed_kmh"),
                "wind_direction": sdata.get("wind_metrics", {}).get("wind_direction_cardinal"),
                "cyclonic_vorticity": sdata.get("wind_stress", {}).get("cyclonic_vorticity_classification"),
                "coastal_surge_threat": sdata.get("wind_stress", {}).get("coastal_surge_threat_level"),
            }
            for sid, sdata in self.stations_data.items()
        ]

    def get_ocean_grid(self, max_points: int = 250) -> list[dict[str, Any]]:
        return self.grid_data[:max_points]


incois_wind_provider = INCOISOceanWindProvider()

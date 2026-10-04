"""
ResQNet AI - Hazard Events & Observational Telemetry Router.

Exposes active hazard perimeters, INCOIS QuikSCAT scatterometer wind stress,
and official IMD coastal bulletin and 7-day city weather feeds.
"""

from __future__ import annotations

from typing import Any
from fastapi import APIRouter, HTTPException, Query

from backend.database.schemas import HazardEventOut
from backend.database.store import db
from ingestion.providers.imd import IMDProvider
from ingestion.providers.incois_wind import incois_wind_provider

router = APIRouter(prefix="/hazards", tags=["Hazard Events"])
imd_provider = IMDProvider()


@router.get("", response_model=list[HazardEventOut])
async def list_hazards(
    location: str | None = Query(None, description="Optional target location identifier")
) -> list[dict[str, Any]]:
    if location and location.lower().strip() != "puri":
        return db.get_hazards_for_location(location)
    return db.get_hazards()


@router.get("/incois/wind-stress")
@router.get("/incois/scatterometer")
async def get_incois_wind_stress(
    location: str = Query("puri", description="Target coastal station ID or name")
) -> dict[str, Any]:
    """Retrieves INCOIS QuikSCAT ocean surface wind stress, curl, and velocity vectors."""
    data = incois_wind_provider.get_station_metrics(location)
    if not data:
        raise HTTPException(status_code=404, detail=f"No scatterometer data found for location: {location}")
    return {
        "source": "INCOIS QuikSCAT Scatterometer",
        "station_id": location,
        "data": data,
    }


@router.get("/incois/ocean-grid")
async def get_incois_ocean_grid(limit: int = Query(250, ge=10, le=500)) -> dict[str, Any]:
    """Retrieves spatial wind vector & stress curl grid points across Indian waters."""
    points = incois_wind_provider.get_ocean_grid(max_points=limit)
    return {
        "source": "INCOIS QuikSCAT Spatial Grid",
        "count": len(points),
        "points": points,
    }


@router.get("/incois/coastal-stations")
async def list_incois_coastal_stations() -> dict[str, Any]:
    """Returns all coastal monitoring stations in the INCOIS scatterometer dataset."""
    return {
        "source": "INCOIS Coastal Stations Summary",
        "stations": incois_wind_provider.get_all_stations_summary(),
    }


@router.get("/imd/coastal-bulletin")
async def get_imd_coastal_bulletin(
    coast: str = Query("Odisha", description="Target coastal sector")
) -> dict[str, Any]:
    """Queries official IMD Coastal Bulletin records."""
    bulletins = await imd_provider.fetch_coastal_bulletin(target_coast=coast)
    return {
        "source": "IMD Coastal Bulletin",
        "endpoint": "https://api.imd.gov.in/api/v1/coastalbulletin",
        "visualize_url": "https://mausam.imd.gov.in/responsive/coastal_forecast.php",
        "target_coast": coast,
        "count": len(bulletins),
        "data": bulletins,
    }


@router.get("/imd/city-forecast")
async def get_imd_city_forecast(
    station_id: str = Query("42971", description="IMD Station ID"),
    lat: float | None = Query(None, description="Latitude"),
    lng: float | None = Query(None, description="Longitude"),
) -> dict[str, Any]:
    """Queries official IMD 7-Day City Weather Forecast."""
    forecast = await imd_provider.fetch_city_forecast(station_id=station_id, lat=lat, lng=lng)
    return {
        "source": "IMD City Weather Forecast (7-day)",
        "endpoint": "https://api.imd.gov.in/api/v1/cityforecast",
        "visualize_url": "https://city.imd.gov.in",
        "station_id": station_id,
        "data": forecast,
    }


@router.get("/imd/city-mapping")
async def get_imd_city_mapping() -> dict[str, Any]:
    """Retrieves official IMD City Forecast Station Mappings."""
    mapping = await imd_provider.fetch_city_mapping()
    return {
        "source": "IMD City Forecast Mapping",
        "endpoint": "https://api.imd.gov.in/api/v1/cityforecast_mapping",
        "count": len(mapping),
        "stations": mapping,
    }


@router.get("/{hazard_id}", response_model=HazardEventOut)
async def get_hazard(hazard_id: str) -> dict[str, Any]:
    hazard = db.get_hazard_by_id(hazard_id)
    if not hazard:
        raise HTTPException(status_code=404, detail="Hazard event not found")
    return hazard

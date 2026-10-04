"""
ResQNet AI - Central Application Configuration.

Implements Pydantic v2 BaseSettings loading environment parameters,
regional defaults, API credentials, and internal dataset locations.
"""

from __future__ import annotations

import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow",
    )

    PROJECT_NAME: str = "RESQNET AI"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "AI-Powered Multi-Source Ocean & Coastal Disaster Intelligence, "
        "Verification, Risk Assessment and Last-Mile Action Platform"
    )
    TAGLINE: str = "From scattered signals to trusted decisions."

    API_V1_PREFIX: str = "/api/v1"
    DATA_MODE: str = os.getenv("DATA_MODE", "live")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "resqnet-ai-default-dev-secret-key-2025")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Default Pilot Station (Puri, Odisha)
    DEFAULT_REGION_NAME: str = "Puri Coastal Zone, Odisha"
    DEFAULT_LAT: float = 19.8135
    DEFAULT_LNG: float = 85.8312

    # Local Knowledge Base
    DATA_FILE: Path = BASE_DIR / "data" / "pilot_puri.json"

    # Upstream Provider Configuration
    IMD_API_KEY: str = os.getenv("IMD_API_KEY", "")
    IMD_COASTAL_BULLETIN_URL: str = os.getenv(
        "IMD_COASTAL_BULLETIN_URL", "https://api.imd.gov.in/api/v1/coastalbulletin"
    )
    IMD_CITY_FORECAST_URL: str = os.getenv(
        "IMD_CITY_FORECAST_URL", "https://api.imd.gov.in/api/v1/cityforecast"
    )
    IMD_CITY_FORECAST_MAPPING_URL: str = os.getenv(
        "IMD_CITY_FORECAST_MAPPING_URL", "https://api.imd.gov.in/api/v1/cityforecast_mapping"
    )
    INCOIS_API_KEY: str = os.getenv("INCOIS_API_KEY", "")
    MOSDAC_API_KEY: str = os.getenv("MOSDAC_API_KEY", "")
    COPERNICUS_CLIENT_ID: str = os.getenv("COPERNICUS_CLIENT_ID", "")
    COPERNICUS_CLIENT_SECRET: str = os.getenv("COPERNICUS_CLIENT_SECRET", "")
    TWITTER_BEARER_TOKEN: str = os.getenv("TWITTER_BEARER_TOKEN", "")


settings = Settings()

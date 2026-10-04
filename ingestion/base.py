"""
ResQNet AI - Ingestion Provider Abstract Base Class.

Defines the contract for external telemetry providers (fetch, normalize, validate, health_check).
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BaseProvider(ABC):
    """Abstract interface for all observational and satellite data connectors."""

    def __init__(self, name: str, is_demo_mode: bool = True) -> None:
        self.name = name
        self.is_demo_mode = is_demo_mode

    @abstractmethod
    async def fetch(self, lat: float, lng: float, radius_km: float = 25.0) -> dict[str, Any]:
        """Fetches raw observation data from the upstream source."""
        pass

    @abstractmethod
    def normalize(self, raw_data: dict[str, Any]) -> dict[str, Any]:
        """Normalizes provider-specific telemetry into standard ResQNet schema."""
        pass

    @abstractmethod
    def validate(self, normalized_data: dict[str, Any]) -> bool:
        """Validates payload schema constraints and physical boundary ranges."""
        pass

    @abstractmethod
    async def health_check(self) -> dict[str, Any]:
        """Executes lightweight availability, latency, and connectivity check."""
        pass

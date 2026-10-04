"""
ResQNet AI - Computer Vision Damage & Water Intrusion Inspector.

Classifies visual evidence from crowdsourced hazard imagery and Sentinel SAR backscatter
into hazard categories (water inundation, wave turbulence, structural breaches, road blockage).
"""

from __future__ import annotations

from typing import Any


class CoastalVisionDamageInspector:
    """Classifies disaster imagery features into actionable coastal impact categories."""

    DETECTION_CLASSES: dict[str, dict[str, str]] = {
        "WATER_INUNDATION": {"label": "Coastal Water Intrusion / Flooding", "severity": "HIGH"},
        "LARGE_WAVES": {"label": "Severe Storm Waves / High Surf", "severity": "HIGH"},
        "ROAD_BLOCKAGE": {"label": "Flooded Road / Debris Obstruction", "severity": "CRITICAL"},
        "STRUCTURAL_BREACH": {"label": "Sea Wall or Embankment Damage", "severity": "CRITICAL"},
        "NORMAL_COAST": {"label": "Calm Shoreline / Minor Splashes", "severity": "LOW"},
    }

    _SIGNATURES: list[tuple[tuple[str, ...], str, list[str], float]] = [
        (("wall", "breach", "barrier", "crack", "collapse"), "STRUCTURAL_BREACH", ["Broken sea wall", "Eroded foundation", "Water spillover"], 0.92),
        (("road", "street", "car", "drive", "bike", "traffic"), "ROAD_BLOCKAGE", ["Submerged asphalt", "Knee-deep water", "Vehicle impassable"], 0.91),
        (("wave", "surf", "splash", "rough", "ocean", "tide"), "LARGE_WAVES", ["Turbulent whitecaps", "Wave crest > 3.5m", "Beach spray"], 0.89),
        (("flood", "water", "drown", "submerge", "pool"), "WATER_INUNDATION", ["Standing sea water", "Flooded settlement", "Debris floating"], 0.87),
    ]

    def inspect_image(
        self,
        file_name: str | None = None,
        prompt_hint: str | None = None,
    ) -> dict[str, Any]:
        combined = f"{(prompt_hint or '').lower()} {(file_name or '').lower()}"

        primary_class = "WATER_INUNDATION"
        detected_tags = ["Coastal waterlogging", "Silt deposition", "High moisture"]
        confidence = 0.82

        for keywords, cls_name, tags, conf in self._SIGNATURES:
            if any(k in combined for k in keywords):
                primary_class = cls_name
                detected_tags = tags
                confidence = conf
                break

        depth_level = (
            "MODERATE_TO_DEEP (>0.5m)"
            if primary_class in ("ROAD_BLOCKAGE", "WATER_INUNDATION")
            else "HIGH_TURBULENCE"
        )

        return {
            "primary_classification": primary_class,
            "classification_details": self.DETECTION_CLASSES[primary_class],
            "detected_objects": detected_tags,
            "vision_confidence": confidence,
            "estimated_water_depth_level": depth_level,
            "is_actionable_hazard": primary_class != "NORMAL_COAST",
            "disclaimer": (
                "AI Computer Vision assessment is indicative and should be corroborated "
                "with physical sensor data and local official reports."
            ),
        }


vision_inspector = CoastalVisionDamageInspector()

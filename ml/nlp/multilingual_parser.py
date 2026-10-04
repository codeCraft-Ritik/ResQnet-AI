"""
ResQNet AI - Multilingual Hazard Text & Urgency Parser.

Extracts disaster classes, geographical landmarks, life threats, and urgency scores
from crowdsourced reports across English, Hindi (Devanagari), and romanized Hinglish.
"""

from __future__ import annotations

import re
from typing import Any


class MultilingualNLPHazardParser:
    """Pre-compiled regex parser for real-time multilingual disaster report extraction."""

    _HAZARDS: dict[str, list[re.Pattern[str]]] = {
        "COASTAL_FLOODING": [
            re.compile(p, re.IGNORECASE) for p in (
                r"flood", r"flooding", r"waterlogging", r"inundation", r"submerged",
                r"sea water entered", r"बाढ़", r"जलभराव", r"पानी भर गया", r"डूबा",
                r"समुद्र का पानी", r"pani bhar gaya", r"samundar ka pani", r"paani ghus gaya"
            )
        ],
        "HIGH_WAVES": [
            re.compile(p, re.IGNORECASE) for p in (
                r"high wave", r"giant wave", r"huge wave", r"rough sea", r"swell",
                r"wave surge", r"ऊंची लहरें", r"विशाल लहरें", r"लहर", r"खतरनाक समुद्र",
                r"oonchi lehrein", r"laharein", r"badi lahar"
            )
        ],
        "STORM_SURGE": [
            re.compile(p, re.IGNORECASE) for p in (
                r"storm surge", r"cyclone", r"squall", r"depression", r"gale",
                r"तूफान", r"चक्रवात", r"आंधी", r"समुद्री तूफान", r"toofan", r"chakrawat", r"aandhi"
            )
        ],
        "INFRASTRUCTURE_DAMAGE": [
            re.compile(p, re.IGNORECASE) for p in (
                r"wall broke", r"breach", r"collapsed", r"road blocked", r"broken barrier",
                r"tree fall", r"दीवार गिर गई", r"रास्ता बंद", r"पेड़ गिर गया", r"क्षतिग्रस्त",
                r"deewar gir gayi", r"rasta band", r"ped gir gaya"
            )
        ],
        "TSUNAMI": [
            re.compile(p, re.IGNORECASE) for p in (
                r"tsunami", r"sea receding", r"sudden ocean withdrawal", r"सुनामी",
                r"समुद्र पीछे हट गया", r"sunami", r"pani peeche hat gaya"
            )
        ],
    }

    _LOCATIONS: list[str] = [
        "Swargadwar", "Marine Drive", "Pentakota", "Light House", "VIP Road",
        "Grand Road", "Badadanda", "Puri Beach", "Chandrabhaga", "Astaranga",
        "स्वर्गद्वार", "मरीन ड्राइव", "पेंटाकोटा", "लाइट हाउस", "पुरी बीच",
    ]

    _URGENCY_PATTERNS: list[re.Pattern[str]] = [
        re.compile(p, re.IGNORECASE) for p in (
            r"trapped", r"rescue needed", r"sos", r"emergency", r"drowning",
            r"injured", r"help us", r"फंसे हुए", r"मदद चाहिए", r"डूब रहे",
            r"बचाओ", r"घायल", r"fanse hue", r"bachao", r"madad chahiye", r"doob rahe"
        )
    ]

    _COUNT_REGEX = re.compile(
        r"\b(\d+)\s*(people|families|persons|boats|houses|लोग|नाव)?\b", re.IGNORECASE
    )
    _DEVANAGARI_REGEX = re.compile(r"[\u0900-\u097F]")
    _WORD_TOKEN_REGEX = re.compile(r"\b\w{4,}\b")

    def parse(self, text: str) -> dict[str, Any]:
        """Parses report text and extracts structured disaster attributes."""
        text_lower = text.lower()

        # Classification via matched pattern density
        best_hazard = "OTHER"
        highest_matches = 0
        for hazard, patterns in self._HAZARDS.items():
            matches = sum(1 for p in patterns if p.search(text_lower))
            if matches > highest_matches:
                highest_matches = matches
                best_hazard = hazard

        # Landmark extraction
        extracted_locations = [
            loc for loc in self._LOCATIONS if loc.lower() in text_lower
        ]

        # Urgency & threat detection
        has_life_threat = any(p.search(text_lower) for p in self._URGENCY_PATTERNS)
        urgency = 2
        if best_hazard in ("TSUNAMI", "STORM_SURGE"):
            urgency += 1
        if has_life_threat:
            urgency += 2
        if extracted_locations:
            urgency += 1
        urgency = min(5, urgency)

        # Quantity / head-count estimation
        count_matches = self._COUNT_REGEX.findall(text_lower)
        estimated_affected = 1
        if count_matches:
            try:
                numbers = [int(m[0]) for m in count_matches if int(m[0]) < 10000]
                if numbers:
                    estimated_affected = max(numbers)
            except (ValueError, TypeError):
                estimated_affected = 1

        is_hindi = bool(self._DEVANAGARI_REGEX.search(text))

        return {
            "hazard_type": best_hazard,
            "urgency_score": urgency,
            "has_life_threat": has_life_threat,
            "extracted_locations": extracted_locations,
            "estimated_affected": estimated_affected,
            "language_detected": "HINDI" if is_hindi else "ENGLISH",
            "keywords_found": self._WORD_TOKEN_REGEX.findall(text_lower)[:8],
        }


nlp_parser = MultilingualNLPHazardParser()

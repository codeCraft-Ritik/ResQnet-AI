"""
ResQNet AI - Coastal Hazard Composite Risk Engine.

Evaluates multi-factor physical vulnerability and returns bounded risk scores (0-100),
severity classifications, and normalized feature attribution weights.
"""

from __future__ import annotations

from backend.database.schemas import SeverityEnum


class CoastalRiskAssessmentModel:
    """Computes transparent physical risk scores and attribution profiles."""

    def predict_risk(
        self,
        wave_height_m: float,
        wind_speed_kmh: float,
        rainfall_mm_hr: float,
        coastal_elevation_m: float,
        citizen_report_count: int,
        official_warning_active: bool,
        sea_level_anomaly_m: float = 0.0,
        wind_stress_pa: float = 0.0,
        wind_stress_curl: float = 0.0,
    ) -> tuple[int, SeverityEnum, dict[str, float]]:
        # Physical factor components (weighted points)
        wave_pts = min(28.0, (wave_height_m / 6.0) * 28.0)
        wind_pts = min(20.0, (wind_speed_kmh / 90.0) * 20.0)
        rain_pts = min(16.0, (rainfall_mm_hr / 60.0) * 16.0)
        elev_pts = 12.0 if coastal_elevation_m < 3.0 else (7.0 if coastal_elevation_m < 6.0 else 2.0)
        crowd_pts = min(8.0, citizen_report_count * 2.5)
        warning_pts = 6.0 if official_warning_active else 0.0

        # Scatterometer wind stress & cyclonic curl (up to 10 pts)
        stress_pts = 0.0
        if wind_stress_pa > 0:
            stress_pts += min(5.0, (wind_stress_pa / 0.25) * 5.0)
        if wind_stress_curl > 0:
            stress_pts += min(5.0, (wind_stress_curl / 2.0e-7) * 5.0)

        raw_total = wave_pts + wind_pts + rain_pts + elev_pts + crowd_pts + warning_pts + stress_pts
        if sea_level_anomaly_m > 0:
            raw_total += min(15.0, sea_level_anomaly_m * 7.5)

        bounded_score = min(99, max(5, int(round(raw_total))))

        if bounded_score >= 80:
            severity = SeverityEnum.CRITICAL
        elif bounded_score >= 60:
            severity = SeverityEnum.HIGH
        elif bounded_score >= 35:
            severity = SeverityEnum.MODERATE
        else:
            severity = SeverityEnum.LOW

        normalizer = max(1.0, raw_total)
        factor_weights = {
            "Wave Height Surge": round(wave_pts / normalizer, 2),
            "Wind Velocity": round(wind_pts / normalizer, 2),
            "Precipitation Intensity": round(rain_pts / normalizer, 2),
            "Low Elevation Exposure": round(elev_pts / normalizer, 2),
            "Ocean Wind Stress & Curl": round(max(0.05, stress_pts) / normalizer, 2),
            "Citizen Reports Volume": round(crowd_pts / normalizer, 2),
            "Official Warning Correlation": round(warning_pts / normalizer, 2),
        }

        return bounded_score, severity, factor_weights


risk_model = CoastalRiskAssessmentModel()

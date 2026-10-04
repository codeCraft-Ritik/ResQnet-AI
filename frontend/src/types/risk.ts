import { SeverityLevel } from './disaster';

export interface RiskAssessment {
  risk_score_pct: number;
  severity_level: SeverityLevel;
  exposed_population_estimate: number;
  timestamp: string;
  top_features: Record<string, number>;
  local_explanation: string;
  trend?: string;
}

export interface EvidenceItem {
  source: string;
  source_type: string;
  reliability: number;
  weight_score: number;
  signal_summary: string;
  location: string;
}

export interface EvidenceMatrix {
  hazard_id: string;
  overall_confidence_pct: number;
  confidence_rationale: string;
  contradiction_detected: boolean;
  evidence_breakdown: EvidenceItem[];
}

export interface SimulationPayload {
  delta_wave_height_pct: number;
  delta_wind_speed_kmh: number;
  delta_rainfall_mm_hr: number;
  sea_level_rise_m: number;
  duration_hours: number;
}

export interface SimulationResult {
  is_simulation: boolean;
  baseline_risk_score: number;
  predicted_risk_score: number;
  delta_risk_pct: number;
  predicted_severity: SeverityLevel;
  exposed_population_estimate: number;
  inundation_area_sqkm: number;
  affected_zones: string[];
  recommended_actions_authority: string[];
  disclaimer: string;
}

export interface PipelineStep {
  step: number;
  stage: string;
  event: string;
  details: string;
  timestamp: string;
}

export interface PipelineDemoResult {
  is_simulation: boolean;
  scenario: string;
  pipeline_timeline: PipelineStep[];
}

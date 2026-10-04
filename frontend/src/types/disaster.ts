export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface HazardEvent {
  id: string;
  title: string;
  hazard_type: string;
  severity: SeverityLevel;
  ai_risk_score: number;
  ai_confidence: number;
  affected_population_estimate: number;
  critical_infrastructure_threatened: string[];
  perimeter_coords: [number, number][];
  trend: string;
  timestamp: string;
}

export interface CitizenReport {
  id: string;
  hazard_type: string;
  description: string;
  lat: number;
  lng: number;
  people_affected: number;
  status: 'VERIFIED' | 'CORROBORATED' | 'UNDER_REVIEW' | 'FLAGGED';
  confidence: number;
  source: string;
  timestamp: string;
  media_type?: string;
  media_url?: string;
  ai_vision_tags?: string[];
  corroboration_count?: number;
}

export interface Shelter {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  capacity_total: number;
  available_beds: number;
  elevation_m: number;
  has_medical_unit: boolean;
  contact_phone: string;
}

export interface WeatherObservation {
  station_id: string;
  station_name: string;
  lat: number;
  lng: number;
  timestamp: string;
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  wind_gust_kmh: number;
  wind_direction: string;
  rainfall_mm_hr: number;
  pressure_hpa: number;
  trend: string;
  sea_condition?: string;
  port_signal?: string;
  ttt_warning?: string;
  synoptic_situation?: string;
  issued_by?: string;
  layer?: string;
  is_simulated?: boolean;
}

export interface OceanObservation {
  buoy_id: string;
  lat: number;
  lng: number;
  timestamp: string;
  wave_height_m: number;
  wave_period_s: number;
  wave_direction: string;
  swell_height_m: number;
  swell_direction: string;
  sea_surface_temp_c: number;
  tide_surge_anomaly_m: number;
  is_simulated?: boolean;
}

export interface LocationProfile {
  id: string;
  name: string;
  district?: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  is_coastal: boolean;
  station_id?: string;
  buoy_id?: string;
  baseline_exposure: number;
  vulnerability_index: number;
  coastal_layer?: string;
}

export interface OceanWindStressObservation {
  date: string;
  wind_speed_ms: number;
  wind_speed_kmh: number;
  wind_speed_knots: number;
  zonal_wind_speed_ms: number;
  meri_wind_speed_ms: number;
  wind_direction_deg: number;
  wind_direction_cardinal: string;
  wind_stress_pa: number;
  zonal_wind_stress_pa: number;
  meri_wind_stress_pa: number;
  wind_stress_curl_pa_m: number;
  wind_stress_curl_scaled: number;
  vorticity_state: string;
}

export interface IncoisScatterometerData {
  station: {
    id: string;
    name: string;
    state: string;
    lat: number;
    lng: number;
  };
  nearest_grid_cell: {
    lat: number;
    lng: number;
  };
  latest_observation: OceanWindStressObservation;
  recent_7_days: OceanWindStressObservation[];
  total_days_recorded: number;
}


export interface CoastalBulletinRecord {
  Id: string;
  "Date of Observation": string;
  Layer: string;
  "Issued by": string;
  "Valid From": string;
  Validity: string;
  "TTT Warning": string;
  Wind: string;
  "Synoptic Situation": string;
  Weather: string;
  Visibility: string;
  "Sea Condition": string;
  "Port Signal": string;
  "Update Time": string;
  is_simulated?: boolean;
}

export interface CityForecastDay {
  Date: string;
  Today_Max_temp: string;
  Today_Min_temp: string;
  Weather_Forecast: string;
  Warning: string;
  Relative_Humidity_at_0830: string;
  Relative_Humidity_at_1730: string;
  Sunrise_time: string;
  Sunset_time: string;
}

export interface CityForecastResponse {
  Station_Code: string;
  Station_Name: string;
  State: string;
  Latitude: number;
  Longitude: number;
  Date_Of_Issue: string;
  Forecast_Days: CityForecastDay[];
  is_simulated?: boolean;
}

export interface OfficialWarning {
  id: string;
  source: string;
  is_official: boolean;
  warning_type: string;
  severity_level: 'YELLOW' | 'ORANGE' | 'RED';
  headline: string;
  description: string;
  issued_at: string;
  valid_until: string;
  coordinates: [number, number];
  affected_area: string;
}

export interface AIRiskAlert {
  id: string;
  hazard_id: string;
  title: string;
  category: string;
  severity: string;
  risk_score_pct: number;
  confidence_pct: number;
  summary: string;
  disclaimer: string;
  timestamp: string;
}

export interface CrowdsourcedAlert {
  id: string;
  report_id: string;
  title: string;
  category: string;
  status: string;
  location: string;
  summary: string;
  confidence: number;
  timestamp: string;
}

export interface AlertsFeed {
  official_warnings: OfficialWarning[];
  imd_coastal_bulletin?: CoastalBulletinRecord;
  imd_city_forecast?: CityForecastResponse;
  ai_risk_alerts: AIRiskAlert[];
  crowdsourced_corroborated_events: CrowdsourcedAlert[];
  guidance_banner: string;
}

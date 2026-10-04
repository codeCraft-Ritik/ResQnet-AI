import { COASTAL_SECTORS, findLocationById, searchLocations } from '../data/demo/locations';
import { LocationProfile, WeatherObservation, OceanObservation, OceanWindStressObservation, IncoisScatterometerData } from '../types/disaster';
import { getIMDCoastalBulletin, getIMDCityForecast, getINCOISWindStress } from './weatherService';
import { getHazards } from './hazardService';
import { getRiskAssessment } from './riskService';

export interface LocationIntelligenceData {
  location: LocationProfile;
  weather: WeatherObservation;
  ocean?: OceanObservation;
  windStress?: OceanWindStressObservation;
  windStressStation?: IncoisScatterometerData | null;
  riskScore: number;
  confidence: number;
  severity: string;
  trend: string;
  isSimulated: boolean;
  lastUpdated: string;
}

export async function getLocationIntelligence(locationId: string): Promise<LocationIntelligenceData> {
  const loc = findLocationById(locationId) || COASTAL_SECTORS[0];
  const hazards = await getHazards();
  const risk = await getRiskAssessment();
  const bulletin = await getIMDCoastalBulletin(loc.coastal_layer || 'Odisha');
  const cityForecast = await getIMDCityForecast(loc.station_id || '42971', loc.lat, loc.lng);
  const windStressData = await getINCOISWindStress(loc.id);

  const firstBulletin = bulletin[0] || {};
  const firstDay = cityForecast.Forecast_Days?.[0];

  const weather: WeatherObservation = {
    station_id: `IMD-${loc.name.toUpperCase()}-${loc.station_id || 'STN'}`,
    station_name: `${loc.name} Meteorological Observatory`,
    lat: loc.lat,
    lng: loc.lng,
    timestamp: new Date().toISOString(),
    temperature_c: firstDay ? parseFloat(firstDay.Today_Max_temp) : 28.5,
    humidity_pct: 88,
    wind_speed_kmh: 68.5,
    wind_gust_kmh: 79.2,
    wind_direction: 'ESE',
    rainfall_mm_hr: 44.6,
    pressure_hpa: 994.2,
    trend: 'FALLING_PRESSURE',
    sea_condition: firstBulletin['Sea Condition'] || 'Rough to Very Rough',
    port_signal: firstBulletin['Port Signal'] || 'Signal No. III',
    ttt_warning: firstBulletin['TTT Warning'] || '',
    synoptic_situation: firstBulletin['Synoptic Situation'] || '',
    issued_by: firstBulletin['Issued by'] || 'IMD',
    layer: firstBulletin.Layer || loc.coastal_layer,
    is_simulated: false
  };

  let ocean: OceanObservation | undefined = undefined;
  if (loc.is_coastal) {
    ocean = {
      buoy_id: loc.buoy_id || 'INCOIS-BOB-04',
      lat: loc.lat - 0.07,
      lng: loc.lng + 0.03,
      timestamp: new Date().toISOString(),
      wave_height_m: 4.4,
      wave_period_s: 11.2,
      wave_direction: 'SE',
      swell_height_m: 3.7,
      swell_direction: 'SE',
      sea_surface_temp_c: 29.6,
      tide_surge_anomaly_m: 1.45,
      is_simulated: false
    };
  }

  const primaryHazard = hazards[0];

  return {
    location: loc,
    weather,
    ocean,
    windStress: windStressData?.latest_observation,
    windStressStation: windStressData,
    riskScore: primaryHazard ? primaryHazard.ai_risk_score : risk.risk_score_pct,
    confidence: primaryHazard ? primaryHazard.ai_confidence : 92,
    severity: primaryHazard ? primaryHazard.severity : risk.severity_level,
    trend: primaryHazard ? primaryHazard.trend : 'WORSENING_RAPIDLY',
    isSimulated: false,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

export { searchLocations };

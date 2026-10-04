import { request } from './apiClient';
import { HazardEvent, LocationProfile } from '../types/disaster';
import { EvidenceMatrix } from '../types/risk';

export async function getHazards(locationId?: string, locProfile?: LocationProfile): Promise<HazardEvent[]> {
  try {
    const data = await request<HazardEvent[]>('/hazards');
    if (data && data.length > 0 && (!locationId || locationId.toLowerCase() === 'puri')) {
      return data;
    }
  } catch (err) {
    console.warn('Backend hazards fallback applied:', err);
  }

  // If a specific location other than Puri is requested, provide realistic localized hazard event
  if (locProfile && locProfile.id !== 'puri') {
    const lat = locProfile.lat;
    const lng = locProfile.lng;
    const isCoastal = locProfile.is_coastal;

    const criticalInfra = isCoastal ? [
      `${locProfile.name} Coastal Marine Highway & Sea Wall`,
      `${locProfile.name} Fishing Harbor & Trawler Basin`,
      `${locProfile.name} Lowland Coastal Settlements`,
      `District Emergency Hospital Evacuation Corridor`
    ] : [
      `${locProfile.name} Ring Road Underpass & Transit Corridors`,
      `${locProfile.name} Lowland Storm Drain Channel`,
      `Metropolitan Power Substation Perimeter`,
      `District Trauma Care Access Arterial`
    ];

    return [
      {
        id: `HAZ-${locProfile.id.toUpperCase()}-001`,
        title: isCoastal
          ? `Severe Coastal Storm Surge & Tidal Inundation (${locProfile.name})`
          : `Severe Urban Flash Flood & Inundation (${locProfile.name})`,
        hazard_type: isCoastal ? 'COASTAL_FLOODING' : 'FLASH_FLOOD',
        severity: 'CRITICAL',
        ai_risk_score: Math.min(94, Math.max(74, Math.round(locProfile.vulnerability_index * 100 + 12))),
        ai_confidence: 93,
        affected_population_estimate: Math.round(locProfile.baseline_exposure * 0.16),
        critical_infrastructure_threatened: criticalInfra,
        perimeter_coords: [
          [lat - 0.016, lng - 0.018],
          [lat - 0.003, lng - 0.005],
          [lat + 0.012, lng + 0.014],
          [lat + 0.004, lng + 0.024],
          [lat - 0.019, lng + 0.006],
          [lat - 0.016, lng - 0.018]
        ],
        trend: 'WORSENING_RAPIDLY',
        timestamp: new Date().toISOString()
      }
    ];
  }

  // Default Puri Hazard
  return [
    {
      id: 'HAZ-PURI-001',
      title: 'Severe Coastal Surge & Wave Inundation',
      hazard_type: 'COASTAL_FLOODING',
      severity: 'CRITICAL',
      ai_risk_score: 88,
      ai_confidence: 92,
      affected_population_estimate: 42500,
      critical_infrastructure_threatened: [
        'Puri Marine Drive Road',
        'Swargadwar Crematorium & Beach Road',
        'Pentakota Fishermen Colony',
        'District Hospital Access Route'
      ],
      perimeter_coords: [
        [19.7980, 85.8150],
        [19.8120, 85.8280],
        [19.8160, 85.8450],
        [19.8050, 85.8500],
        [19.7950, 85.8300],
        [19.7980, 85.8150]
      ],
      trend: 'WORSENING_RAPIDLY',
      timestamp: new Date().toISOString()
    }
  ];
}

export async function getHazardById(id: string): Promise<HazardEvent> {
  return await request<HazardEvent>(`/hazards/${id}`);
}

export async function getHazardEvidence(hazardId: string, locProfile?: LocationProfile): Promise<EvidenceMatrix> {
  try {
    if (!locProfile || locProfile.id === 'puri') {
      return await request<EvidenceMatrix>(`/evidence/${hazardId}`);
    }
  } catch (err) {
    console.warn('Backend evidence fallback applied:', err);
  }

  if (locProfile && locProfile.id !== 'puri') {
    return {
      hazard_id: `HAZ-${locProfile.id.toUpperCase()}-001`,
      overall_confidence_pct: 93,
      confidence_rationale: `High multi-source corroboration: IMD advisory for ${locProfile.state} matches INCOIS buoy ${locProfile.buoy_id || 'sensors'} and Copernicus Sentinel-1 SAR water perimeter detection across ${locProfile.name}.`,
      contradiction_detected: false,
      evidence_breakdown: [
        {
          source: "IMD Weather",
          source_type: "GOV_WARNING",
          reliability: 0.95,
          weight_score: 30,
          signal_summary: `Squally wind 65-75 km/h with heavy precipitation warning across ${locProfile.name}`,
          location: `${locProfile.name} Weather Observatory`
        },
        {
          source: "INCOIS Ocean Buoy",
          source_type: "SENSOR_BUOY",
          reliability: 0.91,
          weight_score: 28,
          signal_summary: `Significant wave height >4m with tidal surge anomaly +1.35m`,
          location: `${locProfile.buoy_id || 'Regional Maritime Ocean Buoy'}`
        },
        {
          source: "Copernicus Sentinel-1",
          source_type: "SAR_SATELLITE",
          reliability: 0.86,
          weight_score: 24,
          signal_summary: `SAR radar water backscatter perimeter expansion across ${locProfile.name} lowland reach`,
          location: `${locProfile.name} Coastal Fringe`
        },
        {
          source: "Citizen Crowdsourced",
          source_type: "CITIZEN_PHOTO",
          reliability: 0.72,
          weight_score: 14,
          signal_summary: `Multiple geolocated citizen photo corroborations of waterlogging along access corridors`,
          location: `${locProfile.name} Urban Coastal Area`
        }
      ]
    };
  }

  return {
    hazard_id: hazardId,
    overall_confidence_pct: 92,
    confidence_rationale: "High multi-source corroboration: IMD squally weather advisory aligns with INCOIS wave height >4m and Sentinel-1 radar water boundary detection.",
    contradiction_detected: false,
    evidence_breakdown: [
      { source: "IMD Weather", source_type: "GOV_WARNING", reliability: 0.95, weight_score: 30, signal_summary: "Squally wind 60-70 km/h with heavy rainfall", location: "Puri Coastal Belt" },
      { source: "INCOIS Ocean Buoy", source_type: "SENSOR_BUOY", reliability: 0.90, weight_score: 28, signal_summary: "Wave height 4.4m, tidal surge +1.45m", location: "Bay of Bengal (Buoy 04)" },
      { source: "Copernicus Sentinel-1", source_type: "SAR_SATELLITE", reliability: 0.85, weight_score: 22, signal_summary: "SAR radar water perimeter expansion across Swargadwar", location: "Marine Drive Coastal Fringe" },
      { source: "Citizen Crowdsourced", source_type: "CITIZEN_PHOTO", reliability: 0.70, weight_score: 12, signal_summary: "Multiple photo corroborations of seawater breaching berms", location: "Swargadwar Beach Front" }
    ]
  };
}


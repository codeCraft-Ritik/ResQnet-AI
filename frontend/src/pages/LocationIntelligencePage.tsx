import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Waves,
  RefreshCw,
  Navigation,
  Sparkles,
  ShieldAlert,
  Activity,
  Satellite,
  Home,
  PhoneCall,
  AlertTriangle
} from 'lucide-react';
import { getLocationIntelligence, LocationIntelligenceData } from '../services/locationService';
import { getHazards, getHazardEvidence } from '../services/hazardService';
import { getShelters } from '../services/shelterService';
import { getReports } from '../services/reportService';
import { getIMDCityForecast } from '../services/weatherService';
import { RiskCard } from '../components/risk/RiskCard';
import { RiskBreakdown } from '../components/risk/RiskBreakdown';
import { XAIPanel } from '../components/risk/XAIPanel';
import { WeatherCard } from '../components/weather/WeatherCard';
import { CityForecastCard } from '../components/weather/CityForecastCard';
import { OceanCard } from '../components/ocean/OceanCard';
import { WindStressCard } from '../components/ocean/WindStressCard';
import { EvidencePanel } from '../components/evidence/EvidencePanel';
import { DisasterMap } from '../components/map/DisasterMap';
import { MapLayers, MapLayersState } from '../components/map/MapLayers';
import { LiveIndiaSatelliteModal } from '../components/weather/LiveIndiaSatelliteModal';
import { SaferRouteCard } from '../components/routes/SaferRouteCard';
import { CitizenReportForm } from '../components/reports/CitizenReportForm';
import { RiskAnalyticsChart } from '../components/risk/RiskAnalyticsChart';
import { Skeleton } from '../components/common/Skeleton';
import { HazardEvent, CitizenReport, Shelter } from '../types/disaster';
import { EvidenceMatrix } from '../types/risk';
import { CityForecastResponse } from '../types/imd';
import { SaferRouteResult } from '../types/route';

interface LocationIntelligencePageProps {
  currentRole: string;
}

export const LocationIntelligencePage: React.FC<LocationIntelligencePageProps> = ({ currentRole }) => {
  const { locationId = 'puri' } = useParams<{ locationId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<LocationIntelligenceData | null>(null);
  const [hazards, setHazards] = useState<HazardEvent[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [evidence, setEvidence] = useState<EvidenceMatrix | null>(null);
  const [cityForecast, setCityForecast] = useState<CityForecastResponse | undefined>(undefined);
  const [activeRoute, setActiveRoute] = useState<SaferRouteResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSatModalOpen, setIsSatModalOpen] = useState(false);
  const [layers, setLayers] = useState<MapLayersState>({
    hazards: true,
    reports: true,
    shelters: true,
    sensors: true,
    satellite: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const intel = await getLocationIntelligence(locationId);
      setData(intel);

      const [hazList, repList, shlList, evData, fcast] = await Promise.all([
        getHazards(intel.location.id, intel.location),
        getReports(intel.location.id, intel.location),
        getShelters(intel.location.id, intel.location),
        getHazardEvidence(`HAZ-${intel.location.id.toUpperCase()}-001`, intel.location),
        getIMDCityForecast(intel.location.station_id || '42971', intel.location.lat, intel.location.lng),
      ]);

      setHazards(hazList);
      setReports(repList);
      setShelters(shlList);
      setEvidence(evData);
      setCityForecast(fcast);
    } catch (err) {
      console.warn('Failed to load location intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [locationId]);

  if (loading || !data) {
    return (
      <div className="space-y-6 py-6 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-[750px] lg:col-span-5 rounded-3xl" />
          <Skeleton className="h-[750px] lg:col-span-7 rounded-3xl" />
        </div>
      </div>
    );
  }

  const loc = data.location;

  return (
    <div className="space-y-6 py-6 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Location Header Bar with High-Density Mission Command HUD */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Back to Platform Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {loc.name}
                </h1>
                <span className="text-sm text-slate-300 font-medium">
                  {loc.district ? `${loc.district}, ` : ''}{loc.state}, {loc.country}
                </span>
                {loc.is_coastal ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shadow-sm">
                    <Waves className="w-3 h-3" /> COASTAL SECTOR
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    INLAND SECTOR
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-400 mt-1.5">
                <span className="flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {loc.lat.toFixed(4)}°N, {loc.lng.toFixed(4)}°E
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Updated: {data.lastUpdated}
                </span>
                <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Telemetry Synchronized
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons & Live status */}
          <div className="flex items-center gap-3 self-end xl:self-auto flex-wrap">
            <button
              onClick={() => setIsSatModalOpen(true)}
              className="p-2.5 px-3.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
              title="View Real-Time INSAT-3D Satellite Imagery of India"
            >
              <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Live India Satellite</span>
            </button>

            <button
              onClick={loadData}
              className="p-2.5 px-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Refresh Data</span>
            </button>

            <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-right shadow-sm">
              <div className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider font-mono flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operational Status</span>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300">
                LIVE OPERATIONAL (NRT)
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Quick-HUD Strip (Fills horizontal space with high-value telemetry) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-3 border-t border-white/10">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Composite Risk</div>
              <div className="font-mono font-black text-sm text-red-400">{data.riskScore}/100</div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/30 font-bold">
              {data.severity}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Atmosphere</div>
              <div className="font-mono font-bold text-sm text-slate-200">{data.weather.temperature_c}°C</div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{data.weather.humidity_pct}% Hum</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Precipitation</div>
              <div className="font-mono font-bold text-sm text-cyan-400">{data.weather.rainfall_mm_hr} mm/h</div>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono">Radar 54dBZ</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Wave Surge</div>
              <div className="font-mono font-bold text-sm text-cyan-300">
                {data.ocean ? `${data.ocean.wave_height_m}m` : 'N/A'}
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">
              {data.ocean ? `+${data.ocean.tide_surge_anomaly_m}m` : 'Inland'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Surface Gale</div>
              <div className="font-mono font-bold text-sm text-sky-300">{data.weather.wind_speed_kmh} km/h</div>
            </div>
            <span className="text-[10px] text-sky-400 font-mono">Gust {data.weather.wind_gust_kmh}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">Shelters Ready</div>
              <div className="font-mono font-bold text-sm text-emerald-400">{shelters.length} Verified</div>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono font-bold">100% OK</span>
          </div>
        </div>
      </div>

      {/* Row 1: AI Risk Attribution & Real-Time Sensor Telemetry (Exact Height Alignment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: AI Risk Assessment & SHAP Decomposition (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <RiskCard
            score={data.riskScore}
            severity={data.severity}
            confidence={data.confidence}
            exposedPopulation={loc.baseline_exposure}
            trend={data.trend}
            isSimulated={data.isSimulated}
          />
          <RiskBreakdown />
          <XAIPanel />
        </div>

        {/* Right: Environmental & Marine In-Situ Telemetry (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <WeatherCard weather={data.weather} />
          <OceanCard ocean={data.ocean} isCoastal={loc.is_coastal} />
          <WindStressCard
            scatterometer={data.windStressStation}
            windStress={data.windStress}
            isCoastal={loc.is_coastal}
          />
        </div>
      </div>

      {/* Row 2: 24-Hour Telemetry Velocity Chart & 7-Day Regional Projection (Balanced Stretch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <RiskAnalyticsChart className="h-full" />
        </div>
        <div className="lg:col-span-5">
          <CityForecastCard forecast={cityForecast} className="h-full" />
        </div>
      </div>

      {/* Row 3: Comprehensive Multi-Source Bayesian Evidence Fusion Audit Trail (Full Width) */}
      <div className="w-full">
        <EvidencePanel evidence={evidence || undefined} />
      </div>

      {/* Row 4: Interactive Geospatial Hazard & Safe Evacuation Corridor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-200">
                Geospatial Hazard & Evacuation Map ({loc.name})
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsSatModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-200 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 rounded-2xl transition-all shadow-sm"
                title="View Real-Time INSAT-3D Satellite Imagery of India"
              >
                <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Live India Satellite</span>
              </button>
              <MapLayers layers={layers} onChange={setLayers} />
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
            <DisasterMap
              center={[loc.lat, loc.lng]}
              zoom={14}
              hazards={hazards}
              reports={reports}
              shelters={shelters}
              weather={[data.weather]}
              ocean={data.ocean ? [data.ocean] : []}
              activeRoute={activeRoute}
              showLayers={layers}
              height="580px"
            />
          </div>
        </div>

        {/* Right: Route Planning & Operational Shelters (Balances Map Height) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <SaferRouteCard
            startLat={loc.lat - 0.008}
            startLng={loc.lng - 0.01}
            role={currentRole}
            onRouteCalculated={(route: SaferRouteResult) => setActiveRoute(route)}
          />

          {/* Operational Emergency Shelters Capacity Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-3 bg-[#071324]/85">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">
                    Designated Relief Shelters
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {shelters.length} Verified in {loc.name}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                ALL OPERATIONAL
              </span>
            </div>

            <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 no-scrollbar">
              {shelters.map((s) => {
                const occupancyRate = Math.round(((s.capacity_total - s.available_beds) / s.capacity_total) * 100);
                return (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-colors space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-white truncate">
                        {s.name}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                        {s.available_beds} beds free
                      </span>
                    </div>

                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 rounded-full"
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        Elev: {s.elevation_m}m
                      </span>
                      <span>{s.has_medical_unit ? '🚑 Medical Unit Active' : 'First Aid Station'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Field Intelligence & Citizen Crowdsourced Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <CitizenReportForm
            initialLat={loc.lat}
            initialLng={loc.lng}
            onReportSubmitted={loadData}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Live Incident Stream */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-3 bg-[#071324]/85">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">
                    Live Field Incidents ({loc.name})
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Crowdsourced & Corroborated
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                {reports.length} ACTIVE
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 no-scrollbar">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      {rep.hazard_type.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        rep.status === 'VERIFIED'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      ✓ {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {rep.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">
                    <span>👥 {rep.people_affected} affected</span>
                    <span>🕒 {rep.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Response Hotlines */}
          <div className="glass-panel rounded-2xl p-5 border border-amber-500/25 shadow-xl space-y-3 bg-amber-950/20">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Emergency First Responder Hotlines</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="text-[10px] text-slate-400 uppercase font-mono">NDRF Disaster Helpline</div>
                <div className="font-bold text-amber-400 font-mono text-sm">1078</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Coast Guard SAR</div>
                <div className="font-bold text-cyan-400 font-mono text-sm">1554</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="text-[10px] text-slate-400 uppercase font-mono">State Disaster Control</div>
                <div className="font-bold text-emerald-400 font-mono text-sm">1070</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Ambulance / Emergency</div>
                <div className="font-bold text-red-400 font-mono text-sm">108 / 112</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live India Satellite Imagery Modal */}
      <LiveIndiaSatelliteModal
        isOpen={isSatModalOpen}
        onClose={() => setIsSatModalOpen(false)}
      />
    </div>
  );
};

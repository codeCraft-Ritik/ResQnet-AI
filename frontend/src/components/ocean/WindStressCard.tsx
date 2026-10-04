import React, { useState } from 'react';
import {
  Wind,
  Compass,
  Gauge,
  Activity,
  RotateCw,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  AlertTriangle,
  Info
} from 'lucide-react';
import { IncoisScatterometerData, OceanWindStressObservation } from '../../types/disaster';

interface WindStressCardProps {
  scatterometer?: IncoisScatterometerData | null;
  windStress?: OceanWindStressObservation;
  isCoastal: boolean;
}

export const WindStressCard: React.FC<WindStressCardProps> = ({
  scatterometer,
  windStress,
  isCoastal
}) => {
  const [showHistory, setShowHistory] = useState(false);

  if (!isCoastal) {
    return null;
  }

  const obs = windStress || scatterometer?.latest_observation;

  if (!obs) {
    return null;
  }

  const getVorticityBadge = (state: string) => {
    switch (state) {
      case 'HIGH_SURGE_RISK':
        return {
          label: 'High Cyclonic Surge Risk',
          bg: 'bg-red-500/15 text-red-400 border-red-500/30',
          icon: AlertTriangle
        };
      case 'MODERATE_CYCLONIC_PUMP':
        return {
          label: 'Cyclonic Ekman Pumping',
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: Activity
        };
      case 'ANTICYCLONIC_DOWNWELLING':
        return {
          label: 'Anticyclonic Downwelling',
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          icon: RotateCw
        };
      default:
        return {
          label: 'Neutral Ocean Vorticity',
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: Activity
        };
    }
  };

  const badge = getVorticityBadge(obs.vorticity_state);
  const BadgeIcon = badge.icon;

  const handleDownloadCleanCsv = () => {
    window.open('/api/v1/hazards/incois/wind-stress?location=puri', '_blank');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Background Subtle Aurora Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-teal-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10 relative">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-100 tracking-tight">
              Ocean Wind Stress & Cyclonic Vorticity
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
              INCOIS QUIKSCAT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
            <span>Scatterometer Sensor Grid:</span>
            {scatterometer?.nearest_grid_cell && (
              <span className="font-mono text-cyan-300 font-medium">
                {scatterometer.nearest_grid_cell.lat}°N, {scatterometer.nearest_grid_cell.lng}°E
              </span>
            )}
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-400">Date: {obs.date}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className={`px-3 py-1.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 ${badge.bg}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      {/* Primary 7-Variable Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Wind Speed */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Wind Speed</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">SCALAR</span>
          </div>
          <div className="text-lg font-black text-slate-100 font-mono">
            {obs.wind_speed_kmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-teal-400/90 font-mono mt-0.5">
            {obs.wind_speed_ms} m/s ({obs.wind_speed_knots} kts)
          </div>
        </div>

        {/* 2. Zonal Wind (u-vector) */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zonal Wind (u)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">E-W</span>
          </div>
          <div className="text-lg font-black text-cyan-300 font-mono">
            {obs.zonal_wind_speed_ms > 0 ? `+${obs.zonal_wind_speed_ms}` : obs.zonal_wind_speed_ms} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {obs.zonal_wind_speed_ms >= 0 ? 'Westerly Vector (→)' : 'Easterly Vector (←)'}
          </div>
        </div>

        {/* 3. Meridional Wind (v-vector) */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Meri. Wind (v)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">N-S</span>
          </div>
          <div className="text-lg font-black text-sky-300 font-mono">
            {obs.meri_wind_speed_ms > 0 ? `+${obs.meri_wind_speed_ms}` : obs.meri_wind_speed_ms} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {obs.meri_wind_speed_ms >= 0 ? 'Southerly Vector (↑)' : 'Northerly Vector (↓)'}
          </div>
        </div>

        {/* 4. Direction & Heading */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Wind Bearing</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">{obs.wind_direction_cardinal}</span>
          </div>
          <div className="text-lg font-black text-slate-100 font-mono">
            {obs.wind_direction_deg}°
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Compass Heading
          </div>
        </div>

        {/* 5. Wind Stress Magnitude (tau) */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              <span>Wind Stress (τ)</span>
            </span>
            <span className="text-[10px] font-mono text-purple-400">SURFACE</span>
          </div>
          <div className="text-lg font-black text-purple-300 font-mono">
            {obs.wind_stress_pa} <span className="text-xs font-normal text-slate-400">Pa</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Ocean Surface Drag Force
          </div>
        </div>

        {/* 6. Zonal Wind Stress (tau_x) */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Zonal Stress (τ_x)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">N/m²</span>
          </div>
          <div className="text-lg font-black text-indigo-300 font-mono">
            {obs.zonal_wind_stress_pa > 0 ? `+${obs.zonal_wind_stress_pa}` : obs.zonal_wind_stress_pa} <span className="text-xs font-normal text-slate-400">Pa</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            East-West Drag Component
          </div>
        </div>

        {/* 7. Meridional Wind Stress (tau_y) */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span>Meri. Stress (τ_y)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">N/m²</span>
          </div>
          <div className="text-lg font-black text-violet-300 font-mono">
            {obs.meri_wind_stress_pa > 0 ? `+${obs.meri_wind_stress_pa}` : obs.meri_wind_stress_pa} <span className="text-xs font-normal text-slate-400">Pa</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            North-South Drag Component
          </div>
        </div>

        {/* 8. Wind Stress Curl (Vorticity) */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-teal-500/30 hover:border-teal-500/50 transition-all bg-gradient-to-b from-teal-500/[0.05] to-transparent">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-teal-300 animate-spin-slow" />
              <span className="text-teal-200 font-bold">Stress Curl (∇×τ)</span>
            </span>
            <span className="text-[9px] font-mono text-teal-400/90 font-semibold">10⁻⁷ N/m³</span>
          </div>
          <div className="text-lg font-black text-teal-200 font-mono">
            {obs.wind_stress_curl_scaled > 0 ? `+${obs.wind_stress_curl_scaled}` : obs.wind_stress_curl_scaled}
          </div>
          <div className="text-[10px] text-teal-300/80 font-mono mt-0.5">
            {obs.wind_stress_curl_scaled >= 0 ? 'Cyclonic Pumping (+)' : 'Anticyclonic Downwelling (-)'}
          </div>
        </div>
      </div>

      {/* Physics Insight & Actions Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-cyan-300">Oceanographic Context:</strong> High positive wind stress curl (∇×τ) drives cyclonic Ekman divergence, lifting the coastal thermocline and intensifying storm surge inundation potential.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {scatterometer?.recent_7_days && scatterometer.recent_7_days.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 font-medium"
            >
              <span>{showHistory ? 'Hide 7-Day Trend' : 'View 7-Day Trend'}</span>
              {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            onClick={handleDownloadCleanCsv}
            title="Inspect raw clean INCOIS scatterometer JSON"
            className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:text-teal-200 transition-all flex items-center gap-1.5 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>API JSON</span>
          </button>
        </div>
      </div>

      {/* Expandable 7-Day History Table */}
      {showHistory && scatterometer?.recent_7_days && (
        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden mt-3 animate-in fade-in-50 duration-200">
          <div className="p-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 font-mono uppercase tracking-wider">
              Recent 7-Day Scatterometer Telemetry Log
            </span>
            <span className="text-slate-400 font-mono">Cleaned Dataset</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Speed (km/h)</th>
                  <th className="p-2.5">u-Wind (m/s)</th>
                  <th className="p-2.5">v-Wind (m/s)</th>
                  <th className="p-2.5">Bearing</th>
                  <th className="p-2.5">Stress (Pa)</th>
                  <th className="p-2.5">Curl (10⁻⁷ N/m³)</th>
                  <th className="p-2.5">Vorticity State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {scatterometer.recent_7_days.map((day, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-2.5 text-slate-200 font-semibold">{day.date}</td>
                    <td className="p-2.5 text-teal-300">{day.wind_speed_kmh}</td>
                    <td className="p-2.5 text-cyan-300">{day.zonal_wind_speed_ms > 0 ? `+${day.zonal_wind_speed_ms}` : day.zonal_wind_speed_ms}</td>
                    <td className="p-2.5 text-sky-300">{day.meri_wind_speed_ms > 0 ? `+${day.meri_wind_speed_ms}` : day.meri_wind_speed_ms}</td>
                    <td className="p-2.5 text-amber-300">{day.wind_direction_cardinal} ({day.wind_direction_deg}°)</td>
                    <td className="p-2.5 text-purple-300">{day.wind_stress_pa}</td>
                    <td className="p-2.5 text-teal-200 font-bold">{day.wind_stress_curl_scaled > 0 ? `+${day.wind_stress_curl_scaled}` : day.wind_stress_curl_scaled}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        day.vorticity_state === 'HIGH_SURGE_RISK'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : day.vorticity_state === 'MODERATE_CYCLONIC_PUMP'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {day.vorticity_state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

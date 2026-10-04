import React from 'react';
import { CloudRain, Wind, Gauge, Compass, AlertTriangle, ShieldCheck } from 'lucide-react';
import { WeatherObservation } from '../../types/disaster';

interface WeatherCardProps {
  weather: WeatherObservation;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-100">Meteorological Intelligence</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              IMD OFFICIAL FEED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{weather.station_name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-100 font-mono">
            {weather.temperature_c}°C
          </div>
          <div className="text-[11px] text-slate-400">Humidity: {weather.humidity_pct}%</div>
        </div>
      </div>

      {/* Grid of Key Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>Wind Speed</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            {weather.wind_speed_kmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Gusts: {weather.wind_gust_kmh} km/h</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rainfall Rate</span>
          </div>
          <div className="text-base font-bold text-cyan-400 font-mono">
            {weather.rainfall_mm_hr} <span className="text-xs font-normal text-slate-400">mm/hr</span>
          </div>
          <div className="text-[10px] text-slate-400">Heavy Inundation</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Gauge className="w-3.5 h-3.5 text-red-400" />
            <span>Pressure</span>
          </div>
          <div className="text-base font-bold text-red-400 font-mono">
            {weather.pressure_hpa} <span className="text-xs font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[10px] text-red-300 font-semibold font-mono">{weather.trend.replace(/_/g, ' ')}</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wind Vector</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            {weather.wind_direction}
          </div>
          <div className="text-[10px] text-slate-400">Onshore Surge Vector</div>
        </div>
      </div>

      {/* Official IMD Coastal Bulletin Parameters */}
      <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 font-medium">Sea Condition:</span>
          <span className="font-bold text-red-400 bg-red-950/40 px-2.5 py-0.5 rounded-lg border border-red-500/30 font-mono">
            {weather.sea_condition || 'Rough to Very Rough'}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400 font-medium">Port Cautionary Signal:</span>
          <span className="font-bold text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-mono">
            {weather.port_signal || 'Local Cautionary Signal No. III'}
          </span>
        </div>

        {weather.ttt_warning && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 mt-2">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>IMD Squall Warning:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-100/90">{weather.ttt_warning}</p>
          </div>
        )}
      </div>

      {/* Source Lineage */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Source: India Meteorological Department (IMD)</span>
        </div>
        <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>IMD AUTOMATED TELEMETRY ACTIVE (NRT)</span>
        </div>
      </div>
    </div>
  );
};

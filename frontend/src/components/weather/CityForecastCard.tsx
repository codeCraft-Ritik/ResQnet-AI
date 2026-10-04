import React from 'react';
import { Calendar, Sun, CloudRain, AlertCircle } from 'lucide-react';
import { CityForecastResponse } from '../../types/imd';

interface CityForecastCardProps {
  forecast?: CityForecastResponse;
  className?: string;
}

export const CityForecastCard: React.FC<CityForecastCardProps> = ({ forecast, className = '' }) => {
  if (!forecast || !forecast.Forecast_Days || forecast.Forecast_Days.length === 0) {
    return (
      <div className={`glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4 h-full flex flex-col justify-between ${className}`}>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="font-extrabold text-sm text-slate-100">
              IMD 7-Day Regional Projection
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 animate-pulse">SYNCHRONIZING IMD MET RADAR...</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 flex-1 items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse flex flex-col justify-center items-center gap-2">
              <div className="w-12 h-3 bg-white/10 rounded" />
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="w-16 h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5">
          Connecting to National Meteorological Center NWP models...
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4 h-full flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="font-extrabold text-sm text-slate-100">
            IMD 7-Day Regional Projection ({forecast.Station_Name})
          </h3>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Station {forecast.Station_Code} • Lat {forecast.Latitude.toFixed(2)}°, Lng {forecast.Longitude.toFixed(2)}°
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 flex-1">
        {forecast.Forecast_Days.slice(0, 5).map((day, idx) => {
          const isWarning = day.Warning && !day.Warning.includes('NO WARNING');
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col justify-between ${
                isWarning
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-200 shadow-glow-amber'
                  : 'bg-white/[0.03] border-white/10 text-slate-200 hover:border-white/20'
              }`}
            >
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">
                  {day.Date || `Day ${idx + 1}`}
                </div>

                <div className="my-2 flex justify-center">
                  {isWarning ? (
                    <CloudRain className="w-6 h-6 text-amber-400 animate-pulse" />
                  ) : (
                    <Sun className="w-6 h-6 text-cyan-400" />
                  )}
                </div>

                <div className="font-mono text-sm font-bold text-slate-100">
                  {day.Today_Max_temp}° <span className="text-xs font-normal text-slate-400">/ {day.Today_Min_temp}°</span>
                </div>

                <div className="text-[10px] text-slate-300 line-clamp-2 mt-1.5 leading-snug" title={day.Weather_Forecast}>
                  {day.Weather_Forecast}
                </div>
              </div>

              {isWarning ? (
                <div className="mt-2.5 text-[9px] font-bold text-amber-400 flex items-center justify-center gap-1 bg-amber-950/60 py-0.5 px-1.5 rounded-md border border-amber-500/40">
                  <AlertCircle className="w-2.5 h-2.5" />
                  <span>WARNING ACTIVE</span>
                </div>
              ) : (
                <div className="mt-2.5 text-[9px] font-mono text-emerald-400/80 flex items-center justify-center gap-1 py-0.5">
                  <span>NORMAL CYCLE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5 font-mono">
        <span>IMD NWP Atmospheric Ensemble</span>
        <span className="text-cyan-400 font-semibold">Valid 120-Hour Synoptic Outlook</span>
      </div>
    </div>
  );
};

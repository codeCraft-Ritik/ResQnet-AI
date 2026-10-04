import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="p-3.5 glass-panel rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl text-xs space-y-2.5 max-w-xs">
      <div className="font-mono font-bold text-cyan-400 uppercase tracking-wider text-[10px] pb-1.5 border-b border-white/10 flex items-center justify-between">
        <span>Geospatial Legend</span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      </div>

      <div className="space-y-2 text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-lg bg-red-500/40 border border-red-500 shrink-0 shadow-glow-red" />
          <span>Critical Inundation Hazard</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 border border-white shrink-0" />
          <span>Verified Citizen Distress Report</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-lg bg-cyan-600 text-white font-mono font-bold text-[9px] flex items-center justify-center shrink-0 border border-cyan-400">
            S
          </span>
          <span>Designated Emergency Shelter</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 border border-white shrink-0" />
          <span>IMD Coastal Radar Observatory</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-cyan-400 border border-white shrink-0 shadow-glow-cyan" />
          <span>INCOIS Ocean Buoy (Wave/Surge)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-cyan-400 shrink-0" />
          <span>A* Lower-Risk Evacuation Route</span>
        </div>
      </div>
    </div>
  );
};

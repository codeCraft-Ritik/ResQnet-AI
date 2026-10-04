import React from 'react';
import { Waves, Thermometer, ArrowUpRight, ShieldCheck, Compass, Info } from 'lucide-react';
import { OceanObservation } from '../../types/disaster';

interface OceanCardProps {
  ocean?: OceanObservation;
  isCoastal: boolean;
}

export const OceanCard: React.FC<OceanCardProps> = ({ ocean, isCoastal }) => {
  if (!isCoastal || !ocean) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl text-slate-400">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-200">Ocean & Marine Telemetry</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Marine telemetry and deep ocean buoy observations are not applicable to this inland geographical zone.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isWaveCritical = ocean.wave_height_m >= 3.5;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-100">Ocean & Wave Dynamics</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              INCOIS BUOY FEED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Moored Coastal Buoy: {ocean.buoy_id}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {ocean.wave_height_m}m
          </div>
          <div className="text-[11px] text-slate-400">Sig. Wave Height</div>
        </div>
      </div>

      {/* Ocean Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Swell Height</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            {ocean.swell_height_m} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Period: {ocean.wave_period_s}s</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />
            <span>Tide Surge Anomaly</span>
          </div>
          <div className="text-base font-bold text-red-400 font-mono">
            +{ocean.tide_surge_anomaly_m} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
          <div className="text-[10px] text-red-400/90 font-semibold">Tidal High Water Risk</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>Sea Surface Temp</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            {ocean.sea_surface_temp_c}°C
          </div>
          <div className="text-[10px] text-slate-400">Warm Core Anomaly</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Swell Vector</span>
          </div>
          <div className="text-base font-bold text-slate-100 font-mono">
            {ocean.swell_direction}
          </div>
          <div className="text-[10px] text-slate-400">Direct Coast Vector</div>
        </div>
      </div>

      {/* Advisory Status Pill */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isWaveCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
          <span className="text-slate-200">
            {isWaveCritical ? 'INCOIS High Wave Alert: Fishermen Advised Not to Venture into Sea' : 'Wave Parameters Within Normal Operational Threshold'}
          </span>
        </div>
        <span className="font-mono font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
          ORANGE WATCH
        </span>
      </div>

      {/* Source Lineage */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Source: Indian National Centre for Ocean Information Services (INCOIS)</span>
        </div>
        <div className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>INCOIS MOORED BUOY SYNC ACTIVE (NRT)</span>
        </div>
      </div>
    </div>
  );
};

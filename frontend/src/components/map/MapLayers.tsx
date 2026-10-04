import React from 'react';
import { ShieldAlert, Users, Home, Radio, Globe } from 'lucide-react';

export interface MapLayersState {
  hazards: boolean;
  reports: boolean;
  shelters: boolean;
  sensors: boolean;
  satellite?: boolean;
}

interface MapLayersProps {
  layers: MapLayersState;
  onChange: React.Dispatch<React.SetStateAction<any>> | ((layers: any) => void);
}

export const MapLayers: React.FC<MapLayersProps> = ({ layers, onChange }) => {
  const toggle = (key: keyof typeof layers) => {
    onChange({
      ...layers,
      [key]: !layers[key],
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/15 shadow-2xl backdrop-blur-xl">
      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
        Layers:
      </span>

      <button
        onClick={() => toggle('hazards')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          layers.hazards
            ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-glow-red'
            : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
        }`}
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>Hazards</span>
      </button>

      <button
        onClick={() => toggle('reports')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          layers.reports
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>Citizen Reports</span>
      </button>

      <button
        onClick={() => toggle('shelters')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          layers.shelters
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
            : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Shelters</span>
      </button>

      <button
        onClick={() => toggle('sensors')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          layers.sensors
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
            : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
        }`}
      >
        <Radio className="w-3.5 h-3.5" />
        <span>Sensors</span>
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5 hidden sm:block" />

      <button
        onClick={() => toggle('satellite')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          layers.satellite
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
            : 'bg-white/5 text-slate-400 border border-transparent hover:text-slate-200'
        }`}
        title="Toggle between Original Light Map and Real Earth Satellite Imagery"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{layers.satellite ? 'Satellite View' : 'Original Map'}</span>
      </button>
    </div>
  );
};

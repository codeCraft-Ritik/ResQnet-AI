import React, { useState } from 'react';
import { Sliders, Cpu } from 'lucide-react';
import { ScenarioSimulator } from '../components/simulation/ScenarioSimulator';
import { PipelineModal } from '../components/simulation/PipelineModal';

export const SimulationPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8 py-6 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Disaster Scenario & Surge Modeling
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Parametric crisis stress-testing of tropical cyclone surge escalation, hydrodynamic perimeter overwash, and shelter capacity logistics.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 font-bold text-xs tracking-wider uppercase transition-all shadow-glow-purple flex items-center gap-2 self-start sm:self-center"
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Execute Operational Pipeline</span>
        </button>
      </div>

      {/* Simulator Component */}
      <ScenarioSimulator />

      {/* Methodology Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            1. Hydraulic Inundation Forcing
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Models seawater intrusion over low-lying coastal berms by coupling INCOIS astronomical tidal gauges with wind-driven coastal set-up equations.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            2. Topographic Elevation Masking
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Uses OpenStreetMap and high-resolution SRTM/GEBCO coastal digital elevation models to compute perimeter flood spread along roads and residential clusters.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
            3. Dynamic Impact & Action Mapping
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Maps affected population density against hospital and shelter capacity, automatically synthesizing prioritized action directives for authorities.
          </p>
        </div>
      </div>

      <PipelineModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

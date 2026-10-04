import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, TrendingUp, Users, Map, Sparkles } from 'lucide-react';
import { runSimulation } from '../../services/simulationService';
import { SimulationResult } from '../../types/risk';

export const ScenarioSimulator: React.FC = () => {
  const [wavePct, setWavePct] = useState(25);
  const [windKmh, setWindKmh] = useState(15);
  const [rainMm, setRainMm] = useState(20);
  const [seaLevelM, setSeaLevelM] = useState(0.5);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced auto-run on slider change
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await runSimulation({
          delta_wave_height_pct: wavePct,
          delta_wind_speed_kmh: windKmh,
          delta_rainfall_mm_hr: rainMm,
          sea_level_rise_m: seaLevelM,
          duration_hours: 6
        });
        if (isMounted) {
          setResult(res);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Simulation error:', err);
        setLoading(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [wavePct, windKmh, rainMm, seaLevelM]);

  const handleReset = () => {
    setWavePct(0);
    setWindKmh(0);
    setRainMm(0);
    setSeaLevelM(0);
  };

  const applyPreset = (preset: 'cyclone' | 'monsoon' | 'surge' | 'breach') => {
    switch (preset) {
      case 'cyclone':
        setWavePct(60);
        setWindKmh(45);
        setRainMm(40);
        setSeaLevelM(1.2);
        break;
      case 'monsoon':
        setWavePct(15);
        setWindKmh(20);
        setRainMm(65);
        setSeaLevelM(0.3);
        break;
      case 'surge':
        setWavePct(80);
        setWindKmh(35);
        setRainMm(30);
        setSeaLevelM(1.8);
        break;
      case 'breach':
        setWavePct(95);
        setWindKmh(55);
        setRainMm(75);
        setSeaLevelM(2.2);
        break;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-6 text-left">
      {/* Header & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100">Disaster Scenario Simulator</h3>
            <p className="text-xs text-slate-400">
              Parametric stress-testing of coastal flood spread, wave height surge, and cascading impact
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Scenario Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('cyclone')}
            className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all"
          >
            🌀 Severe Tropical Cyclone
          </button>
          <button
            onClick={() => applyPreset('monsoon')}
            className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-300 hover:text-white hover:border-blue-400/40 transition-all"
          >
            🌧️ Torrential Monsoon Cloudburst
          </button>
          <button
            onClick={() => applyPreset('surge')}
            className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-300 hover:text-white hover:border-red-400/40 transition-all"
          >
            🌊 High Tide Storm Surge
          </button>
          <button
            onClick={() => applyPreset('breach')}
            className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-red-300 border-red-500/30 hover:border-red-500/60 bg-red-950/20 transition-all"
          >
            ⚠️ Sea Wall Embankment Breach
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wave Height */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Significant Wave Surge Escalation</span>
            <span className="font-mono text-cyan-400 font-bold">+{wavePct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={wavePct}
            onChange={(e) => setWavePct(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0% Baseline</span>
            <span>+50% (6.6m waves)</span>
            <span>+100% Extreme</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Squall Gale Wind Acceleration</span>
            <span className="font-mono text-sky-400 font-bold">+{windKmh} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={windKmh}
            onChange={(e) => setWindKmh(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 km/h</span>
            <span>+30 km/h Gale</span>
            <span>+60 km/h Super Cyclone</span>
          </div>
        </div>

        {/* Rainfall */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Cloudburst Rainfall Intensity</span>
            <span className="font-mono text-blue-400 font-bold">+{rainMm} mm/hr</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={rainMm}
            onChange={(e) => setRainMm(Number(e.target.value))}
            className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 mm/hr</span>
            <span>+40 mm/hr Inundation</span>
            <span>+80 mm/hr Torrential</span>
          </div>
        </div>

        {/* Sea Level Surge */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Astronomical Tidal High Water Surge</span>
            <span className="font-mono text-red-400 font-bold">+{seaLevelM.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="0"
            max="2.5"
            step="0.1"
            value={seaLevelM}
            onChange={(e) => setSeaLevelM(Number(e.target.value))}
            className="w-full accent-red-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.0 m</span>
            <span>+1.2 m Berm Overwash</span>
            <span>+2.5 m Catastrophic Breach</span>
          </div>
        </div>
      </div>

      {/* Simulated Outcome Display */}
      {result && (
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/15 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-950/70 border border-red-500/50 flex flex-col items-center justify-center font-mono shadow-glow-red shrink-0">
                <span className="text-2xl font-black text-red-400">{result.predicted_risk_score}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">SIMULATED</span>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Projected Severity</div>
                <div className="text-lg font-extrabold text-slate-100">{result.predicted_severity} OVERWASH THREAT</div>
                <div className="text-xs font-bold text-red-400 flex items-center gap-1 font-mono mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{result.delta_risk_pct}% increase from baseline pilot condition</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:text-right text-xs">
              <div>
                <div className="text-slate-400 flex sm:justify-end items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exposed Population:</span>
                </div>
                <div className="font-mono font-bold text-slate-100 text-base mt-0.5">
                  {result.exposed_population_estimate.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-slate-400 flex sm:justify-end items-center gap-1">
                  <Map className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inundation Area:</span>
                </div>
                <div className="font-mono font-bold text-cyan-400 text-base mt-0.5">
                  {result.inundation_area_sqkm} sq km
                </div>
              </div>
            </div>
          </div>

          {/* Affected Impact Zones */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Projected Inundation Perimeter & Impact Zones:
            </div>
            <div className="flex flex-wrap gap-2">
              {result.affected_zones.map((zone) => (
                <span key={zone} className="px-3 py-1 rounded-xl text-xs font-medium bg-red-950/40 border border-red-500/30 text-red-300 font-mono">
                  ⚠️ {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Action Recommendations for Authorities */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Automated Response Directives for Disaster Authorities:
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.recommended_actions_authority.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400 italic">
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};

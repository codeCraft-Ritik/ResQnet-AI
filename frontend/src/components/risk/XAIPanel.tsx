import React from 'react';
import { HelpCircle, BrainCircuit } from 'lucide-react';

interface XAIPanelProps {
  topFeatures?: Record<string, number>;
  explanation?: string;
}

export const XAIPanel: React.FC<XAIPanelProps> = ({
  topFeatures = {
    'Tidal Surge Anomaly (+1.45m)': 0.32,
    'Significant Wave Height (4.4m)': 0.28,
    'Falling Pressure (994.2 hPa)': 0.18,
    'Rainfall Intensity (44.6 mm/hr)': 0.14,
    'Citizen Distress Density': 0.08,
  },
  explanation = 'Current composite coastal risk is CRITICAL primarily driven by abnormal astronomical tidal surge (+1.45m) combined with severe sea waves (4.4m) threatening sea walls and low-lying coastal wards.',
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <h3 className="font-extrabold text-sm text-slate-100">
            Explainable AI (XAI) Feature Attribution
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          SHAP DECOMPOSITION
        </span>
      </div>

      <div className="text-xs text-slate-200 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/10">
        {explanation}
      </div>

      <div className="space-y-3 pt-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Factor Weight Distribution (SHAP Values)</span>
        </div>

        {Object.entries(topFeatures).map(([feature, weight]) => {
          const pct = Math.round(weight * 100);
          return (
            <div key={feature} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{feature}</span>
                <span className="font-mono font-bold text-cyan-400">+{pct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

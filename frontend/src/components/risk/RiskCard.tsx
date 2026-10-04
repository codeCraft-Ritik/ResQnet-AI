import React from 'react';
import { ShieldAlert, TrendingUp, Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { SeverityLevel } from '../../types/disaster';

interface RiskCardProps {
  score: number;
  severity: SeverityLevel | string;
  confidence: number;
  exposedPopulation: number;
  trend?: string;
  isSimulated?: boolean;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  score,
  severity,
  confidence,
  exposedPopulation,
  trend = 'WORSENING_RAPIDLY',
  isSimulated = true,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-red-400 border-red-500/40 bg-red-950/40 shadow-glow-red';
    if (val >= 60) return 'text-orange-400 border-orange-500/40 bg-orange-950/40';
    if (val >= 40) return 'text-amber-400 border-amber-500/40 bg-amber-950/40 shadow-glow-amber';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  };

  const getBarColor = (val: number) => {
    if (val >= 80) return 'from-red-600 via-orange-500 to-red-400';
    if (val >= 60) return 'from-orange-600 to-amber-400';
    if (val >= 40) return 'from-amber-600 to-yellow-400';
    return 'from-emerald-600 to-teal-400';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Accent Light */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-100">
              Composite Risk Index
            </h3>
            <div className="text-[10px] text-slate-400 font-mono">Real-Time Inundation Probability</div>
          </div>
        </div>
        <Badge severity={severity as SeverityLevel}>{severity} ALERT</Badge>
      </div>

      {/* Main Score Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 my-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center font-mono shadow-xl shrink-0 ${getScoreColor(
              score
            )}`}
          >
            <span className="text-3xl font-black">{score}%</span>
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400">INDEX</span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Predicted Risk Severity
            </div>
            <div className="text-xl font-extrabold text-slate-100 tracking-tight">
              {severity} Coastal Threat
            </div>
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trend: {trend.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        {/* Confidence & Population Exposed */}
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:border-l sm:border-white/10 sm:pl-6 text-xs">
          <div>
            <div className="flex items-center gap-1 text-slate-400 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">AI Model Confidence:</span>
            </div>
            <div className="text-base font-bold text-slate-100 font-mono">
              {confidence}% <span className="text-[11px] font-normal text-slate-400">(Bayesian)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-slate-400 mb-0.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Exposed Population:</span>
            </div>
            <div className="text-base font-bold text-amber-400 font-mono">
              {exposedPopulation.toLocaleString()} <span className="text-[11px] font-normal text-slate-400">citizens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Risk Gradient Spectrum</span>
          <span className="font-mono text-slate-300 font-semibold">{score} / 100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarColor(score)} transition-all duration-700`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
          <span>0 (Low)</span>
          <span>40 (Moderate)</span>
          <span>70 (High)</span>
          <span>100 (Critical)</span>
        </div>
      </div>

      {/* Responsible AI Notice */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
        <span className="italic flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>AI risk estimation — official government directives take precedence</span>
        </span>
        <span className="font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE OPERATIONAL FEED</span>
        </span>
      </div>
    </div>
  );
};

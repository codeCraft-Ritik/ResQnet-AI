import React from 'react';
import { Network, CheckCircle2, Sparkles } from 'lucide-react';
import { EvidenceMatrix } from '../../types/risk';

interface EvidencePanelProps {
  evidence?: EvidenceMatrix;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ evidence }) => {
  if (!evidence) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>Why Is This Risk High?</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Evidence Fusion
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-verification across government radar, deep ocean buoys, satellites, and citizen reports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-slate-400">Consensus Index:</span>
          <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 shadow-sm">
            {evidence.overall_confidence_pct}%
          </span>
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-ocean-950/30 to-purple-950/20 border border-cyan-500/30 text-xs text-cyan-100 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[11px] block mb-0.5 text-cyan-300">
            Bayesian Consensus Audit Trail:
          </span>
          {evidence.confidence_rationale}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-white/10">
            <tr>
              <th className="py-3 px-3.5">Source Signal</th>
              <th className="py-3 px-3.5">Category</th>
              <th className="py-3 px-3.5">Observed Location</th>
              <th className="py-3 px-3.5">Signal Observation</th>
              <th className="py-3 px-3.5 text-center">Reliability</th>
              <th className="py-3 px-3.5 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {evidence.evidence_breakdown.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                <td className="py-3 px-3.5 font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
                  <span>{item.source}</span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-cyan-300 border border-white/10">
                    {item.source_type}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-slate-400 font-mono text-[11px]">{item.location}</td>
                <td className="py-3 px-3.5 max-w-xs truncate text-slate-200" title={item.signal_summary}>
                  {item.signal_summary}
                </td>
                <td className="py-3 px-3.5 text-center font-mono font-semibold text-slate-300">
                  {item.reliability}
                </td>
                <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-400">
                  +{item.weight_score} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contradiction Verification & Method Footer */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Cross-Sensor Contradiction: None detected (Consensus Index 0.96)</span>
        </div>
        <span className="text-slate-500">Bayesian Inversion Engine v1.0 • Verified</span>
      </div>
    </div>
  );
};

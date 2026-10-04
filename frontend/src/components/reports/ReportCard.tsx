import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import { CitizenReport } from '../../types/disaster';

interface ReportCardProps {
  report: CitizenReport;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const isVerified = report.status === 'VERIFIED';

  return (
    <div className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 shadow-lg space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isVerified ? 'bg-emerald-400 animate-pulse shadow-sm' : 'bg-amber-400'
            }`}
          />
          <h4 className="font-extrabold text-sm text-slate-100">
            {report.hazard_type.replace(/_/g, ' ')}
          </h4>
        </div>
        <span
          className={`text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full border ${
            isVerified
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
          }`}
        >
          {report.status} ({Math.round(report.confidence * 100)}%)
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        {report.description}
      </p>

      {report.ai_vision_tags && report.ai_vision_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {report.ai_vision_tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-slate-400">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Users className="w-3 h-3 text-amber-400" />
            {report.people_affected} affected
          </span>
        </div>
        <span className="flex items-center gap-1 text-slate-500 font-mono">
          <Clock className="w-3 h-3" />
          {report.timestamp}
        </span>
      </div>
    </div>
  );
};

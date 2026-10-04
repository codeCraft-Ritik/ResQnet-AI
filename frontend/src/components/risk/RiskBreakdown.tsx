import React from 'react';
import { Waves, CloudRain, Wind, AlertTriangle, ShieldCheck } from 'lucide-react';

export const RiskBreakdown: React.FC = () => {
  const categories = [
    {
      name: 'Coastal Flooding & Surge',
      score: 92,
      severity: 'CRITICAL',
      icon: <Waves className="w-4 h-4 text-red-400" />,
      color: 'bg-gradient-to-r from-red-600 to-red-400',
      trend: '+14% / 3hr'
    },
    {
      name: 'Severe Wave Overwash',
      score: 88,
      severity: 'CRITICAL',
      icon: <Waves className="w-4 h-4 text-orange-400" />,
      color: 'bg-gradient-to-r from-orange-600 to-amber-400',
      trend: '+10% / 3hr'
    },
    {
      name: 'Embankment & Berm Breach',
      score: 82,
      severity: 'CRITICAL',
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      color: 'bg-gradient-to-r from-red-600 to-rose-400',
      trend: 'Active Breach'
    },
    {
      name: 'Heavy Rainfall Waterlogging',
      score: 74,
      severity: 'HIGH',
      icon: <CloudRain className="w-4 h-4 text-blue-400" />,
      color: 'bg-gradient-to-r from-blue-600 to-cyan-400',
      trend: '+8% / 3hr'
    },
    {
      name: 'Squally Wind & Gust Damage',
      score: 65,
      severity: 'HIGH',
      icon: <Wind className="w-4 h-4 text-sky-400" />,
      color: 'bg-gradient-to-r from-sky-600 to-teal-400',
      trend: 'Stable Gale'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h3 className="font-extrabold text-sm text-slate-100">Disaster Vector Stratification</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
          MULTI-HAZARD COUPLING
        </span>
      </div>

      <div className="space-y-3.5">
        {categories.map((c) => (
          <div key={c.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                {c.icon}
                <span>{c.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[10px] text-slate-400">{c.trend}</span>
                <span className="font-bold text-slate-100">{c.score}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full ${c.color} transition-all duration-500`}
                style={{ width: `${c.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

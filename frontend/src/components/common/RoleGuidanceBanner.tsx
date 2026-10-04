import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, Radio, Compass, AlertTriangle } from 'lucide-react';
import { getRoleAction, RoleAction } from '../../services/riskService';

interface RoleGuidanceBannerProps {
  role: string;
}

export const RoleGuidanceBanner: React.FC<RoleGuidanceBannerProps> = ({ role }) => {
  const [guidance, setGuidance] = useState<RoleAction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getRoleAction(role).then(data => {
      if (isMounted) {
        setGuidance(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [role]);

  const roleIcons = {
    CITIZEN: <Users className="w-4 h-4 text-emerald-400" />,
    RESPONDER: <Compass className="w-4 h-4 text-amber-400" />,
    AUTHORITY: <ShieldAlert className="w-4 h-4 text-red-400" />,
    ANALYST: <Radio className="w-4 h-4 text-cyan-400" />,
  };

  if (loading || !guidance) return null;

  const isUrgent = guidance.urgency === 'CRITICAL' || guidance.urgency === 'HIGH';

  return (
    <div
      className={`px-4 sm:px-5 py-3 rounded-[22px] glass-panel border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs sm:text-sm transition-all duration-300 shadow-xl backdrop-blur-2xl ${
        isUrgent
          ? 'border-red-500/50 text-red-200 shadow-glow-red bg-red-950/25'
          : 'border-cyan-400/25 text-slate-100 bg-[#061224]/80'
      }`}
    >
      <div className="flex items-start md:items-center gap-3">
        <div className="p-2 rounded-2xl bg-white/[0.08] border border-white/15 shrink-0 mt-0.5 md:mt-0 shadow-sm">
          {roleIcons[role as keyof typeof roleIcons] || <AlertTriangle className="w-4 h-4 text-amber-400" />}
        </div>
        <div>
          <span className="font-mono font-bold tracking-wider uppercase text-xs mr-2 text-cyan-300">
            [{guidance.role} DIRECTIVE — {guidance.urgency}]:
          </span>
          <span className="font-medium text-slate-100">{guidance.instruction}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-mono shrink-0 self-end md:self-auto">
        <span className="text-slate-400">Response Mode:</span>
        <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/35 font-bold text-cyan-200 shadow-sm">
          {role}
        </span>
      </div>
    </div>
  );
};

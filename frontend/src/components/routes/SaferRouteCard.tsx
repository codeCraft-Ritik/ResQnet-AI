import React, { useState } from 'react';
import { Navigation, ShieldCheck, Clock, AlertTriangle, MessageSquare, Send, Copy, Check } from 'lucide-react';
import { calculateSaferRoute } from '../../services/routeService';
import { SaferRouteResult } from '../../types/route';

interface SaferRouteCardProps {
  onRouteCalculated?: (route: SaferRouteResult) => void;
  startLat?: number;
  startLng?: number;
  role?: string;
}

export const SaferRouteCard: React.FC<SaferRouteCardProps> = ({
  onRouteCalculated,
  startLat = 19.8055,
  startLng = 85.8210,
  role = 'CITIZEN',
}) => {
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<SaferRouteResult | null>(null);
  const [copied, setCopied] = useState(false);

  const getDispatchMessage = () => {
    if (!route) return '';
    return `🚨 RESQNET AI EVACUATION ALERT 🚨\nTarget Shelter: ${route.target_shelter_name}\nSafety Score: ${route.overall_route_safety_score}/100\nEst. Time: ${route.estimated_travel_time_mins} mins (${route.total_distance_km} km)\nKey Directions:\n${route.step_instructions.slice(0, 2).map((s, i) => `${i + 1}. ${s}`).join('\n')}\nAvoided Breaches: ${route.hazards_avoided.join(', ')}\nHelplines: NDRF (1078), Coast Guard (1554), Ambulance (108/112)`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getDispatchMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareSMS = () => {
    const text = encodeURIComponent(getDispatchMessage());
    window.location.href = `sms:?body=${text}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getDispatchMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCalculateRoute = async () => {
    setLoading(true);
    try {
      const res = await calculateSaferRoute({
        start_lat: startLat,
        start_lng: startLng,
        role,
      });
      setRoute(res);
      if (onRouteCalculated) onRouteCalculated(res);
    } catch (err) {
      console.warn('Route calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">
              Hazard-Avoidance Evacuation Routing
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Dynamic A* Pathfinder Engine</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          A* ALGORITHM
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Computes a lower-risk evacuation corridor from your current coordinates to the nearest operational disaster shelter, dynamically circumventing breached coastal berms and submerged roadways.
      </p>

      <button
        onClick={handleCalculateRoute}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-ocean-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-glow-cyan disabled:opacity-50"
      >
        <Navigation className="w-4 h-4" />
        <span>{loading ? 'Computing Lower-Risk Path...' : 'Find Lower-Risk Route to Shelter'}</span>
      </button>

      {route && (
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 animate-in fade-in">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider font-mono">
                Assigned Emergency Destination
              </div>
              <div className="font-bold text-sm text-slate-100 mt-0.5">
                {route.target_shelter_name}
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                Safety {route.overall_route_safety_score}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-white/10">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Est. Time: <strong className="font-mono text-white">{route.estimated_travel_time_mins} mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distance: <strong className="font-mono text-white">{route.total_distance_km} km</strong></span>
            </div>
          </div>

          {/* Circumvented Hazards */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span>Circumvented Inundation Zones:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {route.hazards_avoided.map((h, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/40 text-red-300 border border-red-500/30 font-mono">
                  ✕ {h}
                </span>
              ))}
            </div>
          </div>

          {/* Turn by turn steps */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Step-by-Step Evacuation Directives:
            </div>
            <ol className="space-y-1 text-xs text-slate-300">
              {route.step_instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Zero-Cost Offline/Field Dispatch Gateway */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Send className="w-3.5 h-3.5" />
                <span>Zero-Cost Emergency Dispatch Gateway</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                100% FREE RELAY
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm"
                title="Send Evacuation Path to Family or Responders via WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareSMS}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm"
                title="Dispatch Direct Evacuation SMS via Device Cellular Radio (Zero Data / Free)"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>SMS Dispatch</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-xs font-semibold transition-all"
                title="Copy Full Evacuation Advisory to Clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied!' : 'Copy Route'}</span>
              </button>
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 italic">
            {route.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};

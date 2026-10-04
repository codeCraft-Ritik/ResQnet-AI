import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Waves,
  Calendar,
  Radio,
  Users,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { getAlerts } from '../services/alertService';
import { AlertsFeed, CityForecastDay, OfficialWarning, AIRiskAlert, CrowdsourcedAlert } from '../types/imd';
import { Skeleton } from '../components/common/Skeleton';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertsFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlerts().then((data: AlertsFeed) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  if (loading || !alerts) {
    return (
      <div className="space-y-6 py-6 max-w-[1600px] w-full mx-auto px-4 sm:px-6">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const b = alerts.imd_coastal_bulletin;
  const c = alerts.imd_city_forecast;

  return (
    <div className="space-y-8 py-6 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Priority Operational Guarantee Banner */}
      <div className="p-5 rounded-3xl glass-panel border border-amber-500/40 text-xs text-amber-200 flex items-start sm:items-center gap-3.5 shadow-glow-amber">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="leading-relaxed">
          <strong className="uppercase tracking-wider mr-1 text-amber-300 font-mono">
            Operational Lineage Guarantee:
          </strong>
          {alerts.guidance_banner}
        </div>
      </div>

      {/* Official Government Telemetry (Coastal Bulletin + City Forecast) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coastal Bulletin */}
        {b && (
          <div className="glass-panel border-l-4 border-l-cyan-400 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-base text-slate-100">IMD Official Coastal Bulletin</h3>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
                GOVERNMENT SEAL
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-bold text-cyan-300">{b.Layer}</span>
              <span className="text-slate-400">Issued by: {b['Issued by']}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Sea Condition:</span>
                <strong className="text-red-400 font-mono font-bold">{b['Sea Condition']}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Port Cautionary Signal:</span>
                <strong className="text-amber-400 font-mono font-bold">{b['Port Signal']}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Wind Velocity:</span>
                <strong className="text-slate-200 font-mono">{b.Wind}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Visibility:</span>
                <strong className="text-slate-200 font-mono">{b.Visibility}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
              <strong>Squall Warning:</strong> {b['TTT Warning'] || 'None active'}
            </div>

            <div className="text-[11px] text-slate-400 flex justify-between font-mono pt-1">
              <span>Obs: {b['Date of Observation']} | Valid: {b['Valid From']}</span>
              <span>Validity: {b.Validity} hrs</span>
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {c && (
          <div className="glass-panel border-l-4 border-l-purple-400 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-base text-slate-100">
                  IMD 7-Day City Forecast ({c.Station_Name})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {c.Latitude.toFixed(2)}°N, {c.Longitude.toFixed(2)}°E
              </span>
            </div>

            {c.Forecast_Days?.[0] && (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-200">Today's Temperature:</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {c.Forecast_Days[0].Today_Max_temp}°C / {c.Forecast_Days[0].Today_Min_temp}°C
                  </span>
                </div>
                <div className="text-amber-400 font-semibold">{c.Forecast_Days[0].Warning}</div>
                <div className="text-slate-300 text-[11px]">{c.Forecast_Days[0].Weather_Forecast}</div>
              </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
              {c.Forecast_Days?.slice(1, 6).map((day: CityForecastDay, idx: number) => (
                <div key={idx} className="flex-1 min-w-[75px] p-2 rounded-xl bg-white/[0.03] border border-white/10 text-center text-[11px]">
                  <div className="text-slate-400 text-[10px]">{day.Date || `Day ${idx + 2}`}</div>
                  <div className="font-bold text-slate-100 font-mono mt-0.5">{day.Today_Max_temp}°</div>
                  <div className="text-slate-500 font-mono text-[10px]">{day.Today_Min_temp}°</div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 flex justify-between font-mono pt-1">
              <span>Station ID: {c.Station_Code} ({c.State})</span>
              <span className="text-cyan-400">Synchronized Government Telemetry</span>
            </div>
          </div>
        )}
      </div>

      {/* 3-Tier Alert Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier 1: Official Government Warnings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-amber-300">
              1. Official Government Warnings
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.official_warnings.map((w: OfficialWarning) => (
              <div key={w.id} className="p-5 rounded-2xl glass-panel border-l-4 border-l-amber-500 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-amber-300">{w.source}</strong>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40">
                    {w.severity_level} WARNING
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 leading-snug">{w.headline}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{w.description}</p>
                <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex justify-between font-mono">
                  <span>Valid: {w.valid_until}</span>
                  <span>Area: {w.affected_area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: AI Predictive Risk Alerts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Radio className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-cyan-300">
              2. AI Predictive Risk Alerts
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.ai_risk_alerts.map((a: AIRiskAlert) => (
              <div key={a.id} className="p-5 rounded-2xl glass-panel border-l-4 border-l-cyan-500 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-cyan-300">{a.title}</strong>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40">
                    {a.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{a.summary}</p>
                <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 italic">
                  {a.disclaimer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Corroborated Citizen Events */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-emerald-300">
              3. Corroborated Citizen Events
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.crowdsourced_corroborated_events.map((c: CrowdsourcedAlert) => (
              <div key={c.id} className="p-5 rounded-2xl glass-panel border-l-4 border-l-emerald-500 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-emerald-300">{c.title}</strong>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    {c.status} ({c.confidence}%)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.summary}</p>
                <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex justify-between font-mono">
                  <span>Location: {c.location}</span>
                  <span>{c.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

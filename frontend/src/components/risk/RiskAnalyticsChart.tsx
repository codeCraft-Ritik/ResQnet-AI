import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Activity, CloudRain, Waves, Users } from 'lucide-react';

interface MetricPoint {
  time: string;
  risk: number;
  rainfall: number;
  wave: number;
  reports: number;
}

const stationTelemetryTrend: MetricPoint[] = [
  { time: '00:00', risk: 38, rainfall: 8.2, wave: 1.8, reports: 1 },
  { time: '03:00', risk: 44, rainfall: 12.4, wave: 2.1, reports: 3 },
  { time: '06:00', risk: 58, rainfall: 22.0, wave: 2.7, reports: 6 },
  { time: '09:00', risk: 69, rainfall: 31.5, wave: 3.4, reports: 11 },
  { time: '12:00', risk: 79, rainfall: 42.1, wave: 3.9, reports: 19 },
  { time: '15:00', risk: 87, rainfall: 44.6, wave: 4.4, reports: 24 },
  { time: '18:00 (NRT)', risk: 85, rainfall: 41.2, wave: 4.2, reports: 22 },
  { time: '21:00 (Proj)', risk: 82, rainfall: 36.0, wave: 4.0, reports: 16 },
];

interface RiskAnalyticsChartProps {
  className?: string;
}

export const RiskAnalyticsChart: React.FC<RiskAnalyticsChartProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'rainfall' | 'wave' | 'reports'>('risk');

  const tabs = [
    { id: 'risk', label: 'Composite Risk', icon: <Activity className="w-3.5 h-3.5" />, color: '#ef4444', unit: '%' },
    { id: 'rainfall', label: 'Rainfall Intensity', icon: <CloudRain className="w-3.5 h-3.5" />, color: '#38bdf8', unit: 'mm/hr' },
    { id: 'wave', label: 'Wave Surge', icon: <Waves className="w-3.5 h-3.5" />, color: '#06b6d4', unit: 'm' },
    { id: 'reports', label: 'Citizen Reports', icon: <Users className="w-3.5 h-3.5" />, color: '#a855f7', unit: 'incidents' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <div className={`glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-4 h-full flex flex-col justify-between ${className}`}>
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm sm:text-base text-slate-100">
              24-Hour Telemetry & Risk Velocity Analytics
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-sensor trend correlation over Bay of Bengal coastal station
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stationTelemetryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentTab.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentTab.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-white/20 shadow-2xl text-xs font-mono">
                      <div className="text-slate-400 font-bold mb-1">{label}</div>
                      <div className="flex items-center gap-2" style={{ color: currentTab.color }}>
                        <span className="font-black text-sm">{payload[0].value}</span>
                        <span>{currentTab.unit}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={activeTab}
              stroke={currentTab.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend / Metadata Footer */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5 font-mono">
        <span>● Solid: Validated Sensor Observation</span>
        <span>Peak Rate: 15:00 hrs IST</span>
        <span className="text-cyan-400">IMD Radar + INCOIS Buoy Synchronized</span>
      </div>
    </div>
  );
};

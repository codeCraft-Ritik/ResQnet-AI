import React, { useEffect, useState } from 'react';
import { Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { CitizenReportForm } from '../components/reports/CitizenReportForm';
import { ReportCard } from '../components/reports/ReportCard';
import { getReports } from '../services/reportService';
import { CitizenReport } from '../types/disaster';
import { Skeleton } from '../components/common/Skeleton';

export const CitizenReportingPage: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.warn('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-8 py-6 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Crowdsourced Ocean & Coastal Distress Reporting
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Empowering coastal citizens and volunteers to report flooding, sea breaches, and life threats with real-time AI computer vision and multilingual NLP verification.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Verification Guide (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CitizenReportForm onReportSubmitted={loadReports} />

          <div className="p-5 rounded-2xl glass-panel border border-white/10 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>How Ground-Truth AI Verification Works</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              When you submit a report, our <strong>Multilingual NLP parser</strong> extracts urgency and life-threat signals in English, Hindi, or Hinglish. Then, our <strong>Computer Vision pipeline</strong> verifies water intrusion and damage from uploaded photos before corroborating with nearby IMD radar echoes and INCOIS buoy telemetry.
            </p>
          </div>
        </div>

        {/* Right Column: Live Corroborated Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>Verified Incident Feed</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {reports.length} reports
              </span>
            </h3>
            <button
              onClick={loadReports}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-3.5">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

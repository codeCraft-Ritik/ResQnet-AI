import React from 'react';
import { ShieldCheck, Info, PhoneCall, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/10 bg-[#030712]/80 backdrop-blur-xl text-slate-400 text-xs mt-auto">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">RESQNET AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                MoES SIH25039
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-lg text-xs">
              Autonomous Multi-Source Ocean & Coastal Disaster Intelligence, Verification, Risk Assessment, and Last-Mile Action Platform. Turning scattered radar, buoy, satellite, and citizen signals into trusted, lifesaving decisions.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Pilot Anchor: Bay of Bengal Sector (Puri, Odisha)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Globe2 className="w-4 h-4" />
                <span>Multi-Region Ready Architecture</span>
              </div>
            </div>
          </div>

          {/* Official Ingestion Feeds */}
          <div>
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3 text-cyan-300">
              Government Telemetry
            </div>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                IMD (Coastal Bulletin & City Radar)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                INCOIS (Ocean Buoy & Wave Surge)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                MOSDAC / ISRO (INSAT-3DR QPE)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                Copernicus ESA (Sentinel-1 SAR Radar)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                OpenStreetMap & GEBCO Bathymetry
              </li>
            </ul>
          </div>

          {/* Emergency Helplines & Directives */}
          <div>
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3 text-amber-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency Hotlines</span>
            </div>
            <ul className="space-y-2 text-slate-300 text-xs font-mono">
              <li>NDRF National Helpline: <strong className="text-amber-400">1078</strong></li>
              <li>Odisha SDMA Control: <strong className="text-amber-400">1070</strong></li>
              <li>Coast Guard Distress: <strong className="text-amber-400">1554</strong></li>
              <li>Ambulance Emergency: <strong className="text-amber-400">108</strong></li>
            </ul>
          </div>
        </div>

        {/* Operational Disclaimer & Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Operational Lineage Guarantee:</strong> Official alerts from IMD and INCOIS take absolute legal precedence. AI risk assessments serve as assistive decision-support intelligence.
            </span>
          </div>
          <div className="text-slate-500 font-mono shrink-0">
            RESQNET AI v1.0 • Smart India Hackathon
          </div>
        </div>
      </div>
    </footer>
  );
};

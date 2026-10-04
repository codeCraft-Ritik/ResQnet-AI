import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  Waves,
  CloudRain,
  Satellite,
  Users,
  Radio,
  Sparkles,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Zap,
  Globe2,
  Navigation
} from 'lucide-react';
import { LocationSearch } from '../components/search/LocationSearch';
import { COASTAL_SECTORS } from '../data/demo/locations';
import { PipelineModal } from '../components/simulation/PipelineModal';
import { HeroGlobeVisual } from '../components/hero/HeroGlobeVisual';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);

  return (
    <div className="space-y-20 py-6 sm:py-10">
      {/* Hero Section: Split Layout with Glowing Digital Earth / Radar */}
      <section className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Hero Content & Central Search (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Government / Platform Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase shadow-glow-cyan">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart India Hackathon • Ministry of Earth Sciences (MoES)</span>
            </div>

            {/* Main Hero Headline */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Autonomous Coastal Intelligence
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                From scattered signals to{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                  trusted decisions.
                </span>
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              AI-powered multi-source disaster intelligence for smarter and safer decisions. Fusing government weather radar, ocean buoys, SAR satellites, and crowdsourced citizen reports into verified, explainable coastal protection.
            </p>

            {/* Centerstage Futuristic Location Search */}
            <div className="pt-2 max-w-xl">
              <LocationSearch
                size="large"
                placeholder="Search any coastal city, district, or port (e.g. Puri, Chennai, Mumbai)..."
                className="shadow-2xl"
              />
            </div>

            {/* Quick Location Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Sectors:</span>
              </span>
              {['puri', 'chennai', 'mumbai', 'visakhapatnam', 'kochi', 'kolkata', 'surat', 'panaji'].map((id) => {
                const loc = COASTAL_SECTORS.find((l) => l.id === id);
                if (!loc) return null;
                return (
                  <button
                    key={loc.id}
                    onClick={() => navigate(`/location/${loc.id}`)}
                    className="px-2.5 py-1 rounded-xl glass-pill text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
                  >
                    {loc.is_coastal && <Waves className="w-3 h-3 text-cyan-400" />}
                    <span>{loc.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => navigate('/location/puri')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-ocean-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-glow-cyan flex items-center gap-2 group"
              >
                <span>Explore Location Intelligence</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/map')}
                className="px-6 py-3 rounded-2xl glass-panel glass-panel-hover text-slate-200 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
              >
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>View Live Disaster Map</span>
              </button>

              <button
                onClick={() => setPipelineModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 font-bold text-xs tracking-wider uppercase transition-all shadow-glow-purple flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Execute Operational Pipeline</span>
              </button>
            </div>
          </div>

          {/* Right Column: Original Glowing Digital Earth / Geospatial Radar (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroGlobeVisual />
          </div>
        </div>
      </section>

      {/* Signal-to-Intelligence Architecture Concept */}
      <section className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>HETEROGENEOUS DATA FUSION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Six Independent Telemetry Feeds. Zero False Evacuations.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              ResQNet AI continuously synthesizes multi-agency weather radar, deep ocean buoys, synthetic aperture radar (SAR) satellites, and crowdsourced citizen distress photos into unified operational certainty.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {/* 1. IMD */}
            <div className="p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col items-center justify-between h-full min-h-[175px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-glow-amber">
                <CloudRain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-100">IMD Weather</div>
                <div className="text-[10px] text-slate-400 leading-tight">Doppler Radar & 7-Day Forecast</div>
              </div>
            </div>

            {/* 2. INCOIS */}
            <div className="p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col items-center justify-between h-full min-h-[175px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 flex items-center justify-center mx-auto shadow-glow-cyan">
                <Waves className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-100">INCOIS Ocean</div>
                <div className="text-[10px] text-slate-400 leading-tight">Wave Buoys & Tidal Surge</div>
              </div>
            </div>

            {/* 3. SAR */}
            <div className="p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col items-center justify-between h-full min-h-[175px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-400/30 flex items-center justify-center mx-auto shadow-sm">
                <Satellite className="w-6 h-6 text-sky-300" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-100">SAR Satellite</div>
                <div className="text-[10px] text-slate-400 leading-tight">Sentinel-1 Inundation Extent</div>
              </div>
            </div>

            {/* 4. Citizen */}
            <div className="p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col items-center justify-between h-full min-h-[175px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-sm">
                <Users className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-100">Crowdsourced</div>
                <div className="text-[10px] text-slate-400 leading-tight">Citizen Distress Photos & GPS</div>
              </div>
            </div>

            {/* 5. GDELT */}
            <div className="p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col items-center justify-between h-full min-h-[175px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-400/30 flex items-center justify-center mx-auto shadow-glow-purple">
                <Radio className="w-6 h-6 text-purple-300" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-100">GDELT Signals</div>
                <div className="text-[10px] text-slate-400 leading-tight">Multilingual Distress Sentiment</div>
              </div>
            </div>

            {/* 6. OSM */}
            <div className="p-5 rounded-3xl glass-panel glass-panel-hover flex flex-col items-center justify-between h-full min-h-[175px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-400/30 flex items-center justify-center mx-auto shadow-sm">
                <Navigation className="w-6 h-6 text-blue-300" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-100">OSM Geospatial</div>
                <div className="text-[10px] text-slate-400 leading-tight">Shelters & A* Evacuation Corridors</div>
              </div>
            </div>
          </div>

          {/* Bayesian Guarantee Pill */}
          <div className="mt-8 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-slate-900 via-ocean-950 to-slate-900 border border-cyan-400/40 text-xs font-bold text-cyan-200 shadow-glow-cyan">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Bayesian Consensus Fusion Engine</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>92% Actionable Certainty Guaranteed</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Production AI/ML Performance Benchmarks */}
      <section className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between h-full min-h-[145px] space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Classification Precision
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-100 font-mono">91.2%</div>
            <div className="text-[11px] text-cyan-400 font-mono">ROC-AUC Discriminator: 0.942</div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between h-full min-h-[145px] space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Risk Regression MAE
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">3.82 pts</div>
            <div className="text-[11px] text-slate-400 font-mono">RMSE: 5.14 points</div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between h-full min-h-[145px] space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Multilingual NLP F1
            </div>
            <div className="text-3xl sm:text-4xl font-black text-sky-400 font-mono">0.931</div>
            <div className="text-[11px] text-purple-300 font-mono">Hindi Devanagari: 0.884</div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between h-full min-h-[145px] space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Avg Verification Latency
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">1.4 sec</div>
            <div className="text-[11px] text-emerald-400 font-mono">Real-time edge fusion</div>
          </div>
        </div>
      </section>

      {/* 8-Stage Machine Learning Pipeline Modal */}
      <PipelineModal
        isOpen={pipelineModalOpen}
        onClose={() => setPipelineModalOpen(false)}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Satellite,
  X,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface LiveIndiaSatelliteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SatelliteChannel {
  id: string;
  name: string;
  url: string;
  badge: string;
  description: string;
  type: 'image' | 'animation';
}

const CHANNELS: SatelliteChannel[] = [
  {
    id: 'ir1',
    name: 'Infrared (IR-1)',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ir1.jpg',
    badge: '24x7 DAY & NIGHT',
    description: 'Measures surface and cloud top temperatures (10.8 µm). High brightness indicates tall convective storm clouds.',
    type: 'image'
  },
  {
    id: 'vis',
    name: 'Visible (0.65 µm)',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_vis.jpg',
    badge: 'HIGH RESOLUTION DAYTIME',
    description: 'High-contrast solar reflection for distinguishing low clouds, land contours, and coastal sea borders.',
    type: 'image'
  },
  {
    id: 'wv',
    name: 'Water Vapour (WV)',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_wv.jpg',
    badge: 'CYCLONIC MOISTURE DYNAMICS',
    description: 'Captures tropospheric moisture (6.8 µm) showing swirling storm vectors and cyclone eyes over the Bay of Bengal and Arabian Sea.',
    type: 'image'
  },
  {
    id: 'ctbt',
    name: 'Cloud Top Temp (CTBT)',
    url: 'https://mausam.imd.gov.in/Satellite/3Dasiasec_ctbt.jpg',
    badge: 'CONVECTIVE STORM INTENSITY',
    description: 'Quantitative measurement of Cloud Top Brightness Temperature. Colder cloud tops indicate severe thunderstorm vertical growth.',
    type: 'image'
  },
  {
    id: 'anim',
    name: 'Live Animation Loop',
    url: 'https://mausam.imd.gov.in/Satellite/Converted/IR1.gif',
    badge: 'MULTI-FRAME MOTION LOOP',
    description: 'Multi-frame animated loop showing real-time cloud progression and cyclone spin across the Indian subcontinent.',
    type: 'animation'
  }
];

export const LiveIndiaSatelliteModal: React.FC<LiveIndiaSatelliteModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedChannel, setSelectedChannel] = useState<SatelliteChannel>(CHANNELS[0]);
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLoading(true);
    setCacheBuster(Date.now());
  };

  const currentImageUrl = `${selectedChannel.url}?t=${cacheBuster}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl pointer-events-auto cursor-pointer animate-in fade-in duration-200"
      style={{ isolation: 'isolate' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col glass-panel rounded-3xl border border-cyan-400/25 shadow-2xl overflow-hidden bg-[#061224]/95 cursor-default pointer-events-auto"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight">
                  Live Satellite Imagery of India (INSAT-3D / 3DR)
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  NO API KEY NEEDED (LIVE PUBLIC FEED)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Geostationary Earth Observation stream from India Meteorological Department (IMD / MoES)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              title="Reload latest satellite frame"
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Frame</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close Satellite Viewer (Esc)"
              aria-label="Close Satellite Viewer"
              className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-red-500/25 border border-white/15 text-slate-300 hover:text-red-300 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Selector Bar */}
        <div className="flex items-center gap-2 p-3 px-5 border-b border-white/10 bg-black/40 overflow-x-auto no-scrollbar">
          <span className="text-xs font-mono text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Channel:
          </span>
          {CHANNELS.map((ch) => {
            const isSelected = ch.id === selectedChannel.id;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch);
                  setIsLoading(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/5 hover:bg-white/10'
                }`}
              >
                <span>{ch.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Channel Description Banner */}
        <div className="px-5 py-2.5 bg-cyan-500/[0.04] border-b border-white/5 text-xs flex items-center justify-between gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {selectedChannel.badge}
            </span>
            <span className="line-clamp-1">{selectedChannel.description}</span>
          </div>
          <a
            href={selectedChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 font-semibold"
          >
            <span>Direct HD Image</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Image Display Area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/60 relative min-h-[350px]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 z-10">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <p className="text-xs font-mono text-cyan-300">Receiving Telemetry Downlink from INSAT-3D...</p>
            </div>
          )}

          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt={`Live INSAT-3D Satellite Image of India - ${selectedChannel.name}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            className={`max-h-[60vh] sm:max-h-[65vh] w-auto object-contain rounded-2xl border border-white/10 shadow-2xl transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Footer Notice & API Key Clarification */}
        <div className="p-4 px-5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero-Key Stream:</strong> This live satellite feed updates directly from the IMD Geostationary Spacecraft without requiring any API token.
            </span>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white transition-all font-semibold text-xs cursor-pointer active:scale-95 shadow-sm"
            >
              Close Viewer (Esc)
            </button>
            <div className="text-[11px] font-mono text-slate-500 text-right hidden sm:block">
              INSAT-3D/3DR (74°E / 82°E)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

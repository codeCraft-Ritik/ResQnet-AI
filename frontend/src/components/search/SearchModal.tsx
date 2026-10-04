import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Search, MapPin, Sparkles } from 'lucide-react';
import { LocationSearch } from './LocationSearch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_QUICK_CITIES = [
  { id: 'puri', name: 'Puri', state: 'Odisha' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'paradip', name: 'Paradip', state: 'Odisha' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { id: 'kochi', name: 'Kochi', state: 'Kerala' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMapRoute = location.pathname === '/map';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  const handleSelectCity = (cityId: string) => {
    if (isMapRoute) {
      navigate(`/map?loc=${cityId}`);
    } else {
      navigate(`/location/${cityId}`);
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[99999] flex items-start justify-center pt-8 sm:pt-20 pb-12 px-3 sm:px-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 cursor-pointer pointer-events-auto overflow-y-auto"
      style={{ isolation: 'isolate' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-panel rounded-3xl border border-cyan-400/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] p-4 sm:p-6 relative animate-in zoom-in-95 duration-200 cursor-default bg-[#071324]/98 my-auto"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider block">
                Global Location Intelligence Search
              </span>
              <span className="text-[10px] text-cyan-400/80 font-mono">
                {isMapRoute ? '🎯 Live Map Mode — Selection will focus map view' : '20+ Coastal Ports, Observatories & Districts'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Search (ESC)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <LocationSearch
          size="large"
          autoFocus={true}
          onSelect={(loc) => handleSelectCity(loc.id)}
        />

        {/* Quick Sector Shortcuts */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Frequent Coastal Sectors:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_QUICK_CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCity(c.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-500/40 transition-all font-medium"
              >
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{c.name}</span>
                <span className="text-[10px] text-slate-500">({c.state})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5">
          <span>Search any coastal city, district, or state across India</span>
          <span className="text-cyan-400 hidden sm:inline">Press ESC or click outside to close</span>
        </div>
      </div>
    </div>
  );
};

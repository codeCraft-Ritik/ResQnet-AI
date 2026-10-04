import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Waves, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { searchLocations, COASTAL_SECTORS, findLocationById } from '../../data/demo/locations';
import { LocationProfile } from '../../types/disaster';

interface LocationSearchProps {
  placeholder?: string;
  size?: 'default' | 'large';
  autoFocus?: boolean;
  onSelect?: (loc: LocationProfile) => void;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  placeholder = 'Search any coastal city, district, port or location (e.g. Puri, Chennai, Mumbai)...',
  size = 'default',
  autoFocus = false,
  onSelect,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<LocationProfile[]>([]);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults(COASTAL_SECTORS.slice(0, 8));
    } else {
      setResults(searchLocations(query));
    }
    setSelectedIndex(0);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationProfile) => {
    setQuery(loc.name);
    setIsOpen(false);
    if (onSelect) {
      onSelect(loc);
    } else {
      navigate(`/location/${loc.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        const fallbackId = query.trim().toLowerCase().replace(/\s+/g, '-');
        const customLoc = findLocationById(fallbackId);
        if (customLoc) {
          handleSelect(customLoc);
        } else {
          if (onSelect) {
            onSelect({
              id: fallbackId,
              name: query.trim(),
              state: 'India Coastal Grid',
              country: 'India',
              lat: 19.81,
              lng: 85.83,
              is_coastal: true,
              baseline_exposure: 200000,
              vulnerability_index: 0.75
            });
          } else {
            navigate(`/location/${fallbackId}`);
          }
          setIsOpen(false);
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Container (Apple Spotlight Liquid Glass) */}
      <div
        className={`group flex items-center gap-3.5 rounded-[24px] glass-panel border border-cyan-400/25 transition-all duration-300 focus-within:border-cyan-400/80 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-[#071324]/80 backdrop-blur-2xl ${
          isLarge ? 'px-4 sm:px-6 py-4 text-base' : 'px-3.5 py-2.5 text-sm'
        }`}
      >
        <Search
          className={`text-cyan-400 shrink-0 transition-transform group-focus-within:scale-110 ${
            isLarge ? 'w-5 h-5' : 'w-4 h-4'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Clear
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-white/15 shrink-0 shadow-inner">
          <span>Enter</span>
          <CornerDownLeft className="w-3 h-3 text-cyan-400" />
        </div>
      </div>

      {/* Autocomplete Dropdown (Apple Liquid Glass Sheet) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2.5 glass-panel rounded-[24px] border border-cyan-400/40 shadow-2xl overflow-hidden z-[100000] backdrop-blur-2xl bg-[#061224]/98 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between bg-white/[0.02]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{query ? 'Matched Geospatial Locations' : 'High-Risk Coastal & Inland Sectors'}</span>
            </span>
            <span className="font-mono text-cyan-400">{results.length} locations</span>
          </div>

          <div className="max-h-60 sm:max-h-80 overflow-y-auto divide-y divide-white/5">
            {results.length > 0 ? (
              results.map((loc, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3.5 text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent text-white border-l-2 border-l-cyan-400'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          loc.is_coastal
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {loc.is_coastal ? <Waves className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          <span>{loc.name}</span>
                          {loc.is_coastal ? (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                              COASTAL
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-400">
                              INLAND
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{loc.district ? `${loc.district}, ` : ''}{loc.state}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E
                          </span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center text-sm text-slate-400 space-y-3">
                <p>
                  No preset profile found for "<span className="text-white font-semibold">{query}</span>".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const fallbackId = query.trim().toLowerCase().replace(/\s+/g, '-');
                    const loc = findLocationById(fallbackId);
                    if (loc) {
                      handleSelect(loc);
                    } else {
                      navigate(`/location/${fallbackId}`);
                      setIsOpen(false);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-glow-cyan"
                >
                  <span>Query "{query}" via Regional Radar & Satellite Mesh</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

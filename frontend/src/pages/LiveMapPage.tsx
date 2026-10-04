import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DisasterMap } from '../components/map/DisasterMap';
import { MapLayers } from '../components/map/MapLayers';
import { MapLegend } from '../components/map/MapLegend';
import { getHazards } from '../services/hazardService';
import { getReports } from '../services/reportService';
import { getShelters } from '../services/shelterService';
import { COASTAL_SECTORS, findLocationById } from '../data/demo/locations';
import { HazardEvent, CitizenReport, Shelter, WeatherObservation, OceanObservation } from '../types/disaster';
import { MapPin, ChevronDown, Satellite, Search } from 'lucide-react';
import { LiveIndiaSatelliteModal } from '../components/weather/LiveIndiaSatelliteModal';

export const LiveMapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const locParam = searchParams.get('loc') || searchParams.get('location');

  const [selectedLoc, setSelectedLoc] = useState(() => {
    if (locParam) {
      const normalized = locParam.trim().toLowerCase();
      const matched = COASTAL_SECTORS.find(
        (l) => l.id.toLowerCase() === normalized || l.name.toLowerCase() === normalized
      ) || findLocationById(normalized);
      if (matched) return matched;
    }
    return COASTAL_SECTORS[0];
  });

  const [hazards, setHazards] = useState<HazardEvent[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isSatModalOpen, setIsSatModalOpen] = useState(false);
  const [layers, setLayers] = useState({
    hazards: true,
    reports: true,
    shelters: true,
    sensors: true,
    satellite: false,
  });

  // Keep selectedLoc in sync if URL query parameter changes
  useEffect(() => {
    if (locParam) {
      const normalized = locParam.trim().toLowerCase();
      const matched = COASTAL_SECTORS.find(
        (l) => l.id.toLowerCase() === normalized || l.name.toLowerCase() === normalized
      ) || findLocationById(normalized);
      if (matched && matched.id !== selectedLoc.id) {
        setSelectedLoc(matched);
      }
    }
  }, [locParam, selectedLoc.id]);

  const weather: WeatherObservation[] = [
    {
      station_id: `IMD-${selectedLoc.name.toUpperCase()}-${selectedLoc.station_id || 'STN'}`,
      station_name: `${selectedLoc.name} Meteorological Observatory`,
      lat: selectedLoc.lat,
      lng: selectedLoc.lng,
      timestamp: new Date().toISOString(),
      temperature_c: 28.2,
      humidity_pct: 89,
      wind_speed_kmh: 68.5,
      wind_gust_kmh: 79.2,
      wind_direction: 'ESE',
      rainfall_mm_hr: 44.6,
      pressure_hpa: 994.2,
      trend: 'FALLING_PRESSURE',
      port_signal: 'Local Cautionary Signal No. III',
    }
  ];

  const ocean: OceanObservation[] = selectedLoc.is_coastal ? [
    {
      buoy_id: selectedLoc.buoy_id || 'INCOIS-BOB-04',
      lat: selectedLoc.lat - 0.06,
      lng: selectedLoc.lng + 0.04,
      timestamp: new Date().toISOString(),
      wave_height_m: 4.4,
      wave_period_s: 11.2,
      wave_direction: 'SE',
      swell_height_m: 3.7,
      swell_direction: 'SE',
      sea_surface_temp_c: 29.6,
      tide_surge_anomaly_m: 1.45,
    }
  ] : [];

  useEffect(() => {
    Promise.all([
      getHazards(selectedLoc.id, selectedLoc),
      getReports(selectedLoc.id, selectedLoc),
      getShelters(selectedLoc.id, selectedLoc)
    ]).then(([h, r, s]) => {
      setHazards(h);
      setReports(r);
      setShelters(s);
    });
  }, [selectedLoc]);

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] overflow-hidden flex flex-col">
      {/* Top Floating Glass Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Side: Location Dropdown + Search City Button */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          {/* Location Dropdown Pill */}
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl glass-panel border border-white/15 shadow-2xl backdrop-blur-xl">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Focus Region:</span>
            <div className="relative">
              <select
                value={selectedLoc.id}
                onChange={(e) => {
                  const found = COASTAL_SECTORS.find(l => l.id === e.target.value);
                  if (found) {
                    setSelectedLoc(found);
                    setSearchParams({ loc: found.id });
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-100 rounded-lg pr-5 py-1 focus:outline-none cursor-pointer appearance-none"
              >
                {COASTAL_SECTORS.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {loc.name}, {loc.state} {loc.is_coastal ? '(Coastal)' : '(Inland)'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Quick Search City Modal Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('resqnet:open-search'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-panel border border-cyan-400/30 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/60 transition-all shadow-md backdrop-blur-xl group cursor-pointer"
            title="Search any coastal city, district, or port across India"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search City</span>
            <span className="sm:hidden">Search</span>
          </button>
        </div>

        {/* Layer Controls & Live Satellite Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsSatModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-cyan-200 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 rounded-2xl transition-all shadow-lg shadow-cyan-500/10 backdrop-blur-xl"
            title="View Real-Time INSAT-3D Satellite Imagery of India"
          >
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">Live India Satellite</span>
            <span className="sm:hidden">Satellite</span>
          </button>
          <MapLayers layers={layers} onChange={setLayers} />
        </div>
      </div>

      {/* Floating Legend (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-20 pointer-events-auto hidden sm:block">
        <MapLegend />
      </div>

      {/* Map Element */}
      <div className="flex-1 w-full h-full">
        <DisasterMap
          center={[selectedLoc.lat, selectedLoc.lng]}
          zoom={13}
          hazards={hazards}
          reports={reports}
          shelters={shelters}
          weather={weather}
          ocean={ocean}
          showLayers={layers}
          height="100%"
        />
      </div>

      {/* Live India Satellite Modal */}
      <LiveIndiaSatelliteModal
        isOpen={isSatModalOpen}
        onClose={() => setIsSatModalOpen(false)}
      />
    </div>
  );
};

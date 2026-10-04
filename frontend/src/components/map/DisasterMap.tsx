import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HazardEvent, CitizenReport, Shelter, WeatherObservation, OceanObservation } from '../../types/disaster';
import { SaferRouteResult } from '../../types/route';

interface DisasterMapProps {
  center?: [number, number];
  zoom?: number;
  hazards?: HazardEvent[];
  reports?: CitizenReport[];
  shelters?: Shelter[];
  weather?: WeatherObservation[];
  ocean?: OceanObservation[];
  activeRoute?: SaferRouteResult | null;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  showLayers?: {
    hazards: boolean;
    reports: boolean;
    shelters: boolean;
    sensors: boolean;
    satellite?: boolean;
  };
}

export const DisasterMap: React.FC<DisasterMapProps> = ({
  center = [19.8135, 85.8312],
  zoom = 14,
  hazards = [],
  reports = [],
  shelters = [],
  weather = [],
  ocean = [],
  activeRoute = null,
  onMapClick,
  height = '500px',
  showLayers = { hazards: true, reports: true, shelters: true, sensors: true, satellite: false },
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayersRef = useRef<{
    lightBase: L.TileLayer | null;
    satellite: L.TileLayer | null;
  }>({
    lightBase: null,
    satellite: null,
  });
  const layersRef = useRef<{
    hazards: L.LayerGroup;
    reports: L.LayerGroup;
    shelters: L.LayerGroup;
    sensors: L.LayerGroup;
    route: L.LayerGroup;
  }>({
    hazards: L.layerGroup(),
    reports: L.layerGroup(),
    shelters: L.layerGroup(),
    sensors: L.layerGroup(),
    route: L.layerGroup(),
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(center, zoom);

    // Original Light Color OpenStreetMap Layer (Zero watermark, No API key needed)
    const lightBase = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }
    );

    // High-resolution Satellite View (Zero watermark, No API key needed)
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
        maxZoom: 19,
      }
    );

    tileLayersRef.current = { lightBase, satellite };

    if (showLayers.satellite) {
      satellite.addTo(map);
    } else {
      lightBase.addTo(map);
    }

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attach click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    // Add Layer Groups
    Object.values(layersRef.current).forEach(g => g.addTo(map));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Basemap Layer when showLayers.satellite changes
  useEffect(() => {
    const map = mapRef.current;
    const { lightBase, satellite } = tileLayersRef.current;
    if (!map || !lightBase || !satellite) return;

    if (showLayers.satellite) {
      if (lightBase && map.hasLayer(lightBase)) map.removeLayer(lightBase);
      if (satellite && !map.hasLayer(satellite)) satellite.addTo(map);
    } else {
      if (satellite && map.hasLayer(satellite)) map.removeLayer(satellite);
      if (lightBase && !map.hasLayer(lightBase)) lightBase.addTo(map);
    }
  }, [showLayers.satellite]);

  // Update Center if changed
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Render Hazards
  useEffect(() => {
    const group = layersRef.current.hazards;
    group.clearLayers();
    if (!showLayers.hazards) return;

    hazards.forEach(h => {
      if (h.perimeter_coords && h.perimeter_coords.length > 2) {
        const poly = L.polygon(h.perimeter_coords, {
          color: '#ef4444',
          weight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.35,
          className: 'animate-pulse',
        });

        poly.bindPopup(`
          <div class="p-2 text-slate-900 min-w-[200px]">
            <span class="inline-block px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wide mb-1">
              ${h.severity} HAZARD
            </span>
            <div class="font-bold text-sm text-slate-900">${h.title}</div>
            <div class="text-xs text-slate-600 mt-1 space-y-0.5">
              <div><strong>AI Risk:</strong> ${h.ai_risk_score}% | <strong>Confidence:</strong> ${h.ai_confidence}%</div>
              <div><strong>Exposed Citizens:</strong> ${h.affected_population_estimate.toLocaleString()}</div>
              <div><strong>Trend:</strong> ${h.trend}</div>
            </div>
            <div class="text-[11px] text-slate-500 mt-1 border-t pt-1">
              Threatens: ${h.critical_infrastructure_threatened.join(', ')}
            </div>
          </div>
        `);
        group.addLayer(poly);
      }
    });
  }, [hazards, showLayers.hazards]);

  // Render Reports
  useEffect(() => {
    const group = layersRef.current.reports;
    group.clearLayers();
    if (!showLayers.reports) return;

    reports.forEach(r => {
      const pulseIcon = L.divIcon({
        className: 'custom-beacon-icon',
        html: `
          <div style="position:relative; width:24px; height:24px;">
            <div style="position:absolute; inset:0; border-radius:50%; background:rgba(16,185,129,0.4); animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position:absolute; inset:4px; border-radius:50%; background:#10b981; border:2px solid #fff; box-shadow:0 0 8px rgba(16,185,129,0.8);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([r.lat, r.lng], { icon: pulseIcon });
      marker.bindPopup(`
        <div class="p-2 text-slate-900 min-w-[190px]">
          <span class="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wide mb-1">
            ${r.status} (${Math.round(r.confidence * 100)}% CONF)
          </span>
          <div class="font-bold text-sm text-slate-900">${r.hazard_type}</div>
          <div class="text-xs text-slate-600 mt-1">${r.description}</div>
          <div class="text-[11px] text-slate-500 mt-1 border-t pt-1">
            Affected: ${r.people_affected} people | Source: ${r.source}
          </div>
        </div>
      `);
      group.addLayer(marker);
    });
  }, [reports, showLayers.reports]);

  // Render Shelters
  useEffect(() => {
    const group = layersRef.current.shelters;
    group.clearLayers();
    if (!showLayers.shelters) return;

    shelters.forEach(s => {
      const shelterIcon = L.divIcon({
        className: 'shelter-marker-icon',
        html: `
          <div style="background:#0284c7; color:#fff; width:22px; height:22px; border-radius:6px; font-weight:800; font-size:11px; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,0.4);">
            S
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([s.lat, s.lng], { icon: shelterIcon });
      marker.bindPopup(`
        <div class="p-2 text-slate-900 min-w-[190px]">
          <span class="inline-block px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wide mb-1">
            ${s.type}
          </span>
          <div class="font-bold text-sm text-slate-900">${s.name}</div>
          <div class="text-xs text-slate-600 mt-1 space-y-0.5">
            <div>Beds Available: <strong>${s.available_beds}</strong> / ${s.capacity_total}</div>
            <div>Elevation: ${s.elevation_m}m | Medical Unit: ${s.has_medical_unit ? 'YES' : 'NO'}</div>
            <div>Helpline: ${s.contact_phone}</div>
          </div>
        </div>
      `);
      group.addLayer(marker);
    });
  }, [shelters, showLayers.shelters]);

  // Render Weather & Ocean Sensors
  useEffect(() => {
    const group = layersRef.current.sensors;
    group.clearLayers();
    if (!showLayers.sensors) return;

    ocean.forEach(o => {
      const buoyIcon = L.divIcon({
        className: 'sensor-buoy-icon',
        html: `
          <div style="background:#06b6d4; color:#000; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 0 8px rgba(6,182,212,0.8);">
            <div style="width:6px; height:6px; background:#fff; border-radius:50%;"></div>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([o.lat, o.lng], { icon: buoyIcon });
      marker.bindPopup(`
        <div class="p-2 text-slate-900 min-w-[180px]">
          <span class="inline-block px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase tracking-wide mb-1">
            INCOIS OCEAN BUOY
          </span>
          <div class="font-bold text-sm text-slate-900">${o.buoy_id}</div>
          <div class="text-xs text-slate-600 mt-1 space-y-0.5">
            <div>Wave Height: <strong>${o.wave_height_m}m</strong></div>
            <div>Swell: ${o.swell_height_m}m (${o.swell_direction})</div>
            <div>Surge Anomaly: <strong>+${o.tide_surge_anomaly_m}m</strong></div>
          </div>
        </div>
      `);
      group.addLayer(marker);
    });

    weather.forEach(w => {
      const stnIcon = L.divIcon({
        className: 'sensor-stn-icon',
        html: `
          <div style="background:#f59e0b; color:#000; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 0 8px rgba(245,158,11,0.8);">
            <div style="width:6px; height:6px; background:#fff; border-radius:50%;"></div>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([w.lat, w.lng], { icon: stnIcon });
      marker.bindPopup(`
        <div class="p-2 text-slate-900 min-w-[180px]">
          <span class="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wide mb-1">
            IMD WEATHER STATION
          </span>
          <div class="font-bold text-sm text-slate-900">${w.station_name}</div>
          <div class="text-xs text-slate-600 mt-1 space-y-0.5">
            <div>Wind: <strong>${w.wind_speed_kmh} km/h</strong> (Gusts ${w.wind_gust_kmh})</div>
            <div>Rain: <strong>${w.rainfall_mm_hr} mm/hr</strong> | Pressure: ${w.pressure_hpa} hPa</div>
            ${w.port_signal ? `<div>Signal: <strong>${w.port_signal}</strong></div>` : ''}
          </div>
        </div>
      `);
      group.addLayer(marker);
    });
  }, [weather, ocean, showLayers.sensors]);

  // Render Safer Route
  useEffect(() => {
    const group = layersRef.current.route;
    group.clearLayers();

    if (activeRoute && activeRoute.path_coordinates && activeRoute.path_coordinates.length > 1) {
      const line = L.polyline(activeRoute.path_coordinates, {
        color: '#38bdf8',
        weight: 5,
        dashArray: '8, 8',
        opacity: 0.9,
      });

      line.bindPopup(`
        <div class="p-2 text-slate-900 min-w-[180px]">
          <span class="inline-block px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wide mb-1">
            A* EVACUATION ROUTE
          </span>
          <div class="font-bold text-sm text-slate-900">${activeRoute.target_shelter_name}</div>
          <div class="text-xs text-slate-600 mt-1">
            Distance: ${activeRoute.total_distance_km} km | Safety: ${activeRoute.overall_route_safety_score}/100
          </div>
        </div>
      `);
      group.addLayer(line);

      if (mapRef.current) {
        mapRef.current.fitBounds(line.getBounds(), { padding: [40, 40] });
      }
    }
  }, [activeRoute]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 z-0 isolate"
    />
  );
};


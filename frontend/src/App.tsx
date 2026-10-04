import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuroraBackground } from './components/layout/AuroraBackground';
import { RoleGuidanceBanner } from './components/common/RoleGuidanceBanner';
import { SearchModal } from './components/search/SearchModal';
import { LandingPage } from './pages/LandingPage';
import { LocationIntelligencePage } from './pages/LocationIntelligencePage';
import { LiveMapPage } from './pages/LiveMapPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { CitizenReportingPage } from './pages/CitizenReportingPage';
import { SimulationPage } from './pages/SimulationPage';
import { AlertsPage } from './pages/AlertsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState('AUTHORITY');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global search modal open event listener
  useEffect(() => {
    const handleOpenSearch = () => setSearchModalOpen(true);
    window.addEventListener('resqnet:open-search', handleOpenSearch);
    return () => window.removeEventListener('resqnet:open-search', handleOpenSearch);
  }, []);

  // WebSocket Live Telemetry Listener
  useEffect(() => {
    // In dev mode (port 5173), connect directly to backend to avoid dev proxy socket aborts
    const isDev = window.location.port === '5173';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = isDev ? '127.0.0.1:8000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws/live-feed`;

    let socket: WebSocket | null = null;
    let isMounted = true;

    try {
      socket = new WebSocket(wsUrl);
      socket.onopen = () => {
        if (!isMounted) {
          try {
            socket?.close(1000, 'Unmounted');
          } catch {}
          return;
        }
        console.log('[RESQNET AI] WebSocket Gateway Connected');
      };
      socket.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SIMULATION_PULSE' || data.type === 'TELEMETRY_PULSE') {
            console.log('[RESQNET AI] Live telemetry pulse broadcast received:', data);
          }
        } catch {}
      };
      socket.onerror = () => {
        // Graceful fallback if backend is momentarily restarting
      };
    } catch {
      console.warn('[RESQNET AI] WebSocket bypass in offline dev');
    }

    return () => {
      isMounted = false;
      if (socket) {
        if (socket.readyState === WebSocket.OPEN) {
          try {
            socket.close(1000, 'Component unmounted');
          } catch {}
        } else if (socket.readyState === WebSocket.CONNECTING) {
          socket.onopen = () => {
            try {
              socket?.close(1000, 'Component unmounted');
            } catch {}
          };
        }
      }
    };
  }, []);

  // Offline Network Liveness Listener for PWA Field Resilience
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuroraBackground>
        {/* Floating Glass Navbar */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Offline Emergency Field Operations Banner */}
        {isOffline && (
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3">
            <div className="p-3.5 rounded-2xl bg-amber-950/85 border border-amber-500/50 shadow-glow-amber text-amber-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <div>
                  <span className="font-bold font-mono uppercase tracking-wider text-amber-300">
                    Offline Disaster Field Mode Active:
                  </span>{' '}
                  Telecom connectivity down. Cached coastal shelters, safe routes, and emergency hotlines are operating offline without interruption.
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/40 border border-amber-500/40 text-amber-300 font-bold shrink-0">
                PWA OFFLINE SAFE
              </span>
            </div>
          </div>
        )}

        {/* Global Operational Guidance Directive Banner */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
          <RoleGuidanceBanner role={currentRole} />
        </div>

        {/* Main Content Body */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/location/:locationId"
              element={<LocationIntelligencePage currentRole={currentRole} />}
            />
            <Route
              path="/location"
              element={<LocationIntelligencePage currentRole={currentRole} />}
            />
            <Route path="/map" element={<LiveMapPage />} />
            <Route path="/command-center" element={<CommandCenterPage />} />
            <Route path="/reports" element={<CitizenReportingPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Global Search Modal Dialog (Ctrl+K) */}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />

        {/* Platform Footer */}
        <Footer />
      </AuroraBackground>
    </BrowserRouter>
  );
};

export default App;

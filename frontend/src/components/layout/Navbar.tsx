import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Map as MapIcon,
  Bell,
  Activity,
  Sliders,
  Radio,
  Menu,
  X,
  Search,
  Users,
  ChevronDown,
  Satellite
} from 'lucide-react';
import { LiveIndiaSatelliteModal } from '../weather/LiveIndiaSatelliteModal';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [satModalOpen, setSatModalOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { to: '/location/puri', label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
    { to: '/map', label: 'Live Map', icon: <MapIcon className="w-3.5 h-3.5" /> },
    { to: '/alerts', label: 'Alerts', icon: <Bell className="w-3.5 h-3.5" /> },
    { to: '/reports', label: 'Reports', icon: <Users className="w-3.5 h-3.5" /> },
    { to: '/simulation', label: 'Simulation', icon: <Sliders className="w-3.5 h-3.5" /> },
    { to: '/command-center', label: 'Command', icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="max-w-[1600px] w-full mx-auto">
        <div className="pointer-events-auto flex items-center justify-between h-16 px-4 sm:px-6 rounded-[26px] dynamic-island border border-cyan-400/25 shadow-2xl backdrop-blur-2xl">
          {/* Logo & Platform Name (Apple Squircle Icon) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 p-[1.5px] shadow-glow-cyan shrink-0 transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[14px] bg-[#071324] flex items-center justify-center text-cyan-300">
                <ShieldAlert className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-base sm:text-lg tracking-tight text-white font-sans">RESQNET</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  AI
                </span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase pt-0.5 font-mono">
                COASTAL INTELLIGENCE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (iPhone Segmented Control Capsule) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-[#061122]/70 p-1 rounded-2xl border border-white/10 backdrop-blur-xl shadow-inner shrink-0">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/25 via-sky-500/20 to-blue-600/20 text-cyan-200 border border-cyan-400/40 shadow-sm shadow-cyan-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Action Tools: Live Satellite, Spotlight Search, Role Switcher, Dynamic Island Indicator */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {/* Live Satellite Button (Liquid Glass Aqua Button) */}
            <button
              onClick={() => setSatModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 rounded-2xl transition-all shadow-sm font-semibold hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0"
              title="View Live INSAT-3D Satellite Imagery of India"
            >
              <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse group-hover:rotate-12 transition-transform" />
              <span className="whitespace-nowrap">Live Satellite</span>
            </button>

            {/* Quick Spotlight Search Pill */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-cyan-400/40 rounded-2xl transition-all hover:text-white shadow-sm shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 hidden 2xl:inline">Search</span>
                <kbd className="text-[10px] font-mono bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded-lg border border-white/15 shadow-inner">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Tactile Role Switcher Capsule */}
            <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 rounded-2xl px-2.5 py-1.5 text-xs shrink-0">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Role:</span>
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="AUTHORITY" className="bg-[#0b172a] text-white">Authority / NDRF</option>
                  <option value="RESPONDER" className="bg-[#0b172a] text-white">First Responder</option>
                  <option value="CITIZEN" className="bg-[#0b172a] text-white">Coastal Citizen</option>
                  <option value="ANALYST" className="bg-[#0b172a] text-white">Scientific Analyst</option>
                </select>
                <ChevronDown className="w-3 h-3 text-cyan-400 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* iOS Dynamic Island Live Activity Indicator */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>LIVE PILOT</span>
            </div>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-2xl bg-white/[0.06] text-slate-300 hover:text-white border border-white/10"
                aria-label="Open search dialog"
              >
                <Search className="w-4 h-4 text-cyan-400" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white/[0.06] text-slate-300 hover:text-white border border-white/10 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown (iOS Bottom/Top Sheet Aesthetic) */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto xl:hidden mt-3 p-5 rounded-[28px] glass-panel border border-cyan-500/25 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => {
                setSatModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-cyan-200 bg-cyan-500/15 rounded-2xl border border-cyan-400/30 w-full shadow-sm"
            >
              <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Live India Satellite (INSAT-3D)</span>
            </button>

            <div className="space-y-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-200 border border-cyan-400/40 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Active Operating Role:</span>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="bg-[#0b172a] border border-white/10 text-xs font-bold text-cyan-300 rounded-xl px-3 py-1.5"
              >
                <option value="AUTHORITY">Authority / NDRF</option>
                <option value="RESPONDER">First Responder</option>
                <option value="CITIZEN">Coastal Citizen</option>
                <option value="ANALYST">Scientific Analyst</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>

    {/* Live India Satellite Modal rendered outside header for full pointer events */}
    <LiveIndiaSatelliteModal
      isOpen={satModalOpen}
      onClose={() => setSatModalOpen(false)}
    />
  </>
);
};

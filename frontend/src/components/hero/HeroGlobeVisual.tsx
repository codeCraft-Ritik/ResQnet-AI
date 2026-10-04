import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Satellite,
  Waves,
  Radio,
  ShieldAlert,
  Activity,
  Zap,
  MapPin,
  CheckCircle2,
  Wind
} from 'lucide-react';

export const HeroGlobeVisual: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('puri');

  const nodes = [
    {
      id: 'puri',
      name: 'Puri Coast Sector',
      coords: '19.80°N, 85.82°E',
      status: 'HIGH OVERWASH RISK',
      statusColor: 'text-red-400 bg-red-950/60 border-red-500/40',
      telemetry: 'Wave: 4.4m • Surge: +1.45m',
      x: 230,
      y: 170,
    },
    {
      id: 'chennai',
      name: 'Chennai Port',
      coords: '13.08°N, 80.27°E',
      status: 'SWELL CAUTION',
      statusColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      telemetry: 'Wave: 2.8m • Signal III',
      x: 180,
      y: 270,
    },
    {
      id: 'paradip',
      name: 'Paradip Harbor',
      coords: '20.31°N, 86.61°E',
      status: 'CYCLONE SQUALL',
      statusColor: 'text-orange-400 bg-orange-950/60 border-orange-500/40',
      telemetry: 'Wind: 78 km/h • Rain 52mm',
      x: 270,
      y: 130,
    },
    {
      id: 'vizag',
      name: 'Visakhapatnam Buoy',
      coords: '17.68°N, 83.21°E',
      status: 'SYNCHRONIZED',
      statusColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
      telemetry: 'Deep Buoy Active • Period 11s',
      x: 210,
      y: 220,
    },
  ];

  const currentNode = nodes.find(n => n.id === activeNode) || nodes[0];

  return (
    <div className="relative w-full max-w-[540px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer Atmospheric Glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-sky-500/10 blur-3xl pointer-events-none" />

      {/* SVG Container for Radar & Globe Elements */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10 overflow-visible"
        aria-label="Interactive Coastal Disaster Intelligence Globe"
      >
        <defs>
          {/* Radial Gradient for Globe Body */}
          <radialGradient id="globeSphere" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#0f2b48" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#09182d" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#040b17" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#02050c" stopOpacity="1" />
          </radialGradient>

          {/* Sweep Gradient */}
          <linearGradient id="radarBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Luminous Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Rings */}
        <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="1" />
        <circle cx="200" cy="200" r="135" fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeDasharray="2 6" />

        {/* The Digital Globe Sphere */}
        <circle
          cx="200"
          cy="200"
          r="115"
          fill="url(#globeSphere)"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="1.5"
          className="shadow-2xl"
        />

        {/* Latitude & Longitude Digital Grid Lines */}
        <ellipse cx="200" cy="200" rx="115" ry="38" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="115" ry="76" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="38" ry="115" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="76" ry="115" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />

        {/* Coastline Aesthetic Curves (Bay of Bengal & Indian Coast Outline Silhouette) */}
        <path
          d="M175,105 Q190,135 195,160 Q205,185 220,200 Q240,215 255,230 Q265,245 280,265"
          fill="none"
          stroke="rgba(6, 182, 212, 0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />
        <path
          d="M195,160 Q180,195 175,225 Q170,250 178,280 Q185,300 190,314"
          fill="none"
          stroke="rgba(56, 189, 248, 0.45)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M150,140 Q165,180 160,220 Q155,260 162,295"
          fill="none"
          stroke="rgba(147, 197, 253, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Ocean Wave Ripple Lines */}
        <path
          d="M210,165 Q225,160 240,168 T270,165"
          fill="none"
          stroke="rgba(56, 189, 248, 0.3)"
          strokeWidth="1"
          className="animate-pulse"
        />
        <path
          d="M215,180 Q230,175 245,183 T275,180"
          fill="none"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="1"
        />
        <path
          d="M220,195 Q235,190 250,198 T280,195"
          fill="none"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1"
        />

        {/* Rotating Radar Sweep Beam */}
        <g className="origin-[200px_200px] animate-radar-sweep pointer-events-none">
          <path
            d="M200,200 L315,200 A115,115 0 0,0 281,118 Z"
            fill="url(#radarBeam)"
          />
          <line
            x1="200"
            y1="200"
            x2="315"
            y2="200"
            stroke="rgba(56, 189, 248, 0.8)"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
        </g>

        {/* Orbiting Satellite 1: Sentinel-1 SAR */}
        <g className="origin-[200px_200px] animate-orbit-slow">
          <circle cx="200" cy="40" r="4" fill="#38bdf8" filter="url(#glow)" />
          <circle cx="200" cy="40" r="10" fill="none" stroke="rgba(56, 189, 248, 0.3)" />
          <text x="212" y="44" fill="#7dd3fc" fontSize="9" fontFamily="monospace" fontWeight="600">
            SAR SAT-1
          </text>
        </g>

        {/* Interactive Hazard Nodes on the Coast */}
        {nodes.map((node) => {
          const isSelected = node.id === activeNode;
          return (
            <g
              key={node.id}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => setActiveNode(node.id)}
            >
              {/* Outer pulsing ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? '14' : '10'}
                fill="none"
                stroke={isSelected ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.4)'}
                strokeWidth="1.5"
                className="animate-ping"
                style={{ animationDuration: isSelected ? '1.8s' : '3s' }}
              />

              {/* Node core beacon */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? '5' : '3.5'}
                fill={isSelected ? '#ef4444' : '#06b6d4'}
                filter="url(#glow)"
              />

              {/* Node Label */}
              <text
                x={node.x + 8}
                y={node.y + 4}
                fill={isSelected ? '#f8fafc' : '#94a3b8'}
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight={isSelected ? '700' : '500'}
                className="pointer-events-none drop-shadow-md"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Glassmorphic Telemetry Card (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-2 right-0 sm:-right-4 z-20 glass-panel p-3 rounded-xl max-w-[210px] shadow-xl border border-white/10 text-left"
      >
        <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-700/60">
          <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[11px] font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
            <span>NRT TELEMETRY</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="pt-1.5 space-y-1 text-[11px]">
          <div className="font-bold text-slate-100">{currentNode.name}</div>
          <div className="font-mono text-[10px] text-slate-400">{currentNode.coords}</div>
          <div className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border inline-block ${currentNode.statusColor}`}>
            {currentNode.status}
          </div>
          <div className="text-[10px] text-slate-300 font-mono pt-0.5">{currentNode.telemetry}</div>
        </div>
      </motion.div>

      {/* Floating Glassmorphic AI Certainty Pill (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-4 left-0 sm:-left-4 z-20 glass-panel p-3 rounded-xl shadow-xl border border-white/10 text-left flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-[11px]">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            Bayesian Consensus
          </div>
          <div className="font-bold text-slate-100 flex items-center gap-1.5">
            <span className="text-emerald-400 font-mono text-sm">92%</span>
            <span className="text-slate-300">Actionable Certainty</span>
          </div>
          <div className="text-[10px] text-slate-400">IMD + INCOIS + SAR Fused</div>
        </div>
      </motion.div>
    </div>
  );
};

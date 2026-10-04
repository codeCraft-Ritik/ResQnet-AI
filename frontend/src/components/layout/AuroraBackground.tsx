import React from 'react';

export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#030712] overflow-hidden">
      {/* Aurora Gradient Orbs - Carefully tuned opacities to be subtle and deep */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Electric Aqua / Cyan Orb (Top Center) */}
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/20 blur-[140px] animate-aurora-drift" />

        {/* Deep Ocean Sapphire / Indigo Orb (Top Right) */}
        <div className="absolute top-10 right-[-10%] h-[650px] w-[650px] rounded-full bg-sky-600/15 blur-[160px] animate-pulse-glow" />

        {/* Vibrant Aqua / Teal Orb (Middle Left) */}
        <div className="absolute top-[40%] -left-32 h-[550px] w-[550px] rounded-full bg-teal-500/15 blur-[140px]" />

        {/* Deep Oceanic Abyss / Royal Glow (Bottom Center) */}
        <div className="absolute bottom-[-15%] left-1/3 h-[650px] w-[750px] rounded-full bg-blue-900/25 blur-[160px]" />

        {/* Subtle Cyber Grid Overlay */}
        <div className="absolute inset-0 cyber-grid opacity-25" />

        {/* Top Vignette & Radial Contrast Mask */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/50 to-[#030712]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
};

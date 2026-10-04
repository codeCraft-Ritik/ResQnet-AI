import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-ocean-500/10 text-ocean-400 flex items-center justify-center border border-ocean-500/30">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight">
        404 — Location or Route Not Found
      </h1>

      <p className="text-sm text-slate-400 max-w-md mx-auto">
        The requested disaster intelligence sector or navigation corridor could not be mapped.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Platform Overview</span>
      </Link>
    </div>
  );
};

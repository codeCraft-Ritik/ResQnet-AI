import React from 'react';
import { clsx } from 'clsx';
import { SeverityLevel } from '../../types/disaster';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'high' | 'moderate' | 'low' | 'info' | 'neutral';
  severity?: SeverityLevel;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant, severity, className }) => {
  let resolvedVariant = variant || 'neutral';

  if (severity) {
    switch (severity) {
      case 'CRITICAL':
        resolvedVariant = 'critical';
        break;
      case 'HIGH':
        resolvedVariant = 'high';
        break;
      case 'MODERATE':
        resolvedVariant = 'moderate';
        break;
      case 'LOW':
        resolvedVariant = 'low';
        break;
    }
  }

  const variantStyles = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    moderate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase',
        variantStyles[resolvedVariant],
        className
      )}
    >
      {children}
    </span>
  );
};

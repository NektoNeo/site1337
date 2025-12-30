'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export type SectionDividerVariant = 'minimal' | 'glow' | 'orb' | 'wave';
export type SectionDividerIntensity = 'subtle' | 'medium' | 'strong';

export interface SectionDividerProps {
  variant?: SectionDividerVariant;
  intensity?: SectionDividerIntensity;
  className?: string;
}

const intensityToOpacity: Record<SectionDividerIntensity, { line: string; glow: string }> =
  {
    subtle: { line: 'opacity-40', glow: 'opacity-20' },
    medium: { line: 'opacity-60', glow: 'opacity-35' },
    strong: { line: 'opacity-80', glow: 'opacity-50' },
  };

export function SectionDivider({
  variant = 'minimal',
  intensity = 'subtle',
  className,
}: SectionDividerProps) {
  const o = intensityToOpacity[intensity];

  if (variant === 'wave') {
    return (
      <div
        aria-hidden="true"
        className={cn('relative w-full overflow-hidden py-6', className)}
      >
        <div className={cn('absolute inset-0 mesh-background', o.glow)} />
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={cn('relative block w-full h-10', o.line)}
        >
          <path
            d="M0,64 C150,96 350,32 600,64 C850,96 1050,32 1200,64 L1200,120 L0,120 Z"
            fill="rgba(168, 85, 247, 0.18)"
          />
          <path
            d="M0,70 C150,100 350,40 600,70 C850,100 1050,40 1200,70"
            stroke="rgba(217, 70, 239, 0.25)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn('relative w-full py-10', className)}
    >
      {/* Base line */}
      <div className="container mx-auto px-4">
        <div className={cn('relative h-px w-full', o.line)}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>
      </div>

      {/* Glow */}
      {(variant === 'glow' || variant === 'orb') && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
          <div
            className={cn(
              'h-10 w-full bg-gradient-to-r from-transparent via-purple-500/25 to-transparent blur-2xl',
              o.glow
            )}
          />
        </div>
      )}

      {/* Orb */}
      {variant === 'orb' && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={cn(
              'w-3.5 h-3.5 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400 shadow-[0_0_24px_rgba(168,85,247,0.55)]',
              o.line
            )}
          />
        </div>
      )}
    </div>
  );
}


'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export type CosmicTransitionVariant = 'nebula' | 'warp';
export type CosmicTransitionIntensity = 'subtle' | 'medium' | 'strong';

export interface CosmicTransitionProps {
  variant?: CosmicTransitionVariant;
  intensity?: CosmicTransitionIntensity;
  /** Tailwind height class string, e.g. "h-24 md:h-32" */
  height?: string;
  className?: string;
}

const intensityToOpacity: Record<CosmicTransitionIntensity, { base: string; fx: string }> =
  {
    subtle: { base: 'opacity-50', fx: 'opacity-35' },
    medium: { base: 'opacity-70', fx: 'opacity-55' },
    strong: { base: 'opacity-90', fx: 'opacity-75' },
  };

export function CosmicTransition({
  variant = 'nebula',
  intensity = 'subtle',
  height = 'h-24 md:h-32',
  className,
}: CosmicTransitionProps) {
  const o = intensityToOpacity[intensity];

  return (
    <div
      aria-hidden="true"
      className={cn('relative w-full overflow-hidden', height, className)}
    >
      {/* Base background */}
      <div className={cn('absolute inset-0 mesh-background', o.base)} />

      {variant === 'nebula' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />
          <div
            className={cn(
              'absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-fuchsia-500/15 blur-[120px]',
              o.fx
            )}
          />
          <div
            className={cn(
              'absolute -bottom-24 left-1/2 -translate-x-1/2 w-[760px] h-[380px] rounded-full bg-purple-500/15 blur-[140px]',
              o.fx
            )}
          />
        </>
      ) : (
        <>
          <div className={cn('absolute inset-0 cyber-grid-animated', o.fx)} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />
        </>
      )}

      {/* Fade edges to black to avoid harsh seams */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
    </div>
  );
}


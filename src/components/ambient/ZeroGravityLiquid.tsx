'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/cn';

export type LiquidColorScheme = 'purple' | 'fuchsia' | 'mixed';

export interface ZeroGravityLiquidProps {
  dropletCount?: number;
  colorScheme?: LiquidColorScheme;
  interactive?: boolean;
  className?: string;
}

type Droplet = {
  leftPct: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  blur: number;
  hue: 'purple' | 'fuchsia';
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickHue(scheme: LiquidColorScheme, r: number): 'purple' | 'fuchsia' {
  if (scheme === 'purple') return 'purple';
  if (scheme === 'fuchsia') return 'fuchsia';
  return r < 0.5 ? 'purple' : 'fuchsia';
}

export function ZeroGravityLiquid({
  dropletCount = 8,
  colorScheme = 'mixed',
  interactive = true,
  className,
}: ZeroGravityLiquidProps) {
  const droplets = useMemo<Droplet[]>(() => {
    const rand = mulberry32(1337 + dropletCount);
    return Array.from({ length: dropletCount }, (_, i) => {
      const r1 = rand();
      const r2 = rand();
      const r3 = rand();
      const r4 = rand();
      const r5 = rand();

      return {
        leftPct: 6 + r1 * 88,
        size: 18 + r2 * 46,
        delay: i * 0.35 + r3 * 0.4,
        duration: 2.2 + r4 * 2.2,
        opacity: 0.25 + r5 * 0.35,
        blur: 18 + rand() * 26,
        hue: pickHue(colorScheme, rand()),
      };
    });
  }, [colorScheme, dropletCount]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className
      )}
      data-interactive={interactive ? 'true' : 'false'}
    >
      {/* Subtle base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-fuchsia-500/5" />

      {droplets.map((d, idx) => {
        const isPurple = d.hue === 'purple';
        const core = isPurple
          ? 'rgba(168, 85, 247, 0.40)'
          : 'rgba(217, 70, 239, 0.38)';
        const rim = isPurple
          ? 'rgba(168, 85, 247, 0.08)'
          : 'rgba(217, 70, 239, 0.08)';

        return (
          <div
            key={idx}
            className="absolute bottom-[-20%] rounded-full animate-bubble will-change-transform"
            style={{
              left: `${d.leftPct}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              opacity: d.opacity,
              filter: `blur(${d.blur}px)`,
              background: `radial-gradient(circle at 30% 30%, ${core}, ${rim} 70%, transparent 100%)`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}


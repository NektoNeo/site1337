'use client';

import React, { useMemo } from 'react';
import { Gauge } from 'lucide-react';
import { cn } from '@/lib/cn';

type FpsPreset = {
  label: string;
  fps1080: number;
  fps1440: number;
  fps4k: number;
};

function detectGpuPreset(gpuLabelRaw: string): FpsPreset | null {
  const gpuLabel = (gpuLabelRaw || '').toLowerCase();
  const num = (re: RegExp) => (gpuLabel.match(re)?.[1] ? parseInt(gpuLabel.match(re)![1], 10) : null);

  const rtx = num(/rtx\s*(\d{4})/i) ?? num(/geforce\s+rtx\s*(\d{4})/i);
  const rx = num(/rx\s*(\d{4})/i) ?? num(/radeon\s+rx\s*(\d{4})/i);

  // RTX family (rough estimates, ultra settings, RT off)
  if (rtx) {
    if (rtx >= 4090) return { label: 'RTX 4090‑class', fps1080: 240, fps1440: 190, fps4k: 120 };
    if (rtx >= 4080) return { label: 'RTX 4080‑class', fps1080: 210, fps1440: 165, fps4k: 95 };
    if (rtx >= 4070) return { label: 'RTX 4070‑class', fps1080: 170, fps1440: 120, fps4k: 70 };
    return { label: 'RTX', fps1080: 140, fps1440: 95, fps4k: 55 };
  }

  // Radeon family
  if (rx) {
    if (rx >= 7900) return { label: 'RX 7900‑class', fps1080: 220, fps1440: 170, fps4k: 105 };
    if (rx >= 7800) return { label: 'RX 7800‑class', fps1080: 180, fps1440: 130, fps4k: 75 };
    return { label: 'Radeon', fps1080: 140, fps1440: 95, fps4k: 55 };
  }

  return null;
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function FPSMeter({
  gpuLabel,
  className,
}: {
  gpuLabel: string;
  className?: string;
}) {
  const preset = useMemo(() => detectGpuPreset(gpuLabel), [gpuLabel]);

  if (!preset) {
    return (
      <div
        className={cn(
          'rounded-2xl bg-white/[0.03] border border-white/10 p-4',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <p className="text-xs font-mono text-white/40 tracking-[0.22em] uppercase">
              FPS meter
            </p>
            <p className="text-sm text-white/60">
              Недостаточно данных для оценки (GPU не распознан)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const max = Math.max(preset.fps1080, preset.fps1440, preset.fps4k, 240);

  return (
    <div
      className={cn(
        'rounded-2xl bg-white/[0.03] border border-white/10 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <p className="text-xs font-mono text-white/40 tracking-[0.22em] uppercase">
              FPS meter
            </p>
            <p className="text-sm text-white/80">{preset.label}</p>
          </div>
        </div>
        <span className="text-xs text-white/40">Ultra · RT off</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">1080p</span>
            <span className="text-white/80 font-semibold">{preset.fps1080} FPS</span>
          </div>
          <Bar value={preset.fps1080} max={max} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">1440p</span>
            <span className="text-white/80 font-semibold">{preset.fps1440} FPS</span>
          </div>
          <Bar value={preset.fps1440} max={max} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">4K</span>
            <span className="text-white/80 font-semibold">{preset.fps4k} FPS</span>
          </div>
          <Bar value={preset.fps4k} max={max} />
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useMemo, useState } from 'react';
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
        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
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
  const [resolution, setResolution] = useState<'1080p' | '1440p'>('1080p');

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

  // Build per-game FPS from preset baselines
  const games = [
    { name: 'CS2', factor1080: 1.4, factor1440: 1.3 },
    { name: 'Valorant', factor1080: 1.5, factor1440: 1.35 },
    { name: 'Fortnite', factor1080: 1.1, factor1440: 1.0 },
    { name: 'Warzone', factor1080: 0.9, factor1440: 0.8 },
    { name: 'Cyberpunk 2077 (RT off)', factor1080: 0.7, factor1440: 0.6 },
    { name: 'GTA V', factor1080: 1.2, factor1440: 1.1 },
  ] as const;
  const base1080 = preset.fps1080;
  const base1440 = preset.fps1440;
  const data = games.map(g => ({
    name: g.name,
    fps: Math.round((resolution === '1080p' ? base1080 * g.factor1080 : base1440 * g.factor1440)),
  }));
  const max = Math.max(...data.map(d => d.fps), 240);

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setResolution('1080p')}
            className={`px-2 py-1 rounded text-xs border ${
              resolution === '1080p'
                ? 'bg-purple-500/20 border-purple-400 text-white'
                : 'bg-transparent border-white/10 text-white/70 hover:border-purple-400/40'
            }`}
          >
            1080p
          </button>
          <button
            onClick={() => setResolution('1440p')}
            className={`px-2 py-1 rounded text-xs border ${
              resolution === '1440p'
                ? 'bg-purple-500/20 border-purple-400 text-white'
                : 'bg-transparent border-white/10 text-white/70 hover:border-purple-400/40'
            }`}
          >
            1440p
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((g) => (
          <div key={g.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">{g.name}</span>
              <span className="text-white/80 font-semibold">{g.fps} FPS</span>
            </div>
            <Bar value={g.fps} max={max} />
          </div>
        ))}
      </div>
    </div>
  );
}


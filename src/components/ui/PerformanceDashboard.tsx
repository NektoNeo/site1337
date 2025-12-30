'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Eye, EyeOff, Cpu } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Dev-only performance overlay.
 * Toggle with Ctrl+Shift+P (as referenced in src/app/layout.tsx).
 */
export function PerformanceDashboard({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Refresh displayed numbers while open
  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [open]);

  const nav = useMemo(() => {
    try {
      const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (!entry) return null;
      return {
        domContentLoaded: Math.round(entry.domContentLoadedEventEnd),
        load: Math.round(entry.loadEventEnd),
        ttfb: Math.round(entry.responseStart),
      };
    } catch {
      return null;
    }
  }, [now]);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className={cn('fixed bottom-4 left-4 z-[60] select-none', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-colors"
      >
        <Activity className="w-4 h-4" />
        <span className="text-xs font-mono">Perf</span>
        {open ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>

      {open && (
        <div className="mt-2 w-[280px] rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-purple-300" />
            <p className="text-xs font-mono text-white/40 tracking-[0.22em] uppercase">
              Metrics
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Uptime</span>
              <span className="text-white/80">
                {Math.round(performance.now())}ms
              </span>
            </div>

            {nav && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">TTFB</span>
                  <span className="text-white/80">{nav.ttfb}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">DCL</span>
                  <span className="text-white/80">{nav.domContentLoaded}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Load</span>
                  <span className="text-white/80">{nav.load}ms</span>
                </div>
              </>
            )}

            <p className="pt-2 text-[11px] text-white/40">
              Toggle: <span className="font-mono">Ctrl+Shift+P</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


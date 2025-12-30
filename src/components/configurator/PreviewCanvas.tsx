'use client';

import Image from 'next/image';
import React, { useMemo } from 'react';
import { cn } from '@/lib/cn';
import type { BuildVariant, ConfiguratorSelection, MediaLayer } from '@/types/configurator';

export interface PreviewCanvasProps {
  variant: BuildVariant;
  selection: ConfiguratorSelection;
  className?: string;
}

function layerApplies(layer: MediaLayer, selection: ConfiguratorSelection): boolean {
  if (!layer.appliesTo) return true;
  return (Object.keys(layer.appliesTo) as Array<keyof ConfiguratorSelection>).every(
    (k) => layer.appliesTo?.[k] === selection[k]
  );
}

function colorTint(selection: ConfiguratorSelection): string | null {
  switch (selection.caseColor) {
    case 'black':
      return 'rgba(0,0,0,0.15)';
    case 'white':
      return 'rgba(255,255,255,0.10)';
    case 'gray':
      return 'rgba(148,163,184,0.10)'; // slate-ish
    default:
      return null;
  }
}

export function PreviewCanvas({ variant, selection, className }: PreviewCanvasProps) {
  const layers = useMemo(() => {
    const all = variant.preview.layers ?? [];
    return all
      .filter((l) => layerApplies(l, selection))
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
  }, [selection, variant.preview.layers]);

  const tint = colorTint(selection);

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10',
        className
      )}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 mesh-background opacity-70" />

      {/* Base image */}
      <div className="absolute inset-0 p-8 md:p-10">
        <Image
          src={variant.preview.baseSrc}
          alt={variant.name}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          priority={false}
        />
      </div>

      {/* Case color tint */}
      {tint && (
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{ background: tint }}
        />
      )}

      {/* Side panel hint */}
      {selection.sidePanel === 'mesh' ? (
        <div className="absolute inset-0 pointer-events-none opacity-25 cyber-grid" />
      ) : (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-60" />
      )}

      {/* Extra layers (RGB glow, etc.) */}
      {layers.map((layer) => {
        if (layer.type === 'image' && layer.src) {
          return (
            <div key={layer.id} className="absolute inset-0 pointer-events-none">
              <Image
                src={layer.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain"
              />
            </div>
          );
        }

        if ((layer.type === 'tint' || layer.type === 'glow') && layer.color) {
          return (
            <div
              key={layer.id}
              className={cn(
                'absolute inset-0 pointer-events-none',
                layer.type === 'glow' ? 'mix-blend-screen' : 'mix-blend-overlay'
              )}
              style={{
                background:
                  layer.type === 'glow'
                    ? `radial-gradient(circle at 50% 55%, ${layer.color}, transparent 60%)`
                    : layer.color,
              }}
            />
          );
        }

        return null;
      })}

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
}


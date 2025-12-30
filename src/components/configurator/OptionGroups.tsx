'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/cn';
import type { BuildVariant, ConfiguratorSelection } from '@/types/configurator';
import { Swatches } from './Swatches';

export interface OptionGroupsProps {
  selection: ConfiguratorSelection;
  variant: BuildVariant;
  onChange: (patch: Partial<ConfiguratorSelection>) => void;
  className?: string;
}

const TIER_OPTIONS: Array<{ value: ConfiguratorSelection['tier']; label: string }> = [
  { value: 'rtx4070', label: 'RTX 4070' },
  { value: 'rtx4080', label: 'RTX 4080' },
  { value: 'rtx4090', label: 'RTX 4090' },
];

const CASE_MODEL_OPTIONS: Array<{ value: ConfiguratorSelection['caseModel']; label: string }> = [
  { value: 'rog-x', label: 'ROG‑X' },
  { value: 'neo-white', label: 'NEO White' },
  { value: 'compact-pro', label: 'Compact Pro' },
  { value: 'darkline', label: 'Darkline' },
];

const CASE_COLOR_OPTIONS: Array<{
  value: ConfiguratorSelection['caseColor'];
  label: string;
  color: string;
}> = [
  { value: 'black', label: 'Чёрный', color: '#0b0b0f' },
  { value: 'white', label: 'Белый', color: '#e5e7eb' },
  { value: 'gray', label: 'Серый', color: '#94a3b8' },
];

const SIDE_PANEL_OPTIONS: Array<{ value: ConfiguratorSelection['sidePanel']; label: string }> = [
  { value: 'glass', label: 'Стекло' },
  { value: 'mesh', label: 'Mesh' },
];

const RGB_OPTIONS: Array<{ value: ConfiguratorSelection['rgb']; label: string; color?: string }> = [
  { value: 'off', label: 'Off' },
  { value: 'purple', label: 'Purple', color: '#a855f7' },
  { value: 'fuchsia', label: 'Fuchsia', color: '#d946ef' },
  { value: 'rainbow', label: 'Rainbow', color: 'linear-gradient(90deg,#22c55e,#3b82f6,#a855f7,#ef4444)' },
];

function OptionGroup({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-xs font-mono text-white/40 tracking-[0.22em] uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

export function OptionGroups({
  selection,
  variant,
  onChange,
  className,
}: OptionGroupsProps) {
  const allowedCaseColors = useMemo(() => {
    const allowed = new Set(variant.allowed.caseColor);
    return CASE_COLOR_OPTIONS.filter((o) => allowed.has(o.value));
  }, [variant.allowed.caseColor]);

  const allowedRgb = useMemo(() => {
    const allowed = new Set(variant.allowed.rgb);
    return RGB_OPTIONS.filter((o) => allowed.has(o.value));
  }, [variant.allowed.rgb]);

  return (
    <div className={cn('space-y-6', className)}>
      <OptionGroup title="Tier">
        <div className="grid grid-cols-3 gap-2">
          {TIER_OPTIONS.map((opt) => {
            const active = selection.tier === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ tier: opt.value })}
                className={cn(
                  'rounded-xl px-3 py-2 text-xs font-semibold border transition-colors',
                  active
                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-100'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </OptionGroup>

      <OptionGroup title="Case model">
        <div className="grid grid-cols-2 gap-2">
          {CASE_MODEL_OPTIONS.map((opt) => {
            const active = selection.caseModel === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ caseModel: opt.value })}
                className={cn(
                  'rounded-xl px-3 py-2 text-xs font-semibold border transition-colors',
                  active
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </OptionGroup>

      <OptionGroup title="Case color">
        <Swatches
          value={selection.caseColor}
          options={allowedCaseColors}
          onChange={(caseColor) => onChange({ caseColor })}
        />
      </OptionGroup>

      <OptionGroup title="Side panel">
        <div className="grid grid-cols-2 gap-2">
          {SIDE_PANEL_OPTIONS.map((opt) => {
            const active = selection.sidePanel === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ sidePanel: opt.value })}
                className={cn(
                  'rounded-xl px-3 py-2 text-xs font-semibold border transition-colors',
                  active
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </OptionGroup>

      <OptionGroup title="RGB profile">
        <div className="flex flex-wrap gap-2">
          {allowedRgb.map((opt) => {
            const active = selection.rgb === opt.value;
            const chip =
              opt.value === 'rainbow'
                ? undefined
                : opt.color;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ rgb: opt.value })}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 border transition-colors',
                  active
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                )}
              >
                {opt.value !== 'off' && (
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-white/20"
                    style={
                      opt.value === 'rainbow'
                        ? { background: 'linear-gradient(90deg,#22c55e,#3b82f6,#a855f7,#ef4444)' }
                        : chip
                          ? { background: chip }
                          : undefined
                    }
                  />
                )}
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </OptionGroup>
    </div>
  );
}


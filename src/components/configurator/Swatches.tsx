'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface SwatchOption<T extends string> {
  value: T;
  label: string;
  /** Optional color preview (CSS color) */
  color?: string;
}

export interface SwatchesProps<T extends string> {
  value: T;
  options: Array<SwatchOption<T>>;
  onChange: (next: T) => void;
  className?: string;
}

export function Swatches<T extends string>({
  value,
  options,
  onChange,
  className,
}: SwatchesProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-3 py-2 border transition-colors',
              active
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            )}
          >
            {opt.color && (
              <span
                className={cn(
                  'inline-block w-3 h-3 rounded-full border border-white/20',
                  active ? 'opacity-100' : 'opacity-80'
                )}
                style={{ background: opt.color }}
              />
            )}
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}


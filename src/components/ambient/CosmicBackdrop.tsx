'use client';

import React from 'react';
import { cn } from '@/lib/cn';

/**
 * Lightweight cosmic background used globally in the root layout.
 * Rendered client-side (dynamic import with ssr:false) to keep server HTML minimal.
 */
export function CosmicBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'fixed inset-0 pointer-events-none -z-10 overflow-hidden',
        className
      )}
    >
      {/* Base */}
      <div className="absolute inset-0 bg-black" />

      {/* Mesh + grid from globals.css */}
      <div className="absolute inset-0 mesh-background opacity-90" />
      <div className="absolute inset-0 cyber-grid opacity-[0.04]" />

      {/* Soft blobs */}
      <div className="absolute -top-48 -left-48 w-[720px] h-[720px] rounded-full bg-purple-600/18 blur-[180px]" />
      <div className="absolute -bottom-52 -right-52 w-[760px] h-[760px] rounded-full bg-fuchsia-600/12 blur-[200px]" />
      <div className="absolute top-[20%] left-[65%] w-[520px] h-[520px] rounded-full bg-purple-500/10 blur-[180px]" />

      {/* Subtle noise */}
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
}


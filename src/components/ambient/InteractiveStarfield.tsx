'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

export interface InteractiveStarfieldProps {
  /** Number of stars to render */
  starCount?: number;
  /** Parallax intensity in pixels (roughly) */
  parallaxStrength?: number;
  className?: string;
}

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  depth: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function InteractiveStarfield({
  starCount = 80,
  parallaxStrength = 12,
  className,
}: InteractiveStarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

    const makeStars = (w: number, h: number) => {
      const next: Star[] = [];
      for (let i = 0; i < starCount; i++) {
        const depth = Math.random(); // 0..1
        next.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.4,
          a: 0.25 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2,
          depth,
        });
      }
      starsRef.current = next;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars(w, h);
    };

    const onMove = (ev: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Normalized -0.5..0.5
      const nx = ev.clientX / w - 0.5;
      const ny = ev.clientY / h - 0.5;
      pointerRef.current.tx = nx;
      pointerRef.current.ty = ny;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Smooth pointer to avoid jitter
      pointerRef.current.x += (pointerRef.current.tx - pointerRef.current.x) * 0.06;
      pointerRef.current.y += (pointerRef.current.ty - pointerRef.current.y) * 0.06;

      const px = pointerRef.current.x * parallaxStrength;
      const py = pointerRef.current.y * parallaxStrength;

      ctx.clearRect(0, 0, w, h);

      for (const s of starsRef.current) {
        const twinkle = 0.65 + 0.35 * Math.sin(t * 0.0012 + s.tw);
        const alpha = s.a * twinkle;
        const ox = px * (0.2 + s.depth);
        const oy = py * (0.2 + s.depth);

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [parallaxStrength, starCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'fixed inset-0 pointer-events-none z-0 opacity-60',
        className
      )}
    />
  );
}


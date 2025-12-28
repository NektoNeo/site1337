'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

// ============================================
// ANIMATION OPTIMIZATION HOOKS
// ============================================
// Performance-focused hooks for:
// 1. useAnimationVisibility - Pause animations when off-screen
// 2. useThrottledMousePosition - RAF-throttled mouse tracking
// 3. useSeededRandom - Consistent random values for animations
// 4. useAnimationPaused - Combined reduced motion + visibility
// ============================================

/**
 * Hook to detect if an element is visible in the viewport
 * and should be animating
 */
export function useAnimationVisibility<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): {
  ref: React.RefObject<T>;
  isVisible: boolean;
  shouldAnimate: boolean;
} {
  const ref = useRef<T>(null!) as React.RefObject<T>;
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '50px', // Start animating slightly before visible
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return {
    ref,
    isVisible,
    shouldAnimate: isVisible && !shouldReduceMotion,
  };
}

/**
 * Hook for RAF-throttled mouse position tracking
 * Prevents excessive re-renders from mousemove events
 */
export function useThrottledMousePosition(enabled: boolean = true): {
  x: number;
  y: number;
  handleMouseMove: (e: React.MouseEvent | MouseEvent) => void;
} {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const pendingPosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!enabled) return;

      pendingPosition.current = { x: e.clientX, y: e.clientY };

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition(pendingPosition.current);
          rafRef.current = null;
        });
      }
    },
    [enabled]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { ...position, handleMouseMove };
}

/**
 * Hook for RAF-throttled global mouse position
 * Useful for particle fields that track mouse globally
 */
export function useGlobalMousePosition(enabled: boolean = true): {
  x: number;
  y: number;
} {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let pendingX = 0;
    let pendingY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition({ x: pendingX, y: pendingY });
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  return position;
}

/**
 * Seeded random number generator for consistent animation values
 * Prevents Math.random() from causing inconsistent animations on re-renders
 */
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Hook to generate stable random values for animations
 * Values are computed once and memoized
 */
export function useSeededRandom(
  seed: number,
  count: number
): number[] {
  return useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: count }, () => random());
  }, [seed, count]);
}

/**
 * Combined hook for checking if animations should be paused
 */
export function useAnimationPaused(): boolean {
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check for battery saver or low power mode if available
    if ('getBattery' in navigator) {
      (navigator as Navigator & { getBattery: () => Promise<{ charging: boolean; level: number }> })
        .getBattery()
        .then((battery) => {
          // Pause animations if battery is low and not charging
          if (battery.level < 0.2 && !battery.charging) {
            setIsPaused(true);
          }
        })
        .catch(() => {
          // Battery API not supported, ignore
        });
    }
  }, []);

  return Boolean(shouldReduceMotion) || isPaused;
}

/**
 * Hook to track mounted state safely
 * Prevents setState on unmounted components
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}

/**
 * Pre-computed particle positions for burst effects
 * Avoids Math.cos/sin calculations during render
 */
export function useParticleBurstPositions(
  count: number,
  radius: number = 40
): Array<{ x: number; y: number }> {
  return useMemo(() => {
    const angleStep = (2 * Math.PI) / count;
    return Array.from({ length: count }, (_, i) => ({
      x: Math.cos(i * angleStep) * radius,
      y: Math.sin(i * angleStep) * radius,
    }));
  }, [count, radius]);
}


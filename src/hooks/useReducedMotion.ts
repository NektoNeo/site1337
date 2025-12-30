'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useDeferredAnimation } from '@/providers/AnimationDeferProvider';

/**
 * Unified "reduced motion" signal used across the UI:
 * - OS/browser prefers-reduced-motion
 * - App-level animation deferral (pre-LCP)
 *
 * This lets components like GlowCard disable expensive cursor-driven effects
 * until the page is ready.
 */
export function useReducedMotion(): boolean {
  const framer = useFramerReducedMotion();
  const { prefersReducedMotion, canAnimate } = useDeferredAnimation();

  return Boolean(framer) || prefersReducedMotion || !canAnimate;
}


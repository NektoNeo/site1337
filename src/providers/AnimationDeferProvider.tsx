'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// ============================================================================
// ANIMATION DEFER PROVIDER
// ============================================================================
// Purpose:
// - Defer non-critical animations until after LCP to protect Core Web Vitals.
// - Respect prefers-reduced-motion by disabling animations.
//
// Usage:
// - Wrap your app (root layout) with <AnimationDeferProvider>.
// - Consume via useDeferredAnimation() and gate heavy/animated UI on canAnimate.
// ============================================================================

export interface DeferredAnimationState {
  /** Whether it's safe to run non-critical animations (post-LCP, not reduced-motion). */
  canAnimate: boolean;
  /** Whether we observed at least one LCP candidate. */
  hasLCP: boolean;
  /** Whether the user requested reduced motion. */
  prefersReducedMotion: boolean;
}

const DeferredAnimationContext = createContext<DeferredAnimationState | null>(
  null
);

export interface AnimationDeferProviderProps {
  children: React.ReactNode;
  /**
   * Extra delay (ms) after the last observed LCP candidate before enabling animations.
   * Useful to avoid enabling during rapid LCP candidate updates.
   */
  enableDelayMs?: number;
  /**
   * Hard-disable animations (debug / emergency switch).
   */
  disableAnimations?: boolean;
}

export function AnimationDeferProvider({
  children,
  enableDelayMs = 200,
  disableAnimations = false,
}: AnimationDeferProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasLCP, setHasLCP] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  const enabledRef = useRef(false);

  // Track prefers-reduced-motion and keep it up to date.
  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(Boolean(mq.matches));

    update();

    // Safari < 14 uses addListener/removeListener
    // TS considers addEventListener always present on MediaQueryList, so we use a
    // runtime check to keep a legacy fallback without tripping control-flow narrowing.
    if (typeof (mq as unknown as { addEventListener?: unknown }).addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      const legacy = mq as unknown as {
        // Safari legacy API (deprecated)
        addListener?: (listener: () => void) => void;
        removeListener?: (listener: () => void) => void;
      };

      legacy.addListener?.(update);
      return () => legacy.removeListener?.(update);
    }
  }, []);

  // Enable animations after LCP (with fallbacks).
  useEffect(() => {
    const blocked = disableAnimations || prefersReducedMotion;

    if (blocked) {
      enabledRef.current = false;
      setCanAnimate(false);
      return;
    }

    let lcpObserver: PerformanceObserver | undefined;
    let quietTimer: number | undefined;
    let fallbackTimer: number | undefined;
    let idleId: number | undefined;

    const enableNow = () => {
      if (enabledRef.current) return;
      enabledRef.current = true;
      setCanAnimate(true);
    };

    const enableWhenIdle = () => {
      // Prefer idle time to avoid impacting main thread during critical rendering.
      const w = window as unknown as {
        requestIdleCallback?: unknown;
      };

      if (typeof w.requestIdleCallback === 'function') {
        idleId = (w.requestIdleCallback as (cb: () => void, opts?: { timeout?: number }) => number)(
          enableNow,
          { timeout: 1000 }
        );
        return;
      }

      window.setTimeout(enableNow, 0);
    };

    const scheduleAfterQuietPeriod = () => {
      if (quietTimer) window.clearTimeout(quietTimer);

      // Wait for LCP candidates to "settle" before enabling animations.
      quietTimer = window.setTimeout(() => {
        setHasLCP(true);
        enableWhenIdle();
      }, Math.max(0, enableDelayMs));
    };

    // Try to observe LCP candidates.
    try {
      if ('PerformanceObserver' in window) {
        lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length === 0) return;
          setHasLCP(true);
          scheduleAfterQuietPeriod();
        });

        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    } catch {
      // Ignore and rely on fallback.
    }

    // Safety fallback: never keep animations disabled forever.
    fallbackTimer = window.setTimeout(() => {
      setHasLCP(true);
      enableWhenIdle();
    }, 4000);

    return () => {
      if (quietTimer) window.clearTimeout(quietTimer);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (idleId && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      lcpObserver?.disconnect();
    };
  }, [disableAnimations, enableDelayMs, prefersReducedMotion]);

  const value = useMemo<DeferredAnimationState>(
    () => ({
      canAnimate: Boolean(canAnimate) && !disableAnimations && !prefersReducedMotion,
      hasLCP,
      prefersReducedMotion,
    }),
    [canAnimate, disableAnimations, hasLCP, prefersReducedMotion]
  );

  return (
    <DeferredAnimationContext.Provider value={value}>
      {children}
    </DeferredAnimationContext.Provider>
  );
}

export function useDeferredAnimation(): DeferredAnimationState {
  const ctx = useContext(DeferredAnimationContext);
  // Fail-safe default if used outside provider (prevents runtime crash)
  return (
    ctx ?? {
      canAnimate: false,
      hasLCP: false,
      prefersReducedMotion: false,
    }
  );
}


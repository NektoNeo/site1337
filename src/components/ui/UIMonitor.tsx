'use client';

/**
 * Global UI Monitor Component
 * 
 * Monitors:
 * - All images on the page
 * - CSS animations
 * - Layout shifts
 * - Visual performance metrics
 */

import { useEffect } from 'react';
import { useUIMonitor } from '@/hooks/useUIMonitor';

const DEBUG_SERVER = 'http://127.0.0.1:7243/ingest/003e9637-21f5-410c-9dc8-026e978b946c';

// #region agent log
const logEvent = (event: {
  location: string;
  message: string;
  data: Record<string, any>;
  timestamp?: number;
  sessionId?: string;
  runId?: string;
  hypothesisId?: string;
}) => {
  if (typeof window === 'undefined') return;
  
  fetch(DEBUG_SERVER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: event.sessionId || 'ui-monitor',
      runId: event.runId || 'monitoring',
    }),
  }).catch(() => {});
};
// #endregion agent log

export function UIMonitor({ enabled = true }: { enabled?: boolean }) {
  const monitor = useUIMonitor(enabled);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Monitor all images on the page
    const images = document.querySelectorAll('img');
    
    images.forEach((img) => {
      const handleLoad = () => {
        // #region agent log
        logEvent({
          location: 'UIMonitor:image-load',
          message: 'Image loaded successfully',
          data: {
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
          },
          hypothesisId: 'H1',
        });
        // #endregion agent log
      };

      const handleError = () => {
        // #region agent log
        logEvent({
          location: 'UIMonitor:image-error',
          message: 'Image failed to load',
          data: {
            src: img.src,
            alt: img.alt,
          },
          hypothesisId: 'H1',
        });
        // #endregion agent log
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
      }

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    });

    // Monitor CSS transitions
    const handleTransitionStart = (e: TransitionEvent) => {
      // #region agent log
      logEvent({
        location: 'UIMonitor:transition-start',
        message: 'CSS transition started',
        data: {
          propertyName: e.propertyName,
          elapsedTime: e.elapsedTime,
          pseudoElement: e.pseudoElement,
          target: (e.target as HTMLElement).tagName.toLowerCase(),
        },
        hypothesisId: 'H2',
      });
      // #endregion agent log
    };

    const handleTransitionEnd = (e: TransitionEvent) => {
      // #region agent log
      logEvent({
        location: 'UIMonitor:transition-end',
        message: 'CSS transition ended',
        data: {
          propertyName: e.propertyName,
          elapsedTime: e.elapsedTime,
          pseudoElement: e.pseudoElement,
          target: (e.target as HTMLElement).tagName.toLowerCase(),
        },
        hypothesisId: 'H2',
      });
      // #endregion agent log
    };

    document.addEventListener('transitionstart', handleTransitionStart);
    document.addEventListener('transitionend', handleTransitionEnd);

    // Monitor visibility changes (page visibility API)
    const handleVisibilityChange = () => {
      // #region agent log
      logEvent({
        location: 'UIMonitor:visibility-change',
        message: 'Page visibility changed',
        data: {
          hidden: document.hidden,
          visibilityState: document.visibilityState,
        },
        hypothesisId: 'H4',
      });
      // #endregion agent log
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Monitor paint timing (FCP, LCP)
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // #region agent log
            logEvent({
              location: 'UIMonitor:paint-timing',
              message: `Paint timing: ${entry.name}`,
              data: {
                name: entry.name,
                startTime: entry.startTime,
                duration: entry.duration,
              },
              hypothesisId: 'H5',
            });
            // #endregion agent log
          }
        });

        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // PerformanceObserver not supported for paint
      }
    }

    return () => {
      document.removeEventListener('transitionstart', handleTransitionStart);
      document.removeEventListener('transitionend', handleTransitionEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return null; // This component doesn't render anything
}

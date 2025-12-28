'use client';

/**
 * Framer Motion Animation Monitor
 * 
 * Wraps Framer Motion components to monitor animation performance
 */

import { useEffect, useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';

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

interface MonitoredMotionProps extends MotionProps {
  animationName?: string;
  children?: React.ReactNode;
}

/**
 * Monitored motion.div wrapper
 * Tracks animation start/end events
 */
export function MonitoredMotionDiv({
  animationName = 'motion-div',
  onAnimationStart,
  onAnimationComplete,
  ...props
}: MonitoredMotionProps) {
  const startTimeRef = useRef<number | null>(null);

  const handleAnimationStart = () => {
    startTimeRef.current = Date.now();
    
    // #region agent log
    logEvent({
      location: 'FramerMotionMonitor:animation-start',
      message: `Framer Motion animation started: ${animationName}`,
      data: {
        animationName,
        timestamp: startTimeRef.current,
      },
      hypothesisId: 'H2',
    });
    // #endregion agent log

    onAnimationStart?.();
  };

  const handleAnimationComplete = () => {
    const duration = startTimeRef.current ? Date.now() - startTimeRef.current : undefined;
    
    // #region agent log
    logEvent({
      location: 'FramerMotionMonitor:animation-complete',
      message: `Framer Motion animation completed: ${animationName}`,
      data: {
        animationName,
        duration,
        timestamp: Date.now(),
      },
      hypothesisId: 'H2',
    });
    // #endregion agent log

    onAnimationComplete?.();
    startTimeRef.current = null;
  };

  return (
    <motion.div
      {...props}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
    />
  );
}

/**
 * Hook to monitor Framer Motion animations
 */
export function useFramerMotionMonitor(animationName: string) {
  const startTimeRef = useRef<number | null>(null);

  const onAnimationStart = () => {
    startTimeRef.current = Date.now();
    
    // #region agent log
    logEvent({
      location: 'useFramerMotionMonitor:start',
      message: `Animation started: ${animationName}`,
      data: { animationName },
      hypothesisId: 'H2',
    });
    // #endregion agent log
  };

  const onAnimationComplete = () => {
    const duration = startTimeRef.current ? Date.now() - startTimeRef.current : undefined;
    
    // #region agent log
    logEvent({
      location: 'useFramerMotionMonitor:complete',
      message: `Animation completed: ${animationName}`,
      data: { animationName, duration },
      hypothesisId: 'H2',
    });
    // #endregion agent log

    startTimeRef.current = null;
  };

  return {
    onAnimationStart,
    onAnimationComplete,
  };
}

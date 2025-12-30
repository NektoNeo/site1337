/**
 * Performance Monitoring Utilities
 * 
 * Core Web Vitals tracking, performance marks, and optimization helpers.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

export interface PerformanceThresholds {
  good: number;
  needsImprovement: number;
}

// ============================================================================
// CORE WEB VITALS THRESHOLDS
// ============================================================================

export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Cumulative Layout Shift
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  // Interaction to Next Paint
  INP: {
    good: 200,
    needsImprovement: 500,
  },
} as const;

// ============================================================================
// RATING CALCULATION
// ============================================================================

/**
 * Get rating for a metric value based on thresholds
 */
export function getRating(
  value: number,
  thresholds: PerformanceThresholds
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// ============================================================================
// PERFORMANCE MARKS
// ============================================================================

/**
 * Mark the start of a performance measurement
 */
export function markStart(name: string): void {
  if (typeof performance !== 'undefined') {
    try {
      performance.mark(`${name}-start`);
    } catch {
      // Ignore errors in unsupported environments
    }
  }
}

/**
 * Mark the end and measure duration
 */
export function markEnd(name: string): number | null {
  if (typeof performance !== 'undefined') {
    try {
      performance.mark(`${name}-end`);
      const measure = performance.measure(
        name,
        `${name}-start`,
        `${name}-end`
      );
      return measure.duration;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Measure a synchronous function's execution time
 */
export function measureSync<T>(name: string, fn: () => T): T {
  markStart(name);
  const result = fn();
  const duration = markEnd(name);
  if (duration !== null && process.env.NODE_ENV === 'development') {
    console.log(`[Perf] ${name}: ${duration.toFixed(2)}ms`);
  }
  return result;
}

/**
 * Measure an async function's execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  markStart(name);
  try {
    const result = await fn();
    const duration = markEnd(name);
    if (duration !== null && process.env.NODE_ENV === 'development') {
      console.log(`[Perf] ${name}: ${duration.toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    markEnd(name);
    throw error;
  }
}

// ============================================================================
// CORE WEB VITALS REPORTING
// ============================================================================

type MetricHandler = (metric: PerformanceMetric) => void;

let metricsHandler: MetricHandler | null = null;

/**
 * Set up Web Vitals reporting
 */
export function setupWebVitalsReporting(handler: MetricHandler): void {
  metricsHandler = handler;
}

/**
 * Report a Web Vital metric
 */
export function reportMetric(metric: PerformanceMetric): void {
  if (metricsHandler) {
    metricsHandler(metric);
  }
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    const emoji = metric.rating === 'good' ? '🟢' : 
                  metric.rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(
      `${emoji} [Web Vital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`
    );
  }
}

/**
 * Web Vitals reporter for Next.js
 * Use in _app.tsx or layout.tsx
 */
export function webVitalsReporter(metric: {
  id: string;
  name: string;
  value: number;
  delta?: number;
}): void {
  const thresholds = WEB_VITALS_THRESHOLDS[metric.name as keyof typeof WEB_VITALS_THRESHOLDS];
  
  if (thresholds) {
    reportMetric({
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.value, thresholds),
      delta: metric.delta,
      id: metric.id,
    });
  }
}

// ============================================================================
// RESOURCE HINTS
// ============================================================================

/**
 * Preload a critical resource
 */
export function preloadResource(
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch',
  options: { crossOrigin?: 'anonymous' | 'use-credentials'; type?: string } = {}
): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`link[href="${href}"][rel="preload"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }
  if (options.type) {
    link.type = options.type;
  }

  document.head.appendChild(link);
}

/**
 * Prefetch a resource for future navigation
 */
export function prefetchResource(href: string): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`link[href="${href}"][rel="prefetch"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Preconnect to an origin
 */
export function preconnect(origin: string, crossOrigin = false): void {
  if (typeof document === 'undefined') return;

  const existing = document.querySelector(`link[href="${origin}"][rel="preconnect"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = origin;
  if (crossOrigin) {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

// ============================================================================
// BUNDLE SIZE ANALYSIS
// ============================================================================

/**
 * Estimate component render cost
 * Use in development to identify slow components
 */
export function estimateRenderCost<T>(
  componentName: string,
  props: T
): { propsSize: number; warning: string | null } {
  const propsSize = JSON.stringify(props).length;
  let warning = null;

  if (propsSize > 10000) {
    warning = `Large props detected in ${componentName}: ${(propsSize / 1024).toFixed(2)}KB. Consider memoization.`;
  }

  return { propsSize, warning };
}

// ============================================================================
// LONG TASK MONITORING
// ============================================================================

/**
 * Monitor long tasks (>50ms) that block the main thread
 */
export function monitorLongTasks(
  callback: (duration: number, attribution?: string) => void
): () => void {
  if (typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Attribution is available in some browsers
        const attribution = (entry as PerformanceEntry & { attribution?: { name?: string }[] })
          .attribution?.[0]?.name;
        callback(entry.duration, attribution);
      }
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  } catch {
    return () => {};
  }
}

// ============================================================================
// MEMORY MONITORING
// ============================================================================

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/**
 * Get current memory usage (Chrome only)
 */
export function getMemoryUsage(): MemoryInfo | null {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    return (performance as Performance & { memory: MemoryInfo }).memory;
  }
  return null;
}

/**
 * Check if memory usage is high
 */
export function isMemoryPressure(): boolean {
  const memory = getMemoryUsage();
  if (!memory) return false;
  
  const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  return usageRatio > 0.8;
}

// ============================================================================
// NETWORK MONITORING
// ============================================================================

interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

/**
 * Get network information if available
 */
export function getNetworkInfo(): NetworkInfo | null {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as Navigator & { connection: NetworkInfo }).connection;
    return connection;
  }
  return null;
}

/**
 * Check if user has slow connection
 */
export function isSlowConnection(): boolean {
  const network = getNetworkInfo();
  if (!network) return false;
  
  return (
    network.saveData ||
    network.effectiveType === '2g' ||
    network.effectiveType === 'slow-2g' ||
    network.rtt > 500
  );
}

/**
 * Get appropriate image quality based on network
 */
export function getAdaptiveImageQuality(): number {
  if (isSlowConnection()) {
    return 60; // Lower quality for slow connections
  }
  return 85; // Default quality
}

// ============================================================================
// INTERACTION OBSERVER
// ============================================================================

/**
 * Track time to interactive for a component
 */
export function trackTimeToInteractive(
  componentName: string,
  onInteractive: () => void
): { markInteractive: () => void } {
  const startTime = performance.now();

  return {
    markInteractive: () => {
      const duration = performance.now() - startTime;
      onInteractive();

      if (process.env.NODE_ENV === 'development') {
        console.log(`[TTI] ${componentName}: ${duration.toFixed(2)}ms`);
      }
    },
  };
}

// ============================================================================
// ANIMATION OPTIMIZATION
// ============================================================================

/**
 * Animation priority levels for performance budgeting
 * Use lower priority for less critical animations
 */
export const animationPriority = {
  critical: { duration: 0.3, ease: 'easeOut' },
  high: { duration: 0.4, ease: 'easeOut' },
  normal: { duration: 0.5, ease: 'easeInOut' },
  low: { duration: 0.6, ease: 'easeInOut' },
  background: { duration: 1, ease: 'linear' },
} as const;

/**
 * Creates a throttled function that only executes once per animation frame
 * Useful for scroll handlers and resize listeners
 */
export function rafThrottle<T extends (...args: unknown[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let requestId: number | null = null;

  return function throttled(...args: Parameters<T>) {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback.apply(null, args);
        requestId = null;
      });
    }
  };
}

/**
 * Debounce function for search inputs and other user interactions
 */
export function debounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), delay);
  };
}

// ============================================================================
// IMAGE OPTIMIZATION HELPERS
// ============================================================================

/**
 * Generates sizes attribute for responsive images
 * Common patterns for typical layouts
 */
export const imageSizesPresets = {
  // Full width on mobile, half on tablet, third on desktop
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  // Full width always
  hero: '100vw',
  // Fixed width image
  thumbnail: '(max-width: 640px) 50vw, 200px',
  // Gallery grid
  gallery: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  // Product card
  productCard: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
} as const;

/**
 * Check if the browser supports modern image formats
 */
export function supportsAvif(): boolean {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
}

export function supportsWebp(): boolean {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpg' {
  if (supportsAvif()) return 'avif';
  if (supportsWebp()) return 'webp';
  return 'jpg';
}

// ============================================================================
// LAZY LOADING OPTIONS
// ============================================================================

/**
 * Create intersection observer options for lazy loading
 */
export const lazyLoadOptions = {
  // Load when 100px from viewport
  eager: { rootMargin: '100px', threshold: 0 },
  // Load when 200px from viewport (default)
  normal: { rootMargin: '200px', threshold: 0 },
  // Load when 500px from viewport
  aggressive: { rootMargin: '500px', threshold: 0 },
} as const;

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

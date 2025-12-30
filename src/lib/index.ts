/**
 * Library Utilities Index
 *
 * Central export for all performance and optimization utilities.
 */

// Core utilities - only cn from './cn', not './utils' to avoid duplicate
export { cn } from './cn';

// Performance utilities
export * from './image-optimization';
export * from './cache';
export * from './memoization';
// Re-export performance.ts but exclude debounce (already exported from memoization)
export {
  WEB_VITALS_THRESHOLDS,
  getRating,
  markStart,
  markEnd,
  measureSync,
  measureAsync,
  setupWebVitalsReporting,
  reportMetric,
  webVitalsReporter,
  preloadResource,
  prefetchResource,
  preconnect,
  estimateRenderCost,
  monitorLongTasks,
  getMemoryUsage,
  isMemoryPressure,
  getNetworkInfo,
  isSlowConnection,
  getAdaptiveImageQuality,
  trackTimeToInteractive,
  animationPriority,
  rafThrottle,
  imageSizesPresets,
  supportsAvif,
  supportsWebp,
  getOptimalImageFormat,
  lazyLoadOptions,
  prefersReducedMotion,
  type PerformanceMetric,
  type PerformanceThresholds,
} from './performance';

// React Query
export {
  QueryProvider,
  queryKeys,
  staleTimes,
  invalidateProducts,
  invalidateCategories,
  prefetchProducts,
  prefetchProduct,
  getCachedProduct,
  setCachedProduct,
} from './query-client';

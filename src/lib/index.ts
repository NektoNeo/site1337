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
export * from './performance';

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

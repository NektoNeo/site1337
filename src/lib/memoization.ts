/**
 * Memoization Patterns for Performance Optimization
 * 
 * High-performance memoization utilities for React components,
 * especially useful for the PC Configurator's heavy computations.
 */

import { useMemo, useCallback, useRef, useEffect, DependencyList } from 'react';

// ============================================================================
// TYPES
// ============================================================================

type AnyFunction = (...args: unknown[]) => unknown;

interface MemoizedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): ReturnType<T>;
  cache: Map<string, ReturnType<T>>;
  clear: () => void;
}

interface LRUCacheOptions {
  maxSize: number;
  onEvict?: (key: string, value: unknown) => void;
}

// ============================================================================
// BASIC MEMOIZATION
// ============================================================================

/**
 * Create a memoized version of a function
 * Uses JSON.stringify for cache key generation
 */
export function memoize<T extends AnyFunction>(
  fn: T,
  maxCacheSize = 100
): MemoizedFunction<T> {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args) as ReturnType<T>;

    // LRU eviction - remove oldest entry if at capacity
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as MemoizedFunction<T>;

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

/**
 * Memoize with custom key generator
 */
export function memoizeWithKey<T extends AnyFunction>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string,
  maxCacheSize = 100
): MemoizedFunction<T> {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args) as ReturnType<T>;

    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as MemoizedFunction<T>;

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

// ============================================================================
// LRU CACHE
// ============================================================================

/**
 * Least Recently Used (LRU) Cache implementation
 * Maintains order of access for optimal eviction
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;
  private onEvict?: (key: K, value: V) => void;

  constructor(options: LRUCacheOptions | number) {
    if (typeof options === 'number') {
      this.maxSize = options;
    } else {
      this.maxSize = options.maxSize;
      this.onEvict = options.onEvict as (key: K, value: V) => void;
    }
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    // Delete if exists (will be re-added at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        const oldestValue = this.cache.get(oldestKey);
        this.cache.delete(oldestKey);
        if (this.onEvict && oldestValue !== undefined) {
          this.onEvict(oldestKey, oldestValue);
        }
      }
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  values(): IterableIterator<V> {
    return this.cache.values();
  }

  entries(): IterableIterator<[K, V]> {
    return this.cache.entries();
  }
}

// ============================================================================
// REACT HOOKS FOR MEMOIZATION
// ============================================================================

/**
 * useMemoCompare - Memoize with custom comparison function
 * Useful when deps include objects that change reference but not value
 */
export function useMemoCompare<T>(
  factory: () => T,
  deps: DependencyList,
  compare: (prev: DependencyList | undefined, next: DependencyList) => boolean
): T {
  const ref = useRef<{ deps: DependencyList; value: T }>();

  const depsChanged = !ref.current || !compare(ref.current.deps, deps);

  if (depsChanged) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  // ref.current is guaranteed to be defined after the if block
  return ref.current!.value;
}

/**
 * useStableCallback - Returns a stable callback that always calls the latest version
 * Prevents unnecessary re-renders when passing callbacks to memoized children
 */
export function useStableCallback<T extends AnyFunction>(callback: T): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * useDebouncedValue - Debounce a value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Need to import React for useState
import * as React from 'react';

/**
 * useThrottledValue - Throttle a value
 */
export function useThrottledValue<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, interval - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * usePreviousValue - Get the previous value of a variable
 */
export function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================================================
// CONFIGURATOR-SPECIFIC MEMOIZATION
// ============================================================================

/**
 * Memoized compatibility check cache
 * Key is stringified component selection
 */
const compatibilityCache = new LRUCache<string, CompatibilityResult>(50);

interface CompatibilityResult {
  isCompatible: boolean;
  warnings: Array<{
    type: 'error' | 'warning';
    message: string;
    components: string[];
  }>;
}

/**
 * Memoized component compatibility checker
 * Caches results to avoid recalculating on every render
 */
export function getCachedCompatibility(
  components: Record<string, unknown | null>,
  checkFn: (components: Record<string, unknown | null>) => CompatibilityResult
): CompatibilityResult {
  // Create stable key from selected component IDs
  const key = Object.entries(components)
    .filter(([, v]) => v !== null)
    .map(([k, v]) => `${k}:${(v as { id?: string })?.id || 'unknown'}`)
    .sort()
    .join('|');

  const cached = compatibilityCache.get(key);
  if (cached) return cached;

  const result = checkFn(components);
  compatibilityCache.set(key, result);
  return result;
}

/**
 * Memoized power calculation
 */
const powerCalculationCache = new LRUCache<string, number>(100);

type PowerComponents = Record<string, { specs?: { tdp?: number; wattage?: number } } | null>;

export function getCachedPowerCalculation(
  components: PowerComponents,
  calculateFn: (components: PowerComponents) => number
): number {
  const key = Object.entries(components)
    .filter(([, v]) => v !== null)
    .map(([k, v]) => `${k}:${v?.specs?.tdp || v?.specs?.wattage || 0}`)
    .sort()
    .join('|');

  const cached = powerCalculationCache.get(key);
  if (cached !== undefined) return cached;

  const result = calculateFn(components);
  powerCalculationCache.set(key, result);
  return result;
}

// ============================================================================
// EXPENSIVE COMPUTATION HELPERS
// ============================================================================

/**
 * Chunk expensive operations to avoid blocking main thread
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize = 50,
  delay = 0
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = chunk.map(processor);
    results.push(...chunkResults);

    // Yield to main thread
    if (delay > 0 && i + chunkSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}

/**
 * Use requestIdleCallback for non-critical computations
 */
export function scheduleIdleTask(task: () => void, timeout = 5000): void {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(
      () => {
        try {
          task();
        } catch (error) {
          console.error('Idle task error:', error);
        }
      },
      { timeout }
    );
  } else {
    // Fallback for Safari
    setTimeout(task, 1);
  }
}

/**
 * Debounce function
 */
export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends AnyFunction>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const elapsed = now - lastRun;

    if (elapsed >= interval) {
      fn(...args);
      lastRun = now;
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        fn(...args);
        lastRun = Date.now();
        timeoutId = null;
      }, interval - elapsed);
    }
  };
}

// ============================================================================
// CLEAR ALL CACHES
// ============================================================================

/**
 * Clear all memoization caches
 * Useful for testing or when data becomes stale
 */
export function clearAllMemoizationCaches(): void {
  compatibilityCache.clear();
  powerCalculationCache.clear();
}

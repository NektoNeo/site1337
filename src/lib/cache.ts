/**
 * API Response Caching Utilities
 * 
 * Server-side and client-side caching patterns for optimal performance.
 * Implements stale-while-revalidate, request deduplication, and cache invalidation.
 */

import { cache } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  /** Time to live in milliseconds */
  ttl: number;
  /** Stale time - when to revalidate in background */
  staleTime?: number;
  /** Cache key prefix */
  prefix?: string;
}

export interface FetchCacheOptions extends CacheOptions {
  /** Force revalidation */
  forceRefresh?: boolean;
  /** Abort signal */
  signal?: AbortSignal;
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const CACHE_TIMES = {
  /** 30 seconds - for rapidly changing data */
  SHORT: 30 * 1000,
  /** 5 minutes - for products list */
  MEDIUM: 5 * 60 * 1000,
  /** 1 hour - for categories and static data */
  LONG: 60 * 60 * 1000,
  /** 24 hours - for rarely changing data */
  DAY: 24 * 60 * 60 * 1000,
} as const;

export const STALE_TIMES = {
  /** 1 minute - check frequently */
  AGGRESSIVE: 60 * 1000,
  /** 5 minutes - default for most data */
  NORMAL: 5 * 60 * 1000,
  /** 30 minutes - for stable data */
  RELAXED: 30 * 60 * 1000,
} as const;

// ============================================================================
// IN-MEMORY CACHE (Client-side)
// ============================================================================

class MemoryCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  set(key: string, data: T, ttl: number): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  isStale(key: string, staleTime: number): boolean {
    const entry = this.cache.get(key);
    if (!entry) return true;
    return Date.now() - entry.timestamp > staleTime;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clear entries matching a pattern
  clearPattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// ============================================================================
// REQUEST DEDUPLICATION
// ============================================================================

/**
 * Deduplicate concurrent requests for the same resource
 * Prevents multiple identical API calls from running simultaneously
 */
class RequestDeduplicator {
  private pending = new Map<string, Promise<unknown>>();

  async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    // Check if request is already in flight
    const existing = this.pending.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    // Create new request
    const promise = fetcher()
      .finally(() => {
        // Clean up after request completes
        this.pending.delete(key);
      });

    this.pending.set(key, promise);
    return promise;
  }

  hasPending(key: string): boolean {
    return this.pending.has(key);
  }

  clear(): void {
    this.pending.clear();
  }
}

export const requestDeduplicator = new RequestDeduplicator();

// ============================================================================
// STALE-WHILE-REVALIDATE PATTERN
// ============================================================================

/**
 * Fetch with stale-while-revalidate caching strategy
 * Returns cached data immediately while revalidating in background
 */
export async function fetchWithSWR<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: FetchCacheOptions = { ttl: CACHE_TIMES.MEDIUM }
): Promise<T> {
  const { ttl, staleTime = ttl / 2, forceRefresh = false } = options;

  // Force refresh - skip cache entirely
  if (forceRefresh) {
    const data = await requestDeduplicator.dedupe(key, fetcher);
    memoryCache.set(key, data, ttl);
    return data;
  }

  // Check cache
  const cached = memoryCache.get(key) as T | undefined;

  if (cached !== undefined) {
    // If data is stale, revalidate in background
    if (memoryCache.isStale(key, staleTime)) {
      // Fire and forget - don't await
      requestDeduplicator
        .dedupe(key, fetcher)
        .then((data) => memoryCache.set(key, data, ttl))
        .catch(console.error);
    }
    return cached;
  }

  // No cache - fetch fresh data
  const data = await requestDeduplicator.dedupe(key, fetcher);
  memoryCache.set(key, data, ttl);
  return data;
}

// ============================================================================
// REACT SERVER COMPONENT CACHING
// ============================================================================

/**
 * Create a cached fetcher function using React's cache()
 * Automatically deduplicates requests within a single render pass
 * 
 * @example
 * const getUser = createCachedFetcher(
 *   (id: string) => `user-${id}`,
 *   (id: string) => fetch(`/api/users/${id}`).then(r => r.json())
 * );
 * 
 * // In component - these will be deduplicated
 * const user1 = await getUser('123');
 * const user2 = await getUser('123'); // Same request, cached
 */
export function createCachedFetcher<TArgs extends unknown[], TResult>(
  keyFn: (...args: TArgs) => string,
  fetcher: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult> {
  // Use React's cache() for request-level deduplication
  const cachedFetcher = cache(fetcher);
  return cachedFetcher;
}

// ============================================================================
// CACHE KEY GENERATORS
// ============================================================================

/**
 * Generate cache key for products list
 */
export function productsListKey(params: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  priceFrom?: number;
  priceTo?: number;
}): string {
  const parts = ['products'];
  
  if (params.categoryId) parts.push(`cat:${params.categoryId}`);
  if (params.search) parts.push(`q:${params.search}`);
  if (params.sortBy) parts.push(`sort:${params.sortBy}`);
  if (params.priceFrom) parts.push(`pf:${params.priceFrom}`);
  if (params.priceTo) parts.push(`pt:${params.priceTo}`);
  if (params.page) parts.push(`p:${params.page}`);
  if (params.pageSize) parts.push(`ps:${params.pageSize}`);

  return parts.join('-');
}

/**
 * Generate cache key for single product
 */
export function productDetailKey(id: string, includeRelated = false): string {
  return `product-${id}${includeRelated ? '-related' : ''}`;
}

/**
 * Generate cache key for categories
 */
export function categoriesKey(): string {
  return 'categories';
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

/**
 * Invalidate product-related caches
 */
export function invalidateProductCaches(): void {
  memoryCache.clearPattern(/^products?-/);
}

/**
 * Invalidate category caches
 */
export function invalidateCategoryCaches(): void {
  memoryCache.clearPattern(/^categor/);
}

/**
 * Invalidate all caches
 */
export function invalidateAllCaches(): void {
  memoryCache.clear();
}

// ============================================================================
// API FETCH WITH CACHING
// ============================================================================

/**
 * Fetch from API with built-in caching
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit & FetchCacheOptions = { ttl: CACHE_TIMES.MEDIUM }
): Promise<T> {
  const { ttl, staleTime, forceRefresh, signal, ...fetchOptions } = options;
  const cacheKey = `fetch:${url}:${JSON.stringify(fetchOptions)}`;

  return fetchWithSWR(
    cacheKey,
    async () => {
      const response = await fetch(url, { ...fetchOptions, signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    { ttl, staleTime, forceRefresh }
  );
}

// ============================================================================
// PRELOADING UTILITIES
// ============================================================================

/**
 * Preload data into cache before it's needed
 * Useful for anticipating user navigation
 */
export function preloadToCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TIMES.MEDIUM
): void {
  // Don't preload if already cached
  if (memoryCache.has(key)) return;

  // Fetch in background
  requestDeduplicator
    .dedupe(key, fetcher)
    .then((data) => memoryCache.set(key, data, ttl))
    .catch(() => {
      // Silently fail - preloading is best-effort
    });
}

/**
 * Preload product details (useful on hover)
 */
export function preloadProduct(productId: string): void {
  const key = productDetailKey(productId);
  preloadToCache(
    key,
    () => fetch(`/api/products/${productId}`).then((r) => r.json()),
    CACHE_TIMES.MEDIUM
  );
}

/**
 * Preload products list for a category
 */
export function preloadCategory(categoryId: string): void {
  const key = productsListKey({ categoryId });
  preloadToCache(
    key,
    () => fetch(`/api/products?categoryId=${categoryId}`).then((r) => r.json()),
    CACHE_TIMES.MEDIUM
  );
}

// ============================================================================
// HTTP CACHE HEADERS HELPERS
// ============================================================================

/**
 * Generate Cache-Control header value
 */
export function getCacheControlHeader(options: {
  public?: boolean;
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
  immutable?: boolean;
}): string {
  const parts: string[] = [];

  if (options.public) parts.push('public');
  if (options.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`);
  if (options.sMaxAge !== undefined) parts.push(`s-maxage=${options.sMaxAge}`);
  if (options.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }
  if (options.staleIfError !== undefined) {
    parts.push(`stale-if-error=${options.staleIfError}`);
  }
  if (options.immutable) parts.push('immutable');

  return parts.join(', ');
}

/**
 * Common cache control presets
 */
export const CACHE_HEADERS = {
  /** No caching at all */
  NO_STORE: 'no-store, no-cache, must-revalidate',
  /** Private cache only (browser, not CDN) */
  PRIVATE: 'private, max-age=0, must-revalidate',
  /** Public, 5 minutes with SWR */
  SHORT: getCacheControlHeader({
    public: true,
    sMaxAge: 300,
    staleWhileRevalidate: 60,
  }),
  /** Public, 1 hour with SWR */
  MEDIUM: getCacheControlHeader({
    public: true,
    sMaxAge: 3600,
    staleWhileRevalidate: 300,
  }),
  /** Public, 1 day, immutable */
  LONG: getCacheControlHeader({
    public: true,
    maxAge: 86400,
    sMaxAge: 86400,
    immutable: true,
  }),
  /** Static assets - 1 year immutable */
  STATIC: getCacheControlHeader({
    public: true,
    maxAge: 31536000,
    immutable: true,
  }),
} as const;

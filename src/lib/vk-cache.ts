/**
 * VK API Server-Side Cache
 *
 * In-memory cache with TTL for VK API responses.
 * Prevents rate limiting and improves response times.
 *
 * Features:
 * - TTL-based expiration
 * - Automatic cleanup of stale entries
 * - Cache key generation helpers
 * - Singleton pattern for consistent state
 * - Request deduplication to prevent thundering herd
 *
 * @module src/lib/vk-cache
 */

// ============================================================================
// TYPES
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  hitCount: number;
}

/**
 * Pending request for deduplication
 */
interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Cache TTL presets in milliseconds
 */
export const VK_CACHE_TTL = {
  /** 1 minute - for rapidly changing data */
  VERY_SHORT: 60 * 1000,
  /** 5 minutes - default for products list */
  SHORT: 5 * 60 * 1000,
  /** 15 minutes - for product details */
  MEDIUM: 15 * 60 * 1000,
  /** 1 hour - for categories/albums */
  LONG: 60 * 60 * 1000,
  /** 6 hours - for static content */
  VERY_LONG: 6 * 60 * 60 * 1000,
} as const;

// ============================================================================
// VK CACHE CLASS
// ============================================================================

class VKCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private pendingRequests: Map<string, PendingRequest<unknown>> = new Map();
  private hits = 0;
  private misses = 0;
  private dedupeHits = 0; // Track deduplication effectiveness
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly maxSize: number;
  private readonly maxPendingAge = 30000; // 30 seconds max for pending requests

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
    this.startCleanupInterval();
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanupInterval(): void {
    // Clean up every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);

    // Don't block Node.js from exiting
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Stop the cleanup interval
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Remove expired entries from cache and stale pending requests
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    // Also clean up stale pending requests
    this.cleanupPendingRequests();

    return removed;
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Update hit count
    entry.hitCount++;
    this.hits++;

    return entry.data;
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, data: T, ttl: number = VK_CACHE_TTL.SHORT): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      hitCount: 0,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries and pending requests
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    this.hits = 0;
    this.misses = 0;
    this.dedupeHits = 0;
  }

  /**
   * Clear entries matching a pattern
   */
  clearPattern(pattern: string | RegExp): number {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    let removed = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Evict the oldest (least recently used) entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { dedupeHits: number; pendingRequests: number } {
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    for (const entry of this.cache.values()) {
      if (oldestEntry === null || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (newestEntry === null || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    const total = this.hits + this.misses;

    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      oldestEntry,
      newestEntry,
      dedupeHits: this.dedupeHits,
      pendingRequests: this.pendingRequests.size,
    };
  }

  /**
   * Get or fetch with caching and request deduplication
   * If cached value exists and is valid, returns it.
   * If a request for this key is already in-flight, returns the pending promise.
   * Otherwise, calls fetcher and caches the result.
   *
   * This prevents the "thundering herd" problem when cache expires
   * and multiple requests try to refresh simultaneously.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = VK_CACHE_TTL.SHORT
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key) as PendingRequest<T> | undefined;
    if (pending) {
      // Check if pending request is still valid (not too old)
      const age = Date.now() - pending.timestamp;
      if (age < this.maxPendingAge) {
        this.dedupeHits++;
        return pending.promise;
      }
      // Stale pending request, remove it
      this.pendingRequests.delete(key);
    }

    // Create new request and track it
    const promise = this.executeAndCache<T>(key, fetcher, ttl);
    this.pendingRequests.set(key, { promise, timestamp: Date.now() });

    return promise;
  }

  /**
   * Execute fetcher and cache result, cleaning up pending request on completion
   */
  private async executeAndCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    try {
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    } finally {
      // Always clean up the pending request
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Get the number of pending requests (useful for monitoring)
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * Clean up stale pending requests
   */
  private cleanupPendingRequests(): void {
    const now = Date.now();
    for (const [key, pending] of this.pendingRequests.entries()) {
      if (now - pending.timestamp > this.maxPendingAge) {
        this.pendingRequests.delete(key);
      }
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Global cache instance (survives hot reloads in development)
const globalForCache = globalThis as unknown as {
  vkCache: VKCache | undefined;
};

export const vkCache = globalForCache.vkCache ?? new VKCache();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.vkCache = vkCache;
}

// ============================================================================
// CACHE KEY GENERATORS
// ============================================================================

/**
 * Generate cache key for VK products list
 */
export function vkProductsKey(params: {
  page?: number;
  pageSize?: number;
  categoryId?: string | number;
  search?: string;
  sortBy?: string;
  priceFrom?: number;
  priceTo?: number;
}): string {
  const parts = ['vk:products'];

  if (params.categoryId) parts.push(`cat:${params.categoryId}`);
  if (params.search) parts.push(`q:${encodeURIComponent(params.search)}`);
  if (params.sortBy) parts.push(`sort:${params.sortBy}`);
  if (params.priceFrom) parts.push(`pf:${params.priceFrom}`);
  if (params.priceTo) parts.push(`pt:${params.priceTo}`);
  if (params.page) parts.push(`p:${params.page}`);
  if (params.pageSize) parts.push(`ps:${params.pageSize}`);

  return parts.join(':');
}

/**
 * Generate cache key for single VK product
 */
export function vkProductKey(productId: string | number): string {
  return `vk:product:${productId}`;
}

/**
 * Generate cache key for VK albums/categories
 */
export function vkCategoriesKey(): string {
  return 'vk:categories:all';
}

/**
 * Generate cache key for VK album products
 */
export function vkAlbumProductsKey(albumId: string | number): string {
  return `vk:album:${albumId}:products`;
}

// ============================================================================
// CACHE INVALIDATION HELPERS
// ============================================================================

/**
 * Invalidate all VK product caches
 */
export function invalidateVKProductCaches(): number {
  return vkCache.clearPattern(/^vk:product/);
}

/**
 * Invalidate all VK category caches
 */
export function invalidateVKCategoryCaches(): number {
  return vkCache.clearPattern(/^vk:(categories|album)/);
}

/**
 * Invalidate all VK caches
 */
export function invalidateAllVKCaches(): void {
  vkCache.clearPattern(/^vk:/);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default vkCache;

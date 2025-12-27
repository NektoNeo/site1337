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
  private hits = 0;
  private misses = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly maxSize: number;

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
   * Remove expired entries from cache
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
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
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
  getStats(): CacheStats {
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
    };
  }

  /**
   * Get or fetch with caching
   * If cached value exists and is valid, returns it.
   * Otherwise, calls fetcher and caches the result.
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

    // Fetch fresh data
    const data = await fetcher();
    
    // Cache the result
    this.set(key, data, ttl);
    
    return data;
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

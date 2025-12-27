/**
 * Caching Layer for Database Access
 * In-memory cache with TTL support and optional Redis upgrade path
 *
 * @module src/lib/db/cache
 *
 * Performance characteristics:
 * - In-memory cache: O(1) get/set, limited by process memory
 * - LRU eviction when max entries exceeded
 * - Prefix-based invalidation for related cache entries
 *
 * For production scaling, consider:
 * 1. Redis for distributed caching (multi-instance deployments)
 * 2. Memcached for simple key-value caching
 * 3. Cloudflare KV for edge caching
 */

// ============================================================================
// TYPES
// ============================================================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

interface CacheConfig {
  maxEntries: number;
  defaultTTL: number;
  cleanupInterval: number;
  enableStats: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: CacheConfig = {
  maxEntries: 10000,           // Maximum number of cache entries
  defaultTTL: 5 * 60 * 1000,   // 5 minutes default TTL
  cleanupInterval: 60 * 1000,  // Cleanup expired entries every minute
  enableStats: true,           // Enable hit/miss statistics
};

// ============================================================================
// CACHE IMPLEMENTATION
// ============================================================================

class InMemoryCache {
  private cache: Map<string, CacheEntry<unknown>>;
  private config: CacheConfig;
  private stats: { hits: number; misses: number };
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = { hits: 0, misses: 0 };

    // Start cleanup timer
    if (typeof setInterval !== 'undefined') {
      this.startCleanup();
    }
  }

  /**
   * Get a value from cache
   * Returns undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      if (this.config.enableStats) this.stats.misses++;
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      if (this.config.enableStats) this.stats.misses++;
      return undefined;
    }

    if (this.config.enableStats) this.stats.hits++;
    return entry.value as T;
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl: number = this.config.defaultTTL): void {
    // Check if we need to evict entries (LRU-like behavior)
    if (this.cache.size >= this.config.maxEntries) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete all keys matching a prefix
   * Useful for invalidating related cache entries
   *
   * @example
   * invalidatePrefix('products:') // Invalidates all product list caches
   */
  invalidatePrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }

  /**
   * Check if a key exists and is not expired
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
   * Get remaining TTL for a key in milliseconds
   */
  getTTL(key: string): number {
    const entry = this.cache.get(key);
    if (!entry) return -1;

    const remaining = entry.expiresAt - Date.now();
    if (remaining <= 0) {
      this.cache.delete(key);
      return -1;
    }

    return remaining;
  }

  /**
   * Get all keys matching a pattern
   */
  keys(pattern?: string): string[] {
    const allKeys = Array.from(this.cache.keys());
    if (!pattern) return allKeys;
    return allKeys.filter((key) => key.includes(pattern));
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    // Find and remove oldest 10% of entries
    const entriesToRemove = Math.max(1, Math.floor(this.cache.size * 0.1));
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].createdAt - b[1].createdAt)
      .slice(0, entriesToRemove);

    for (const [key] of entries) {
      this.cache.delete(key);
    }
  }

  /**
   * Remove expired entries periodically
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Start periodic cleanup
   */
  private startCleanup(): void {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);

    // Ensure cleanup timer doesn't prevent process exit
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Stop periodic cleanup (for graceful shutdown)
   */
  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Global cache instance (survives hot reloads in development)
const globalForCache = globalThis as unknown as {
  __cache: InMemoryCache | undefined;
};

const cache = globalForCache.__cache ?? new InMemoryCache();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.__cache = cache;
}

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

/**
 * Get a value from cache
 *
 * @example
 * const products = getCache<ProductWithRelations[]>('products:featured');
 */
export function getCache<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

/**
 * Set a value in cache
 *
 * @example
 * setCache('products:featured', products, 5 * 60 * 1000); // 5 minutes TTL
 */
export function setCache<T>(key: string, value: T, ttl?: number): void {
  cache.set(key, value, ttl);
}

/**
 * Delete a specific key
 *
 * @example
 * deleteCache('product:prod-123');
 */
export function deleteCache(key: string): boolean {
  return cache.delete(key);
}

/**
 * Invalidate all keys matching a prefix
 *
 * @example
 * invalidateCache('products:'); // Invalidates all product list caches
 */
export function invalidateCache(prefix: string): number {
  return cache.invalidatePrefix(prefix);
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache statistics
 *
 * @example
 * const stats = getCacheStats();
 * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
 */
export function getCacheStats(): CacheStats {
  return cache.getStats();
}

/**
 * Check if key exists in cache
 */
export function hasCache(key: string): boolean {
  return cache.has(key);
}

/**
 * Get remaining TTL in milliseconds
 */
export function getCacheTTL(key: string): number {
  return cache.getTTL(key);
}

// ============================================================================
// CACHE DECORATORS (Utility Patterns)
// ============================================================================

/**
 * Wrapper function for caching async function results
 *
 * @example
 * const getProductsCached = withCache(
 *   'products:all',
 *   () => prisma.product.findMany(),
 *   5 * 60 * 1000
 * );
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = getCache<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  const result = await fn();
  setCache(key, result, ttl);
  return result;
}

/**
 * Cache-aside pattern with stale-while-revalidate
 *
 * Returns cached value immediately (if available) and revalidates in background
 * Perfect for data that can be slightly stale
 *
 * @example
 * const products = await cacheAside(
 *   'products:featured',
 *   () => prisma.product.findMany({ where: { isFeatured: true } }),
 *   5 * 60 * 1000,  // 5 min cache
 *   60 * 1000       // 1 min stale time
 * );
 */
export async function cacheAside<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number,
  staleTime: number = 0
): Promise<T> {
  const cached = getCache<T>(key);
  const remainingTTL = getCacheTTL(key);

  // If cached and not stale, return immediately
  if (cached !== undefined && remainingTTL > staleTime) {
    return cached;
  }

  // If cached but stale, return cached and revalidate in background
  if (cached !== undefined) {
    // Fire-and-forget revalidation
    fn().then((result) => {
      setCache(key, result, ttl);
    }).catch((error) => {
      console.error(`Cache revalidation failed for key ${key}:`, error);
    });

    return cached;
  }

  // Not cached, fetch and cache
  const result = await fn();
  setCache(key, result, ttl);
  return result;
}

// ============================================================================
// REDIS UPGRADE PATH (Future Implementation)
// ============================================================================

/**
 * Redis cache implementation placeholder
 *
 * To upgrade to Redis:
 * 1. Install: npm install ioredis
 * 2. Replace InMemoryCache with RedisCache implementation
 * 3. Update connection string in environment
 *
 * Example Redis implementation:
 *
 * import Redis from 'ioredis';
 *
 * class RedisCache {
 *   private redis: Redis;
 *
 *   constructor(url: string) {
 *     this.redis = new Redis(url);
 *   }
 *
 *   async get<T>(key: string): Promise<T | undefined> {
 *     const value = await this.redis.get(key);
 *     return value ? JSON.parse(value) : undefined;
 *   }
 *
 *   async set<T>(key: string, value: T, ttl: number): Promise<void> {
 *     await this.redis.setex(key, Math.floor(ttl / 1000), JSON.stringify(value));
 *   }
 *
 *   async delete(key: string): Promise<boolean> {
 *     return (await this.redis.del(key)) > 0;
 *   }
 *
 *   async invalidatePrefix(prefix: string): Promise<number> {
 *     const keys = await this.redis.keys(`${prefix}*`);
 *     if (keys.length === 0) return 0;
 *     return await this.redis.del(...keys);
 *   }
 * }
 */

export default cache;

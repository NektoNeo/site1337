// ============================================
// NETWORK OPTIMIZATION UTILITIES
// ============================================
// Features:
// 1. Prefetch critical resources
// 2. Combine API calls
// 3. Request deduplication
// 4. Stale-while-revalidate patterns
// ============================================

import { Product } from '@/types/product';

// Request cache for deduplication
const requestCache = new Map<string, Promise<unknown>>();
const CACHE_TTL = 60 * 1000; // 1 minute

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const dataCache = new Map<string, CacheEntry<unknown>>();

// Deduplicated fetch wrapper
export async function deduplicatedFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  // Check if request is already in flight
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey) as Promise<T>;
  }

  // Check data cache
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  // Create new request
  const request = fetch(url, options)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      // Store in data cache
      dataCache.set(cacheKey, { data, timestamp: Date.now() });
      // Remove from request cache
      requestCache.delete(cacheKey);
      return data as T;
    })
    .catch((error) => {
      requestCache.delete(cacheKey);
      throw error;
    });

  requestCache.set(cacheKey, request);
  return request;
}

// Prefetch product data for hover preview
export function prefetchProduct(slug: string): void {
  if (typeof window === 'undefined') return;

  // Use requestIdleCallback for non-critical prefetch
  const callback = () => {
    deduplicatedFetch(`/api/products/${slug}`).catch(() => {
      // Silently fail for prefetch
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 100);
  }
}

// Prefetch multiple products (for pagination)
export function prefetchProducts(page: number, limit: number = 9): void {
  if (typeof window === 'undefined') return;

  const callback = () => {
    deduplicatedFetch(`/api/products?page=${page}&limit=${limit}`).catch(
      () => {}
    );
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 3000 });
  } else {
    setTimeout(callback, 200);
  }
}

// Combine multiple API calls into one
export async function batchFetchProducts(
  ids: string[]
): Promise<Map<string, Product>> {
  if (ids.length === 0) return new Map();

  // Check cache for each id
  const uncached: string[] = [];
  const results = new Map<string, Product>();

  for (const id of ids) {
    const cached = dataCache.get(`product-${id}`);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.set(id, cached.data as Product);
    } else {
      uncached.push(id);
    }
  }

  // Fetch uncached products in batch
  if (uncached.length > 0) {
    try {
      const response = await deduplicatedFetch<{ products: Product[] }>(
        `/api/products/batch?ids=${uncached.join(',')}`
      );

      for (const product of response.products) {
        results.set(product.id, product);
        dataCache.set(`product-${product.id}`, {
          data: product,
          timestamp: Date.now(),
        });
      }
    } catch {
      // Handle error silently for batch fetch
    }
  }

  return results;
}

// Preload images for faster LCP
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.fetchPriority = priority;

  // Check if already preloaded
  const existing = document.head.querySelector(`link[href="${src}"]`);
  if (!existing) {
    document.head.appendChild(link);
  }
}

// Preload images from product list
export function preloadProductImages(products: Product[], limit: number = 3): void {
  const imagesToPreload = products
    .slice(0, limit)
    .filter((p) => p.image)
    .map((p) => p.image as string);

  imagesToPreload.forEach((src, index) => {
    preloadImage(src, index === 0 ? 'high' : 'low');
  });
}

// Clear expired cache entries
export function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of dataCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL * 5) {
      dataCache.delete(key);
    }
  }
}

// Setup automatic cache cleanup
if (typeof window !== 'undefined') {
  setInterval(cleanupCache, CACHE_TTL * 2);
}

// Intersection Observer for lazy prefetching
export function createPrefetchObserver(
  onIntersect: (id: string) => void
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-prefetch-id');
          if (id) {
            onIntersect(id);
          }
        }
      });
    },
    {
      rootMargin: '200px', // Start prefetch 200px before visible
      threshold: 0,
    }
  );
}

// Note: requestIdleCallback type is available in lib.dom.d.ts
// We check for its existence at runtime for browser compatibility

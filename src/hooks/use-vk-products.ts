/**
 * React Hooks for VK Products API
 * Client-side data fetching with SWR-like patterns for VK Market products
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  VKProduct,
  VKProductsListResponse,
  VKProductDetailResponse,
  VKProductCategoriesResponse,
  VKProductsQueryParams,
  VKProductCollection,
} from '@/types/vk-product';

// API Base URL (can be configured for different environments)
const API_BASE = '/api/products';

// Cache for VK products
const vkProductsCache = new Map<string, { data: VKProductsListResponse; timestamp: number }>();
const vkProductCache = new Map<string, { data: VKProduct; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Build query string from params
 */
function buildQueryString(params: VKProductsQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.pageSize !== undefined) searchParams.set('pageSize', String(params.pageSize));
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.priceFrom !== undefined) searchParams.set('priceFrom', String(params.priceFrom));
  if (params.priceTo !== undefined) searchParams.set('priceTo', String(params.priceTo));

  return searchParams.toString();
}

/**
 * Fetch VK products list
 */
export async function fetchVKProducts(params: VKProductsQueryParams = {}): Promise<VKProductsListResponse> {
  const queryString = buildQueryString(params);
  const cacheKey = queryString || 'default';

  // Check cache
  const cached = vkProductsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch VK products');
  }

  const data = await response.json() as VKProductsListResponse;

  // Update cache
  vkProductsCache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Fetch single VK product
 */
export async function fetchVKProduct(id: string, includeRelated = false): Promise<VKProductDetailResponse> {
  const cacheKey = `${id}_${includeRelated}`;

  // Check cache for the product
  const cached = vkProductCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { product: cached.data };
  }

  const url = includeRelated
    ? `${API_BASE}/${id}?includeRelated=true`
    : `${API_BASE}/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch VK product');
  }

  const data = await response.json() as VKProductDetailResponse;

  // Update cache
  vkProductCache.set(cacheKey, { data: data.product, timestamp: Date.now() });

  return data;
}

/**
 * Fetch VK categories
 */
export async function fetchVKCategories(): Promise<VKProductCategoriesResponse> {
  const response = await fetch(`${API_BASE}/categories`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch VK categories');
  }

  return response.json();
}

/**
 * Hook: Use VK Products List
 */
export function useVKProducts(initialParams: VKProductsQueryParams = {}) {
  const [products, setProducts] = useState<VKProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<VKProductsQueryParams>(initialParams);

  const load = useCallback(async (newParams?: VKProductsQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = newParams ?? params;
      const response = await fetchVKProducts(queryParams);
      setProducts(response.products);
      setTotal(response.total);
      if (newParams) setParams(newParams);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMore = useMemo(() => {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    return page * pageSize < total;
  }, [params, total]);

  const loadMore = useCallback(async () => {
    const nextPage = (params.page || 1) + 1;
    const response = await fetchVKProducts({ ...params, page: nextPage });
    setProducts(prev => [...prev, ...response.products]);
    setParams(prev => ({ ...prev, page: nextPage }));
  }, [params]);

  return {
    products,
    total,
    loading,
    error,
    params,
    hasMore,
    load,
    loadMore,
    setParams: (newParams: Partial<VKProductsQueryParams>) => {
      const updated = { ...params, ...newParams, page: 1 };
      load(updated);
    },
  };
}

/**
 * Hook: Use Single VK Product
 */
export function useVKProduct(id: string | null, includeRelated = false) {
  const [product, setProduct] = useState<VKProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<VKProduct[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchVKProduct(id, includeRelated)
      .then(response => {
        setProduct(response.product);
        setRelatedProducts(response.relatedProducts || []);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, includeRelated]);

  return {
    product,
    relatedProducts,
    loading,
    error,
  };
}

/**
 * Hook: Use VK Categories
 */
export function useVKCategories() {
  const [categories, setCategories] = useState<VKProductCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchVKCategories()
      .then(response => {
        setCategories(response.categories);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    categories,
    loading,
    error,
  };
}

/**
 * Hook: Use VK Product Search
 */
export function useVKProductSearch(debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<VKProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchVKProducts({ search: debouncedQuery, pageSize: 10 })
      .then(response => {
        setResults(response.products);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
  };
}

/**
 * Clear all VK product caches
 */
export function clearVKProductsCache(): void {
  vkProductsCache.clear();
  vkProductCache.clear();
}

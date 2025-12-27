/**
 * React Hooks for Products API
 * Client-side data fetching with SWR-like patterns
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  ProductsListResponse,
  ProductDetailResponse,
  ProductCategoriesResponse,
  ProductsQueryParams,
  ProductCollection,
} from '@/types/product';

// API Base URL (can be configured for different environments)
const API_BASE = '/api/products';

// Cache for products
const productsCache = new Map<string, { data: ProductsListResponse; timestamp: number }>();
const productCache = new Map<string, { data: Product; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Build query string from params
 */
function buildQueryString(params: ProductsQueryParams): string {
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
 * Fetch products list
 */
export async function fetchProducts(params: ProductsQueryParams = {}): Promise<ProductsListResponse> {
  const queryString = buildQueryString(params);
  const cacheKey = queryString || 'default';

  // Check cache
  const cached = productsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch products');
  }

  const data = await response.json() as ProductsListResponse;

  // Update cache
  productsCache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Fetch single product
 */
export async function fetchProduct(id: string, includeRelated = false): Promise<ProductDetailResponse> {
  const cacheKey = `${id}_${includeRelated}`;

  // Check cache for the product
  const cached = productCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { product: cached.data };
  }

  const url = includeRelated
    ? `${API_BASE}/${id}?includeRelated=true`
    : `${API_BASE}/${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch product');
  }

  const data = await response.json() as ProductDetailResponse;

  // Update cache
  productCache.set(cacheKey, { data: data.product, timestamp: Date.now() });

  return data;
}

/**
 * Fetch categories
 */
export async function fetchCategories(): Promise<ProductCategoriesResponse> {
  const response = await fetch(`${API_BASE}/categories`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch categories');
  }

  return response.json();
}

/**
 * Hook: Use Products List
 */
export function useProducts(initialParams: ProductsQueryParams = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<ProductsQueryParams>(initialParams);

  const load = useCallback(async (newParams?: ProductsQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = newParams ?? params;
      const response = await fetchProducts(queryParams);
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
    const response = await fetchProducts({ ...params, page: nextPage });
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
    setParams: (newParams: Partial<ProductsQueryParams>) => {
      const updated = { ...params, ...newParams, page: 1 };
      load(updated);
    },
  };
}

/**
 * Hook: Use Single Product
 */
export function useProduct(id: string | null, includeRelated = false) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
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

    fetchProduct(id, includeRelated)
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
 * Hook: Use Categories
 */
export function useCategories() {
  const [categories, setCategories] = useState<ProductCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCategories()
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
 * Hook: Use Product Search
 */
export function useProductSearch(debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
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

    fetchProducts({ search: debouncedQuery, pageSize: 10 })
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
 * Clear all caches
 */
export function clearProductsCache(): void {
  productsCache.clear();
  productCache.clear();
}

'use client';

/**
 * React Query Hooks for Products
 * 
 * High-performance data fetching with automatic caching,
 * background refetching, and optimistic updates.
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys, staleTimes, prefetchProduct } from '@/lib/query-client';
import { Product, ProductsListResponse, ProductDetailResponse, ProductsQueryParams, ProductCollection } from '@/types/product';

// ============================================================================
// API FUNCTIONS
// ============================================================================

const API_BASE = '/api/products';

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
 * Fetch products list from API
 */
async function fetchProducts(params: ProductsQueryParams = {}): Promise<ProductsListResponse> {
  const queryString = buildQueryString(params);
  const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Network error' } }));
    throw new Error(error.error?.message || `HTTP error ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetch single product from API
 */
async function fetchProduct(id: string, includeRelated = false): Promise<ProductDetailResponse> {
  const url = includeRelated
    ? `${API_BASE}/${id}?includeRelated=true`
    : `${API_BASE}/${id}`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    const error = await response.json().catch(() => ({ error: { message: 'Network error' } }));
    throw new Error(error.error?.message || `HTTP error ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetch categories from API
 */
async function fetchCategories(): Promise<{ categories: ProductCollection[] }> {
  const response = await fetch(`${API_BASE}/categories`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Network error' } }));
    throw new Error(error.error?.message || `HTTP error ${response.status}`);
  }
  
  return response.json();
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook: Fetch products list with React Query
 * 
 * Features:
 * - Automatic caching (1 minute stale time)
 * - Background refetching
 * - Deduplication of concurrent requests
 * - Automatic retry on failure
 */
export function useQueryProducts(
  params: ProductsQueryParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, unknown>),
    queryFn: () => fetchProducts(params),
    staleTime: staleTimes.standard,
    enabled: options.enabled !== false,
    // Keep previous data while fetching new page
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook: Infinite scroll products list
 * 
 * Features:
 * - Load more on scroll
 * - Maintains all loaded pages in cache
 * - Automatic deduplication
 */
export function useInfiniteProducts(
  params: Omit<ProductsQueryParams, 'page'> = {},
  options: { enabled?: boolean; pageSize?: number } = {}
) {
  const pageSize = options.pageSize || 20;

  return useInfiniteQuery({
    queryKey: [...queryKeys.products.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...params, page: pageParam, pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages by comparing current page with totalPages
      const currentPage = allPages.length;
      if (currentPage >= lastPage.totalPages) return undefined;
      return currentPage + 1;
    },
    initialPageParam: 1,
    staleTime: staleTimes.standard,
    enabled: options.enabled !== false,
  });
}

/**
 * Hook: Fetch single product
 * 
 * Features:
 * - Automatic caching
 * - Background refetch when stale
 * - Returns cached data immediately if available
 */
export function useQueryProduct(
  id: string | null,
  options: { includeRelated?: boolean; enabled?: boolean } = {}
) {
  const { includeRelated = false, enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.products.detail(id || ''),
    queryFn: () => fetchProduct(id!, includeRelated),
    staleTime: staleTimes.standard,
    enabled: !!id && enabled,
  });
}

/**
 * Hook: Fetch categories
 * 
 * Features:
 * - Long cache time (5 minutes) since categories rarely change
 * - Shared across all components
 */
export function useQueryCategories(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: fetchCategories,
    staleTime: staleTimes.long,
    // Categories rarely change, keep in cache longer
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: options.enabled !== false,
  });
}

/**
 * Hook: Search products with debounce
 * 
 * Features:
 * - Only searches when query is non-empty
 * - Caches search results
 * - Debouncing should be handled by the calling component
 */
export function useSearchProducts(
  query: string,
  options: { enabled?: boolean; pageSize?: number } = {}
) {
  const { enabled = true, pageSize = 10 } = options;
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: queryKeys.products.list({ search: trimmedQuery, pageSize }),
    queryFn: () => fetchProducts({ search: trimmedQuery, pageSize }),
    staleTime: staleTimes.standard,
    enabled: enabled && trimmedQuery.length > 0,
  });
}

/**
 * Hook: Prefetch product on hover
 * Returns a function to call on mouse enter
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return (productId: string) => {
    // Only prefetch if not already cached
    const cached = queryClient.getQueryData(queryKeys.products.detail(productId));
    if (!cached) {
      prefetchProduct(queryClient, productId);
    }
  };
}

/**
 * Hook: Products by category with prefetching
 * Useful for category pages
 */
export function useProductsByCategory(
  categoryId: string | null,
  options: { page?: number; pageSize?: number; enabled?: boolean } = {}
) {
  const { page = 1, pageSize = 20, enabled = true } = options;

  return useQuery({
    queryKey: queryKeys.products.list({ categoryId: categoryId || undefined, page, pageSize }),
    queryFn: () => fetchProducts({ categoryId: categoryId || undefined, page, pageSize }),
    staleTime: staleTimes.standard,
    enabled: enabled && !!categoryId,
    placeholderData: (previousData) => previousData,
  });
}

// ============================================================================
// OPTIMISTIC UPDATE HOOKS
// ============================================================================

/**
 * Hook: Update product cache optimistically
 * Useful for admin operations or wishlists
 */
export function useOptimisticProductUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, updates }: { productId: string; updates: Partial<Product> }) => {
      // This would call your API to update the product
      const response = await fetch(`${API_BASE}/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      return response.json();
    },
    // Optimistic update
    onMutate: async ({ productId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(productId) });

      // Snapshot previous value
      const previousProduct = queryClient.getQueryData<ProductDetailResponse>(
        queryKeys.products.detail(productId)
      );

      // Optimistically update
      if (previousProduct) {
        queryClient.setQueryData(
          queryKeys.products.detail(productId),
          {
            ...previousProduct,
            product: { ...previousProduct.product, ...updates },
          }
        );
      }

      return { previousProduct };
    },
    // Rollback on error
    onError: (_err, { productId }, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(
          queryKeys.products.detail(productId),
          context.previousProduct
        );
      }
    },
    // Refetch after error or success
    onSettled: (_data, _error, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook: Get product from cache without fetching
 */
export function useCachedProduct(productId: string): Product | undefined {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<ProductDetailResponse>(
    queryKeys.products.detail(productId)
  );
  return data?.product;
}

/**
 * Hook: Invalidate product caches
 * Useful after cart operations or when products may have changed
 */
export function useInvalidateProducts() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    invalidateProduct: (id: string) => 
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) }),
    invalidateList: () => 
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() }),
  };
}

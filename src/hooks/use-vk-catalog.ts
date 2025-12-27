'use client';

/**
 * VK Catalog Hook
 * Fetches products from VK API with TanStack Query
 * Supports infinite loading, filtering, and caching
 */

import { useMemo } from 'react';
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import {
  VKProduct,
  VKProductCollection,
  VKProductsListResponse,
  VKProductCategoriesResponse,
  VKProductsQueryParams,
} from '@/types/vk-product';
import {
  CatalogProduct,
  CatalogFilters,
  PriceRange,
  toCatalogProducts,
  DEFAULT_PRICE_BOUNDS,
} from '@/types/catalog';

/**
 * API Base URL
 */
const API_BASE = '/api/products';

/**
 * Query keys for TanStack Query
 */
export const catalogQueryKeys = {
  all: ['catalog'] as const,
  products: (filters: Partial<CatalogFilters>) =>
    [...catalogQueryKeys.all, 'products', filters] as const,
  productsInfinite: (filters: Partial<CatalogFilters>) =>
    [...catalogQueryKeys.all, 'products-infinite', filters] as const,
  product: (id: string) => [...catalogQueryKeys.all, 'product', id] as const,
  categories: () => [...catalogQueryKeys.all, 'categories'] as const,
  priceBounds: () => [...catalogQueryKeys.all, 'price-bounds'] as const,
};

/**
 * Build query string from filters
 */
function buildQueryParams(filters: Partial<CatalogFilters>, page?: number): VKProductsQueryParams {
  const params: VKProductsQueryParams = {};

  if (filters.page || page) {
    params.page = page ?? filters.page;
  }

  if (filters.pageSize) {
    params.pageSize = filters.pageSize;
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    // Use first category for now (VK API supports single category)
    params.categoryId = filters.categoryIds[0];
  }

  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.sort) {
    // Map our sort to VK API sort
    const sortMap: Record<string, VKProductsQueryParams['sortBy']> = {
      date: 'date',
      price_asc: 'price_asc',
      price_desc: 'price_desc',
      popular: 'popular',
      name_asc: 'date', // VK doesn't support name sort, fallback
      name_desc: 'date',
    };
    params.sortBy = sortMap[filters.sort] || 'popular';
  }

  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      params.priceFrom = filters.priceRange.min;
    }
    if (filters.priceRange.max < DEFAULT_PRICE_BOUNDS.max) {
      params.priceTo = filters.priceRange.max;
    }
  }

  return params;
}

/**
 * Fetch products from API
 */
async function fetchProducts(
  filters: Partial<CatalogFilters>,
  page?: number
): Promise<VKProductsListResponse> {
  const params = buildQueryParams(filters, page);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const url = searchParams.toString()
    ? `${API_BASE}?${searchParams.toString()}`
    : API_BASE;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
    throw new Error(error.message || 'Failed to fetch products');
  }

  return response.json();
}

/**
 * Fetch categories from API
 */
async function fetchCategories(): Promise<VKProductCategoriesResponse> {
  const response = await fetch(`${API_BASE}/categories`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch categories' }));
    throw new Error(error.message || 'Failed to fetch categories');
  }

  return response.json();
}

/**
 * Return type for useVKCatalog hook
 */
export interface UseVKCatalogReturn {
  /** Catalog products (transformed) */
  products: CatalogProduct[];
  /** Product categories */
  categories: VKProductCollection[];
  /** Loading state */
  isLoading: boolean;
  /** Loading more products */
  isLoadingMore: boolean;
  /** Error state */
  error: Error | null;
  /** Total product count */
  totalCount: number;
  /** Has more products to load */
  hasMore: boolean;
  /** Load more products */
  loadMore: () => void;
  /** Can load more (not loading and has more) */
  canLoadMore: boolean;
  /** Refetch products */
  refetch: () => void;
  /** Refetch categories */
  refetchCategories: () => void;
  /** Is fetching (background refresh) */
  isFetching: boolean;
  /** Price bounds from current dataset */
  priceBounds: PriceRange;
}

/**
 * Hook options
 */
export interface UseVKCatalogOptions {
  /** Filters to apply */
  filters?: Partial<CatalogFilters>;
  /** Use debounced search value */
  debouncedSearch?: string;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Stale time in ms (default: 5 minutes) */
  staleTime?: number;
}

/**
 * VK Catalog Hook
 * Fetches products with infinite loading support
 */
export function useVKCatalog(options: UseVKCatalogOptions = {}): UseVKCatalogReturn {
  const {
    filters = {},
    debouncedSearch,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  // Use debounced search if provided
  const effectiveFilters = useMemo(() => {
    if (debouncedSearch !== undefined) {
      return { ...filters, search: debouncedSearch };
    }
    return filters;
  }, [filters, debouncedSearch]);

  // Fetch products with infinite query
  const {
    data: productsData,
    error: productsError,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchProducts,
  } = useInfiniteQuery({
    queryKey: catalogQueryKeys.productsInfinite(effectiveFilters),
    queryFn: async ({ pageParam = 1 }) => {
      return fetchProducts(effectiveFilters, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled,
    staleTime,
  });

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: catalogQueryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes for categories
    enabled,
  });

  // Transform products to catalog products
  const products = useMemo<CatalogProduct[]>(() => {
    if (!productsData?.pages) return [];

    const allProducts = productsData.pages.flatMap((page) => page.products);
    return toCatalogProducts(allProducts);
  }, [productsData]);

  // Get categories
  const categories = useMemo<VKProductCollection[]>(() => {
    return categoriesData?.categories || [];
  }, [categoriesData]);

  // Calculate total count
  const totalCount = useMemo(() => {
    if (!productsData?.pages?.length) return 0;
    return productsData.pages[0].total;
  }, [productsData]);

  // Calculate price bounds from products
  const priceBounds = useMemo<PriceRange>(() => {
    if (products.length === 0) return DEFAULT_PRICE_BOUNDS;

    const prices = products.map((p) => p.price.amount);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Combined loading state
  const isLoading = isLoadingProducts || isLoadingCategories;

  // Combined error
  const error = productsError || categoriesError || null;

  // Load more handler
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Can load more check
  const canLoadMore = Boolean(hasNextPage && !isFetchingNextPage);

  return {
    products,
    categories,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error: error as Error | null,
    totalCount,
    hasMore: Boolean(hasNextPage),
    loadMore,
    canLoadMore,
    refetch: refetchProducts,
    refetchCategories,
    isFetching: isFetchingProducts,
    priceBounds,
  };
}

/**
 * Hook for single page products (no infinite loading)
 */
export function useVKCatalogPage(options: UseVKCatalogOptions = {}) {
  const {
    filters = {},
    debouncedSearch,
    enabled = true,
    staleTime = 5 * 60 * 1000,
  } = options;

  // Use debounced search if provided
  const effectiveFilters = useMemo(() => {
    if (debouncedSearch !== undefined) {
      return { ...filters, search: debouncedSearch };
    }
    return filters;
  }, [filters, debouncedSearch]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: catalogQueryKeys.products(effectiveFilters),
    queryFn: () => fetchProducts(effectiveFilters),
    enabled,
    staleTime,
  });

  const products = useMemo<CatalogProduct[]>(() => {
    if (!data?.products) return [];
    return toCatalogProducts(data.products);
  }, [data]);

  return {
    products,
    totalCount: data?.total || 0,
    hasMore: data?.hasMore || false,
    page: data?.page || 1,
    pageSize: data?.pageSize || 20,
    isLoading,
    isFetching,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook for categories only
 */
export function useVKCategories(enabled = true) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: catalogQueryKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
    enabled,
  });

  return {
    categories: data?.categories || [],
    total: data?.total || 0,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Prefetch products for SSR/SSG
 */
export async function prefetchCatalogProducts(
  queryClient: QueryClient,
  filters: Partial<CatalogFilters> = {}
) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: catalogQueryKeys.productsInfinite(filters),
    queryFn: () => fetchProducts(filters, 1),
    initialPageParam: 1,
  });
}

/**
 * Prefetch categories for SSR/SSG
 */
export async function prefetchCatalogCategories(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: catalogQueryKeys.categories(),
    queryFn: fetchCategories,
  });
}

export default useVKCatalog;

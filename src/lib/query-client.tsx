'use client';

/**
 * React Query Configuration for Next.js
 * 
 * Provides optimized data fetching, caching, and state management
 * for the VA-PC e-commerce platform.
 */

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

/**
 * Create a new QueryClient instance with optimal defaults
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 1 minute (prevents immediate refetch on mount)
        staleTime: 60 * 1000,
        // Keep inactive queries in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests up to 3 times
        retry: 3,
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus in production (reduces API calls)
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
        // Refetch on reconnect
        refetchOnReconnect: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: 'always',
        // Network mode - always attempt even without network
        networkMode: 'offlineFirst',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Network mode
        networkMode: 'offlineFirst',
      },
    },
  });
}

// Browser query client singleton
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Get or create the QueryClient
 * - Server: Always create new client (each request is isolated)
 * - Browser: Reuse singleton to maintain cache between navigations
 */
function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is important so we don't re-make a new client if React
    // suspends during the initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

// ============================================================================
// QUERY KEYS
// ============================================================================

/**
 * Centralized query key factory for type safety and consistency
 */
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },

  // Cart (client-side only)
  cart: {
    all: ['cart'] as const,
    items: () => [...queryKeys.cart.all, 'items'] as const,
    count: () => [...queryKeys.cart.all, 'count'] as const,
  },

  // Configurator
  configurator: {
    all: ['configurator'] as const,
    components: (category: string) =>
      [...queryKeys.configurator.all, 'components', category] as const,
    compatibility: (selections: Record<string, string | null>) =>
      [...queryKeys.configurator.all, 'compatibility', selections] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    orders: () => [...queryKeys.user.all, 'orders'] as const,
    order: (id: string) => [...queryKeys.user.orders(), id] as const,
  },
} as const;

// ============================================================================
// STALE TIME PRESETS
// ============================================================================

/**
 * Stale time configurations for different data types
 */
export const staleTimes = {
  /** Real-time data (cart, user session) - 0 seconds */
  realtime: 0,
  /** Frequently updated data - 30 seconds */
  short: 30 * 1000,
  /** Standard data (products) - 1 minute */
  standard: 60 * 1000,
  /** Stable data (categories) - 5 minutes */
  long: 5 * 60 * 1000,
  /** Static data (configs) - 1 hour */
  static: 60 * 60 * 1000,
} as const;

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * React Query Provider for Next.js App Router
 * Wrap your root layout with this provider
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Get or create query client
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Invalidate all product-related queries
 * Call this after mutations that affect products
 */
export function invalidateProducts(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
}

/**
 * Invalidate all category queries
 */
export function invalidateCategories(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
}

/**
 * Prefetch products for a category (useful for hover prefetching)
 */
export function prefetchProducts(
  queryClient: QueryClient,
  categoryId: string
): Promise<void> {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.products.list({ categoryId }),
    queryFn: () =>
      fetch(`/api/products?categoryId=${categoryId}`).then((r) => r.json()),
    staleTime: staleTimes.standard,
  });
}

/**
 * Prefetch single product (useful for hover prefetching)
 */
export function prefetchProduct(
  queryClient: QueryClient,
  productId: string
): Promise<void> {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () =>
      fetch(`/api/products/${productId}`).then((r) => r.json()),
    staleTime: staleTimes.standard,
  });
}

/**
 * Get cached product data without fetching
 */
export function getCachedProduct<T>(
  queryClient: QueryClient,
  productId: string
): T | undefined {
  return queryClient.getQueryData<T>(queryKeys.products.detail(productId));
}

/**
 * Set product data in cache (useful for optimistic updates)
 */
export function setCachedProduct<T>(
  queryClient: QueryClient,
  productId: string,
  data: T
): void {
  queryClient.setQueryData(queryKeys.products.detail(productId), data);
}

// Export the QueryClient type for use in other modules
export type { QueryClient };

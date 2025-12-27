'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ============================================
// LAZY-LOADED CATALOG COMPONENTS
// ============================================
// Performance optimizations:
// 1. Dynamic imports with next/dynamic
// 2. Custom loading fallbacks
// 3. SSR disabled for heavy client components
// 4. Named exports for better tree-shaking
// ============================================

// Loading skeleton for filter sidebar
function FilterSidebarSkeleton() {
  return (
    <div className="w-72 flex-shrink-0 hidden lg:block">
      <div className="p-6 rounded-2xl bg-void-200 border border-neon-purple-500/10 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-void-400 rounded animate-pulse" />
          <div className="h-8 w-16 bg-void-400 rounded animate-pulse" />
        </div>

        {/* Filter groups skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-20 bg-void-400 rounded animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-8 bg-void-400 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeleton for product grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative rounded-2xl overflow-hidden bg-void-200 border border-neon-purple-500/10"
        >
          <div className="relative h-56 bg-void-300">
            <div className="absolute inset-0 bg-gradient-to-r from-void-300 via-void-400 to-void-300 animate-pulse" />
          </div>
          <div className="p-5 space-y-4">
            <div className="h-6 bg-void-400 rounded-lg animate-pulse w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-void-400 rounded-lg animate-pulse" />
              <div className="h-6 w-20 bg-void-400 rounded-lg animate-pulse" />
            </div>
            <div className="h-8 w-32 bg-void-400 rounded-lg animate-pulse" />
            <div className="h-12 bg-void-400 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading spinner for modals
function ModalLoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-neon-purple-500/30 border-t-neon-purple-500 rounded-full animate-spin" />
        <span className="text-white/70 text-sm">Загрузка...</span>
      </div>
    </div>
  );
}

// Lazy-loaded FilterSidebar
export const LazyFilterSidebar = dynamic(
  () => import('./FilterSidebar').then((mod) => ({ default: mod.FilterSidebar })),
  {
    loading: () => <FilterSidebarSkeleton />,
    ssr: true, // Keep SSR for SEO
  }
);

// Lazy-loaded VirtualizedProductList (heavy component)
export const LazyVirtualizedProductList = dynamic(
  () => import('./VirtualizedProductList').then((mod) => ({ default: mod.VirtualizedProductList })),
  {
    loading: () => <ProductGridSkeleton />,
    ssr: false, // Disable SSR for virtualized list
  }
);

// Lazy-loaded ProductGrid (regular grid for smaller lists)
export const LazyProductGrid = dynamic(
  () => import('./ProductGrid').then((mod) => ({ default: mod.ProductGrid })),
  {
    loading: () => <ProductGridSkeleton />,
    ssr: true,
  }
);

// Lazy-loaded SortDropdown
export const LazySortDropdown = dynamic(
  () => import('./SortDropdown').then((mod) => ({ default: mod.SortDropdown })),
  {
    loading: () => (
      <div className="h-10 w-40 bg-void-400 rounded-lg animate-pulse" />
    ),
    ssr: true,
  }
);

// Lazy-loaded PriceRangeSlider (heavy due to slider library)
export const LazyPriceRangeSlider = dynamic(
  () => import('./PriceRangeSlider').then((mod) => ({ default: mod.PriceRangeSlider })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-2 bg-void-400 rounded-full animate-pulse" />
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-void-400 rounded animate-pulse" />
          <div className="h-4 w-20 bg-void-400 rounded animate-pulse" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Wrapper component with Suspense boundary
export function LazyFilterSidebarWithSuspense(
  props: React.ComponentProps<typeof LazyFilterSidebar>
) {
  return (
    <Suspense fallback={<FilterSidebarSkeleton />}>
      <LazyFilterSidebar {...props} />
    </Suspense>
  );
}

export function LazyProductGridWithSuspense(
  props: React.ComponentProps<typeof LazyProductGrid>
) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <LazyProductGrid {...props} />
    </Suspense>
  );
}

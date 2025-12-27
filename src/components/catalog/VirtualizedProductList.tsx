'use client';

import { useRef, useMemo, memo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { OptimizedProductCard } from './OptimizedProductCard';

// ============================================
// VIRTUALIZED PRODUCT LIST COMPONENT
// ============================================
// Performance optimizations:
// 1. TanStack Virtual for rendering only visible items
// 2. Grid virtualization with row-based approach
// 3. Dynamic height calculation for responsive layouts
// 4. Overscan for smoother scrolling
// 5. React.memo for all sub-components
// ============================================

interface VirtualizedProductListProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 1 | 2 | 3;
  estimatedRowHeight?: number;
  overscan?: number;
}

// Skeleton component - memoized
const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-void-200 border border-neon-purple-500/10">
      {/* Image skeleton */}
      <div className="relative h-56 bg-void-300">
        <div className="absolute inset-0 bg-gradient-to-r from-void-300 via-void-400 to-void-300 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-neon-purple-500/10 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        <div className="h-6 bg-void-400 rounded-lg animate-pulse w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-void-400 rounded-lg animate-pulse" />
          <div className="h-6 w-20 bg-void-400 rounded-lg animate-pulse" />
          <div className="h-6 w-14 bg-void-400 rounded-lg animate-pulse" />
        </div>
        <div className="flex justify-between items-end">
          <div className="h-8 w-32 bg-void-400 rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-void-400 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 bg-void-400 rounded-xl animate-pulse" />
      </div>
    </div>
  );
});

// Empty state component - memoized
const EmptyState = memo(function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-24 h-24 rounded-full bg-neon-purple-500/10 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-neon-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-2">
        Ничего не найдено
      </h3>
      <p className="text-white/50 text-center max-w-md">
        Попробуйте изменить параметры фильтрации или сбросить фильтры для
        просмотра всех товаров
      </p>
    </motion.div>
  );
});

// Loading skeleton grid
const LoadingGrid = memo(function LoadingGrid({ columns }: { columns: number }) {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
});

function VirtualizedProductListComponent({
  products,
  isLoading = false,
  columns = 3,
  estimatedRowHeight = 420, // Approximate card height in px
  overscan = 2,
}: VirtualizedProductListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate rows from products based on columns
  const rows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < products.length; i += columns) {
      result.push(products.slice(i, i + columns));
    }
    return result;
  }, [products, columns]);

  // Get column class for responsive grid
  const gridClass = useMemo(() => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
      default:
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
    }
  }, [columns]);

  // Initialize virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => estimatedRowHeight, [estimatedRowHeight]),
    overscan,
    // Enable smooth scrolling
    scrollPaddingStart: 20,
    scrollPaddingEnd: 20,
  });

  // Handle loading state
  if (isLoading) {
    return <LoadingGrid columns={columns} />;
  }

  // Handle empty state
  if (products.length === 0) {
    return <EmptyState />;
  }

  // For small product lists (< 20 items), use regular grid for simplicity
  if (products.length < 20) {
    return (
      <div className={`grid ${gridClass} gap-6`}>
        {products.map((product, index) => (
          <OptimizedProductCard
            key={product.id}
            product={product}
            index={index}
            priority={index < 3} // Prioritize first 3 for LCP
          />
        ))}
      </div>
    );
  }

  // Virtualized list for large catalogs
  return (
    <div
      ref={parentRef}
      className="overflow-auto max-h-[calc(100vh-300px)] scrollbar-hide"
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowProducts = rows[virtualRow.index];
          const isFirstRow = virtualRow.index === 0;

          return (
            <div
              key={virtualRow.key}
              className={`grid ${gridClass} gap-6 absolute left-0 w-full`}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowProducts.map((product, colIndex) => {
                const globalIndex = virtualRow.index * columns + colIndex;
                return (
                  <OptimizedProductCard
                    key={product.id}
                    product={product}
                    index={globalIndex}
                    priority={isFirstRow && colIndex < 3}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export memoized component
export const VirtualizedProductList = memo(VirtualizedProductListComponent);

export default VirtualizedProductList;

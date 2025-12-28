'use client';

/**
 * Catalog Page
 * Displays VK products with filtering, sorting, and infinite scroll
 */

import { Suspense, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, AlertCircle, RefreshCw, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hooks
import { useVKCatalog } from '@/hooks/use-vk-catalog';
import { useCatalogFilters } from '@/hooks/use-catalog-filters';
import { countActiveFilters, DEFAULT_PRICE_BOUNDS } from '@/types/catalog';

// Components
import { VKProductCard } from '@/components/catalog/VKProductCard';
import { ProductFilters, MobileFilterBar } from '@/components/catalog/ProductFilters';
import { ProductSkeletonGrid } from '@/components/catalog/ProductSkeleton';
import { Button } from '@/components/ui/button';

// ============================================
// ANIMATED BACKGROUND
// ============================================

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0f] to-black" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-magenta-600/15 rounded-full blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}

// ============================================
// PAGE TITLE
// ============================================

function PageTitle({ totalCount }: { totalCount: number }) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-magenta-400 animate-pulse" />
        <span className="text-xs font-mono text-purple-300 uppercase tracking-wider">
          {totalCount > 0 ? `${totalCount} конфигураций` : 'VA-PC Collection'}
        </span>
      </motion.div>

      <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl">
        <span className="text-white">Каталог </span>
        <span className="bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
          игровых ПК
        </span>
      </h1>
      <p className="text-white/50 mt-4 max-w-2xl text-lg">
        Выберите идеальный компьютер для ваших задач. Все системы собраны вручную и протестированы.
      </p>
    </motion.div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
        <Package className="w-12 h-12 text-purple-400" />
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-2">
        Ничего не найдено
      </h3>
      <p className="text-white/50 mb-6 max-w-md">
        По вашим фильтрам не найдено ни одного компьютера. Попробуйте изменить параметры поиска.
      </p>
      <Button
        variant="outline"
        onClick={onReset}
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Сбросить фильтры
      </Button>
    </motion.div>
  );
}

// ============================================
// ERROR STATE
// ============================================

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-12 h-12 text-red-400" />
      </div>
      <h3 className="text-xl font-display font-bold text-white mb-2">
        Ошибка загрузки
      </h3>
      <p className="text-white/50 mb-6 max-w-md">
        {error.message || 'Не удалось загрузить товары. Пожалуйста, попробуйте позже.'}
      </p>
      <Button
        variant="default"
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Повторить
      </Button>
    </motion.div>
  );
}

// ============================================
// PRODUCTS GRID
// ============================================

interface ProductsGridProps {
  products: ReturnType<typeof useVKCatalog>['products'];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  canLoadMore: boolean;
}

function ProductsGrid({
  products,
  isLoading,
  isLoadingMore,
  hasMore,
  loadMore,
  canLoadMore,
}: ProductsGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!canLoadMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && canLoadMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [canLoadMore, isLoadingMore, loadMore]);

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <VKProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <span className="ml-3 text-white/60">Загружаем еще...</span>
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && !isLoadingMore && (
        <div ref={loadMoreRef} className="h-20" />
      )}

      {/* Load more button (fallback) */}
      {hasMore && !isLoadingMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={!canLoadMore}
            className="gap-2"
          >
            Показать еще
          </Button>
        </div>
      )}

      {/* End of list */}
      {!hasMore && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-white/40"
        >
          Вы просмотрели все {products.length} товаров
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// CATALOG LOADING FALLBACK
// ============================================

function CatalogLoadingFallback() {
  return (
    <div className="min-h-screen relative">
      <BackgroundEffects />
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTitle totalCount={0} />
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0">
            {/* Sidebar placeholder */}
            <div className="h-96 rounded-xl bg-white/5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <ProductSkeletonGrid count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CATALOG CONTENT (with hooks)
// ============================================

function CatalogContent() {
  // Filter state management with URL sync
  const {
    filters,
    debouncedSearch,
    setSearch,
    setSort,
    toggleCategory,
    setPriceRange,
    resetFilters,
  } = useCatalogFilters({ syncToURL: true, searchDebounceMs: 300 });

  // Fetch products with infinite loading
  const {
    products,
    categories,
    isLoading,
    isLoadingMore,
    error,
    totalCount,
    hasMore,
    loadMore,
    canLoadMore,
    refetch,
    priceBounds,
  } = useVKCatalog({
    filters,
    debouncedSearch,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate active filters count
  const filtersCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Transform categories for filter component
  const filterCategories = useMemo(() => {
    return categories.map((cat) => ({
      id: String(cat.id),
      name: cat.name,
      count: cat.productCount,
    }));
  }, [categories]);

  // Filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, [setSearch]);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    toggleCategory(categoryId);
  }, [toggleCategory]);

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setPriceRange(min, max);
  }, [setPriceRange]);

  const handleSortChange = useCallback((sort: Parameters<typeof setSort>[0]) => {
    setSort(sort);
  }, [setSort]);

  const handleReset = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  // Filter props
  const filterProps = {
    filters,
    onSearchChange: handleSearchChange,
    onCategoryToggle: handleCategoryToggle,
    onPriceRangeChange: handlePriceRangeChange,
    onSortChange: handleSortChange,
    onReset: handleReset,
    categories: filterCategories,
    priceBounds: priceBounds || DEFAULT_PRICE_BOUNDS,
    filtersCount,
  };

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <BackgroundEffects />

      {/* Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <PageTitle totalCount={totalCount} />

        {/* Mobile Filter Bar */}
        <MobileFilterBar
          filters={filters}
          onSortChange={handleSortChange}
          onOpenFilters={() => {}}
          filtersCount={filtersCount}
          totalProducts={totalCount}
        />

        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <ProductFilters {...filterProps} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count for desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="text-white/60">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Загрузка...
                  </span>
                ) : (
                  <span>
                    Найдено <span className="text-white font-semibold">{totalCount}</span> товаров
                  </span>
                )}
              </div>

              {filtersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="gap-2 text-purple-400 hover:text-purple-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Сбросить ({filtersCount})
                </Button>
              )}
            </div>

            {/* Loading state */}
            {isLoading && <ProductSkeletonGrid count={9} />}

            {/* Error state */}
            {error && !isLoading && (
              <ErrorState error={error} onRetry={refetch} />
            )}

            {/* Empty state */}
            {!isLoading && !error && products.length === 0 && (
              <EmptyState onReset={handleReset} />
            )}

            {/* Products grid */}
            {!isLoading && !error && products.length > 0 && (
              <ProductsGrid
                products={products}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                loadMore={loadMore}
                canLoadMore={canLoadMore}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoadingFallback />}>
      <CatalogContent />
    </Suspense>
  );
}

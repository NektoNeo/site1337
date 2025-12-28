'use client';

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, SearchX, RefreshCw } from 'lucide-react';
import { CatalogProduct } from '@/types/catalog';
import { VKProductCard } from './VKProductCard';
import { ProductSkeleton, ProductSkeletonGrid } from './ProductSkeleton';

import { cn } from '@/lib/cn';

// View mode type
type CatalogViewMode = 'grid' | 'list';

// ============================================
// TYPES
// ============================================

interface VKProductGridProps {
  products: CatalogProduct[];
  isLoading?: boolean;
  error?: string | null;
  viewMode?: CatalogViewMode;
  columns?: 1 | 2 | 3 | 4;
  showCount?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onAddToCart?: (product: CatalogProduct) => void;
  onToggleFavorite?: (product: CatalogProduct) => void;
  favoriteIds?: Set<string>;
  onRetry?: () => void;
}

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * Product count display
 */
function ProductCount({ count, isLoading }: { count: number; isLoading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 mb-6"
    >
      <Package className="w-5 h-5 text-neon-magenta-400" />
      <span className="text-white/70 font-mono text-sm">
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-8 h-4 bg-void-400 rounded animate-pulse" />
            <span>товаров</span>
          </span>
        ) : (
          <>
            Найдено: <span className="text-neon-magenta-400 font-bold">{count}</span>{' '}
            {getProductsWord(count)}
          </>
        )}
      </span>
    </motion.div>
  );
}

/**
 * Get correct Russian word form for product count
 */
function getProductsWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'товаров';
  }
  if (lastDigit === 1) {
    return 'товар';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товара';
  }
  return 'товаров';
}

/**
 * Empty state component
 */
function EmptyState({ 
  message = 'Ничего не найдено',
  description = 'Попробуйте изменить параметры фильтрации или сбросить фильтры для просмотра всех товаров',
}: { 
  message?: string;
  description?: string;
}) {
  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Icon container with glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-neon-purple-500/20 blur-xl rounded-full" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple-500/10 to-neon-magenta-500/10 border border-neon-purple-500/30 flex items-center justify-center">
          <SearchX className="w-12 h-12 text-neon-purple-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-display font-bold text-white mb-2">
        {message}
      </h3>
      <p className="text-white/50 text-center max-w-md leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

/**
 * Error state component
 */
function ErrorState({ 
  error,
  onRetry,
}: { 
  error: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Icon container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      
      <h3 className="text-xl font-display font-bold text-white mb-2">
        Произошла ошибка
      </h3>
      <p className="text-white/50 text-center max-w-md mb-6">
        {error}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-gradient-to-r from-neon-purple-600 to-neon-purple-500',
            'text-white font-display font-bold text-sm uppercase tracking-wider',
            'hover:from-neon-magenta-500 hover:to-neon-purple-500',
            'transition-all duration-300'
          )}
        >
          <RefreshCw className="w-4 h-4" />
          Попробовать снова
        </motion.button>
      )}
    </motion.div>
  );
}

// ============================================
// GRID CLASSES
// ============================================

const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * VK Product Grid Component
 * Responsive grid layout with loading, empty, and error states
 */
function VKProductGridComponent({
  products,
  isLoading = false,
  error = null,
  viewMode = 'grid',
  columns = 3,
  showCount = true,
  emptyMessage,
  emptyDescription,
  onAddToCart,
  onToggleFavorite,
  favoriteIds = new Set(),
  onRetry,
}: VKProductGridProps) {
  // Memoize favorite check function
  const isFavorite = useMemo(
    () => (productId: string) => favoriteIds.has(productId),
    [favoriteIds]
  );

  // Loading state
  if (isLoading) {
    return (
      <div>
        {showCount && <ProductCount count={0} isLoading />}
        <ProductSkeletonGrid count={columns * 2} />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Empty state
  if (products.length === 0) {
    return (
      <AnimatePresence mode="wait">
        <EmptyState message={emptyMessage} description={emptyDescription} />
      </AnimatePresence>
    );
  }

  // List view
  if (viewMode === 'list') {
    return (
      <div>
        {showCount && <ProductCount count={products.length} isLoading={false} />}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <VKProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite(product.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div>
      {showCount && <ProductCount count={products.length} isLoading={false} />}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn('grid gap-6', gridClasses[columns])}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <VKProductCard
              key={product.id}
              product={product}
              index={index}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite(product.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ============================================
// EXPORTS
// ============================================

// Memoized for performance
export const VKProductGrid = memo(VKProductGridComponent);

// Named export
export { VKProductGridComponent };

// Export helper components for external use
export { EmptyState, ErrorState, ProductCount };

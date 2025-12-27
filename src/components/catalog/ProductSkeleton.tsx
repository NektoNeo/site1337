'use client';

/**
 * ProductSkeleton - Loading skeleton for product cards
 * Matches VKProductCard layout with animated shimmer effect
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ProductSkeletonProps {
  index?: number;
  className?: string;
}

// Shimmer animation component
function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
}

export function ProductSkeleton({ index = 0, className }: ProductSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn('relative', className)}
    >
      {/* Card container */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-void-200 border border-neon-purple-500/10">
        {/* Badges skeleton */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className="h-6 w-14 rounded-full bg-white/5 animate-pulse" />
          <div className="h-6 w-10 rounded-full bg-white/5 animate-pulse" />
        </div>

        {/* Image section skeleton */}
        <div className="relative h-56 bg-gradient-to-b from-void-300 to-void-200">
          {/* Tech corners */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/10" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/10" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/10" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/10" />
          </div>

          {/* Image placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Shimmer className="w-32 h-32 rounded-xl bg-white/5" />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void-200 via-transparent to-transparent" />
        </div>

        {/* Content section skeleton */}
        <div className="relative p-5 space-y-4">
          {/* Category */}
          <Shimmer className="h-3 w-20 rounded bg-white/5" />

          {/* Title */}
          <div className="space-y-2">
            <Shimmer className="h-5 w-full rounded bg-white/5" />
            <Shimmer className="h-5 w-2/3 rounded bg-white/5" />
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-2">
            <Shimmer className="h-6 w-16 rounded-lg bg-white/5" />
            <Shimmer className="h-6 w-20 rounded-lg bg-white/5" />
            <Shimmer className="h-6 w-14 rounded-lg bg-white/5" />
            <Shimmer className="h-6 w-16 rounded-lg bg-white/5" />
          </div>

          {/* Price and stock */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <Shimmer className="h-3 w-16 rounded bg-white/5" />
              <Shimmer className="h-7 w-28 rounded bg-white/5" />
            </div>
            <Shimmer className="h-4 w-20 rounded bg-white/5" />
          </div>

          {/* Button */}
          <Shimmer className="h-12 w-full rounded-xl bg-neon-purple-500/10" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Grid of skeleton cards for loading state
 */
export function ProductSkeletonGrid({ 
  count = 6, 
  className 
}: { 
  count?: number; 
  className?: string;
}) {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} index={i} />
      ))}
    </div>
  );
}

export default ProductSkeleton;

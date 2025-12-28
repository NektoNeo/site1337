'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
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
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-inter font-bold text-white mb-2">
          Ничего не найдено
        </h3>
        <p className="text-white/50 text-center max-w-md">
          Попробуйте изменить параметры фильтрации или сбросить фильтры для
          просмотра всех товаров
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

// Skeleton loader for product cards
function ProductCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden bg-void-200 border border-neon-purple-500/10"
    >
      {/* Image skeleton */}
      <div className="relative h-56 bg-void-300">
        <div className="absolute inset-0 bg-gradient-to-r from-void-300 via-void-400 to-void-300 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-neon-purple-500/10 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="h-6 bg-void-400 rounded-lg animate-pulse w-3/4" />

        {/* Specs */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-void-400 rounded-lg animate-pulse" />
          <div className="h-6 w-20 bg-void-400 rounded-lg animate-pulse" />
          <div className="h-6 w-14 bg-void-400 rounded-lg animate-pulse" />
        </div>

        {/* Price */}
        <div className="flex justify-between items-end">
          <div className="h-8 w-32 bg-void-400 rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-void-400 rounded-lg animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-12 bg-void-400 rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
}

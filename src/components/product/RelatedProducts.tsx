'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RelatedProduct } from '@/types/product';

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
}

function ProductCard({ product, index }: { product: RelatedProduct; index: number }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group relative flex-shrink-0 w-72"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Card Container */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-all duration-300">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: index * 0.1 + 0.2 }}
                className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white text-xs font-bold shadow-lg shadow-red-500/25"
              >
                -{discountPercent}%
              </motion.span>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-square p-4 bg-gradient-to-br from-gray-800/50 to-transparent">
            {/* RGB border glow on hover */}
            <div className="absolute inset-4 rounded-xl bg-gradient-to-r from-purple-500/20 via-cyan-400/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <img
              src={product.imageUrl}
              alt={product.name}
              className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-4 pt-2">
            {/* Badges */}
            {product.badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.badges.slice(0, 3).map((badge, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-md border border-gray-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-orbitron font-semibold text-white text-sm leading-tight mb-3 line-clamp-2 group-hover:text-purple-200 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">RUB</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {/* Quick View Button - appears on hover */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="block w-full py-2.5 text-center text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:from-purple-500 hover:to-cyan-500 transition-all">
                Quick View
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function RelatedProducts({ products, title = "You May Also Like" }: RelatedProductsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-20 relative"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
            {title}
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50 transition-all group"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50 transition-all group"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />

        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Products Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 -mx-2 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product, index) => (
            <div key={product.id} style={{ scrollSnapAlign: 'start' }}>
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex justify-center"
      >
        <Link
          href="/catalog"
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">View All Products</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </motion.section>
  );
}

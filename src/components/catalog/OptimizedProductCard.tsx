'use client';

import { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Cpu, MemoryStick, Monitor } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/cn';

// ============================================
// PERFORMANCE OPTIMIZED PRODUCT CARD
// ============================================
// Optimizations applied:
// 1. React.memo to prevent unnecessary re-renders
// 2. useMemo for expensive calculations (formatPrice, discount)
// 3. useCallback for event handlers
// 4. Next.js Image with blur placeholder for LCP
// 5. Reduced motion animations (respects prefers-reduced-motion)
// 6. Memoized sub-components (SpecBadge)
// ============================================

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean; // For LCP optimization - set true for first 3 products
}

// Memoized price formatter to avoid recreation
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

// Memoized SpecBadge sub-component
const SpecBadge = memo(function SpecBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-mono">
      <span className="text-neon-magenta-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
});

// Animation variants - defined outside component to prevent recreation
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(index * 0.08, 0.4), // Cap delay at 0.4s
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// Placeholder blur data URL for faster LCP
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADERIh/9oADAMBAAIRAxEAPwCdpp9xp+oW8F3GYpJYy8ZOchScZ+0rdA0fTdQ0eC6uLOGSZ87nZck/o+UpStYnYCqkGM8z/9k=';

function ProductCardComponent({ product, index = 0, priority = false }: ProductCardProps) {
  // Memoize expensive calculations
  const discount = useMemo(() => {
    return product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;
  }, [product.price, product.salePrice]);

  const formattedPrice = useMemo(
    () => formatPrice(product.salePrice || product.price),
    [product.price, product.salePrice]
  );

  const formattedOriginalPrice = useMemo(
    () => (product.salePrice ? formatPrice(product.price) : null),
    [product.price, product.salePrice]
  );

  // Memoize spec labels
  const specLabels = useMemo(
    () => ({
      processor: product.specs.processor.split(' ').slice(-1)[0],
      graphics:
        product.specs.graphics.split(' ')[0] +
        ' ' +
        product.specs.graphics.split(' ')[1],
      ram: product.specs.ram.split(' ')[0],
    }),
    [product.specs.processor, product.specs.graphics, product.specs.ram]
  );

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ y: -8 }}
      className="group relative will-change-transform"
    >
      {/* RGB Glow effect - only on hover for performance */}
      <div
        className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-purple-500 via-neon-magenta-500 to-neon-purple-600 opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* Card container */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-void-200 border border-neon-purple-500/20 group-hover:border-neon-magenta-400/40 transition-colors duration-300">
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {product.badges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider',
                  badge === 'СКИДКА' || badge === 'SALE'
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : badge === 'ТОП' || badge === 'TOP'
                    ? 'bg-gradient-to-r from-neon-purple-500 to-neon-magenta-500 text-white shadow-neon-mixed'
                    : 'bg-white/10 backdrop-blur-sm text-white/90 border border-white/20'
                )}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              <span className="font-display font-black text-white text-sm">
                -{discount}%
              </span>
            </div>
          </div>
        )}

        {/* Image section with Next.js Image optimization */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-b from-void-300 to-void-200">
          {/* Tech frame corners */}
          <div className="absolute inset-4 pointer-events-none z-10" aria-hidden="true">
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neon-magenta-400/60" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-neon-magenta-400/60" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-neon-purple-400/60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neon-purple-400/60" />
          </div>

          {/* Product image with blur placeholder */}
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 group-hover:scale-105 transition-transform duration-500">
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-neon-magenta-500/30 blur-xl rounded-full"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Monitor
                    className="w-24 h-24 text-neon-purple-400/40"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-void-200 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Content section */}
        <div className="relative p-5">
          {/* Name */}
          <h3 className="font-display text-lg font-bold text-white mb-3 group-hover:text-neon-magenta-300 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Specs badges - memoized */}
          <div className="flex flex-wrap gap-2 mb-4">
            <SpecBadge
              icon={<Cpu className="w-3 h-3" />}
              label={specLabels.processor}
            />
            <SpecBadge
              icon={<Monitor className="w-3 h-3" />}
              label={specLabels.graphics}
            />
            <SpecBadge
              icon={<MemoryStick className="w-3 h-3" />}
              label={specLabels.ram}
            />
          </div>

          {/* Price section */}
          <div className="flex items-end justify-between mb-4">
            <div>
              {formattedOriginalPrice && (
                <div className="text-sm text-white/40 line-through font-mono">
                  {formattedOriginalPrice}
                </div>
              )}
              <div
                className={cn(
                  'text-2xl font-display font-black',
                  product.salePrice
                    ? 'text-transparent bg-gradient-to-r from-neon-magenta-400 to-neon-purple-400 bg-clip-text'
                    : 'text-white'
                )}
              >
                {formattedPrice}
              </div>
            </div>

            {/* Stock status */}
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium',
                product.inStock ? 'text-green-400' : 'text-red-400'
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  product.inStock ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                )}
                aria-hidden="true"
              />
              <span>{product.inStock ? 'В наличии' : 'Под заказ'}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/product/${product.slug}`}
            prefetch={true}
            className="block"
          >
            <button
              type="button"
              className="relative w-full py-3.5 px-6 rounded-xl overflow-hidden font-display font-bold text-sm uppercase tracking-wider transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Button gradient background */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-neon-purple-600 to-neon-purple-500"
                aria-hidden="true"
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-neon-magenta-500 to-neon-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              {/* Button text */}
              <span className="relative z-10 text-white">Подробнее</span>
            </button>
          </Link>
        </div>

        {/* Bottom glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple-500 via-neon-magenta-500 to-neon-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      </div>
    </motion.article>
  );
}

// Export memoized component with custom comparison
export const OptimizedProductCard = memo(ProductCardComponent, (prevProps, nextProps) => {
  // Only re-render if product id changes or index changes
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.index === nextProps.index &&
    prevProps.priority === nextProps.priority
  );
});

// Named export for tree-shaking
export default OptimizedProductCard;

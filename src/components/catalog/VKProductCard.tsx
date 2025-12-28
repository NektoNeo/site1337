'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Cpu, HardDrive, MemoryStick, Zap, ShoppingCart, Heart } from 'lucide-react';
import { CatalogProduct, PlatformBadge, CatalogProductSpecs } from '@/types/catalog';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';

// ============================================
// TYPES
// ============================================

interface VKProductCardProps {
  product: CatalogProduct;
  index?: number;
  onAddToCart?: (product: CatalogProduct) => void;
  onToggleFavorite?: (product: CatalogProduct) => void;
  isFavorite?: boolean;
}

// ============================================
// ANIMATION VARIANTS
// ============================================

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.08,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const glowVariants = {
  rest: { opacity: 0 },
  hover: { 
    opacity: 0.7,
    transition: { duration: 0.3 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.1 },
  }),
};

// ============================================
// HELPER COMPONENTS
// ============================================

/**
 * Platform badge component (AMD/Intel/NVIDIA)
 */
function PlatformBadgeComponent({ platform }: { platform: PlatformBadge }) {
  if (!platform) return null;

  const colors = {
    AMD: 'from-red-500 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    Intel: 'from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    NVIDIA: 'from-green-500 to-lime-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-inter font-bold uppercase tracking-wider',
        'bg-gradient-to-r text-white',
        colors[platform]
      )}
    >
      {platform}
    </motion.span>
  );
}

/**
 * Spec badge sub-component
 */
function SpecBadge({ 
  icon, 
  label, 
  highlight = false 
}: { 
  icon: React.ReactNode; 
  label: string | null;
  highlight?: boolean;
}) {
  if (!label) return null;
  
  return (
    <div 
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono',
        'border transition-all duration-300',
        highlight 
          ? 'bg-neon-purple-500/10 border-neon-purple-500/30 text-neon-purple-300'
          : 'bg-white/5 border-white/10 text-white/70'
      )}
    >
      <span className="text-neon-purple-400">{icon}</span>
      <span className="truncate max-w-[80px]">{label}</span>
    </div>
  );
}

/**
 * Discount badge component
 */
function DiscountBadge({ percent }: { percent: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 15 }}
      className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)]"
    >
      <span className="font-inter font-black text-white text-sm">-{percent}%</span>
    </motion.div>
  );
}

/**
 * Stock status indicator
 */
function StockStatus({ inStock }: { inStock: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs font-medium',
      inStock ? 'text-green-400' : 'text-orange-400'
    )}>
      <div className={cn(
        'w-2 h-2 rounded-full',
        inStock 
          ? 'bg-green-400 animate-pulse' 
          : 'bg-orange-400'
      )} />
      {inStock ? 'В наличии' : 'Под заказ'}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * VK Product Card Component
 * Glass-morphism styled card with RGB glow effects and Framer Motion animations
 */
function VKProductCardComponent({ 
  product, 
  index = 0,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: VKProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Truncate spec labels for display
  const specs = product.specs || { cpu: null, gpu: null, ram: null, ssd: null };
  const cpuShort = specs.cpu?.split(' ').slice(-2).join(' ') || null;
  const gpuShort = specs.gpu?.replace(/GeForce\s+/i, '').replace(/Radeon\s+/i, '') || null;
  const ramShort = specs.ram?.split(' ')[0] || null;
  const ssdShort = specs.ssd || null;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* RGB Glow effect - animated on hover */}
      <motion.div 
        variants={glowVariants}
        initial="rest"
        animate={isHovered ? "hover" : "rest"}
        className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-purple-500 via-neon-purple-500 to-neon-purple-600 blur-xl"
      />
      
      {/* Glass Card container */}
      <div className={cn(
        'relative h-full rounded-2xl overflow-hidden',
        'bg-void-200/80 backdrop-blur-md',
        'border border-neon-purple-500/20',
        'group-hover:border-neon-purple-400/40',
        'transition-all duration-300'
      )}>
        {/* Top gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple-500/5 via-transparent to-neon-purple-500/5 pointer-events-none" />
        
        {/* Badges container */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
          {/* Platform badge */}
          <PlatformBadgeComponent platform={product.platformBadge || null} />
          
          {/* Additional badges */}
          {(product.badges || []).map((badge, i) => (
            <motion.span
              key={badge}
              custom={i}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                'px-3 py-1 rounded-full text-xs font-inter font-bold uppercase tracking-wider',
                badge === 'SALE' || badge === 'DISCOUNT'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : badge === 'TOP' || badge === 'HIT'
                  ? 'bg-gradient-to-r from-neon-purple-500 to-neon-purple-500 text-white shadow-neon-mixed'
                  : badge === 'NEW'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                  : 'bg-white/10 backdrop-blur-sm text-white/90 border border-white/20'
              )}
            >
              {badge}
            </motion.span>
          ))}
        </div>

        {/* Discount badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <DiscountBadge percent={product.discountPercent} />
          </div>
        )}

        {/* Favorite button */}
        {onToggleFavorite && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'absolute top-4 right-4 z-30 w-10 h-10 rounded-full',
              'flex items-center justify-center',
              'bg-black/40 backdrop-blur-sm border border-white/10',
              'transition-colors duration-300',
              isFavorite && 'bg-red-500/20 border-red-500/40'
            )}
            style={{ 
              top: product.discountPercent ? '5rem' : '1rem' 
            }}
          >
            <Heart 
              className={cn(
                'w-5 h-5 transition-colors duration-300',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white/60'
              )} 
            />
          </motion.button>
        )}

        {/* Image section */}
        <Link href={product.productUrl || `/product/${product.slug}`}>
          <div className="relative h-56 overflow-hidden bg-gradient-to-b from-void-300 to-void-200 cursor-pointer">
            {/* Tech frame corners */}
            <div className="absolute inset-4 pointer-events-none z-10">
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neon-purple-400/60" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-neon-purple-400/60" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-neon-purple-400/60" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neon-purple-400/60" />
            </div>

            {/* Product image */}
            <motion.div 
              variants={imageVariants}
              initial="rest"
              animate={isHovered ? "hover" : "rest"}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              {/* Glow under image */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-neon-purple-500/30 blur-xl rounded-full" />
              
              {product.thumbnailUrl ? (
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-4"
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-neon-purple-500/20 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-neon-purple-400" />
                </div>
              )}
            </motion.div>

            {/* Animated scan line on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ top: '0%', opacity: 0 }}
                  animate={{ 
                    top: ['0%', '100%', '0%'],
                    opacity: [0, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                  className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-neon-purple-400 to-transparent"
                />
              )}
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-void-200 via-transparent to-transparent" />
          </div>
        </Link>

        {/* Content section */}
        <div className="relative p-5">
          {/* Category */}
          <div className="text-xs text-neon-purple-400/70 font-mono mb-2 uppercase tracking-wider">
            {product.categoryName || product.category?.name || ''}
          </div>

          {/* Name */}
          <Link href={product.productUrl || `/product/${product.slug}`}>
            <h3 className="font-inter text-lg font-bold text-white mb-3 group-hover:text-neon-purple-300 transition-colors duration-300 line-clamp-1 cursor-pointer">
              {product.title}
            </h3>
          </Link>

          {/* Specs badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <SpecBadge
              icon={<Cpu className="w-3 h-3" />}
              label={cpuShort}
              highlight={!!specs.cpu}
            />
            <SpecBadge 
              icon={<Zap className="w-3 h-3" />} 
              label={gpuShort}
            />
            <SpecBadge 
              icon={<MemoryStick className="w-3 h-3" />} 
              label={ramShort ? `${ramShort} GB` : null}
            />
            <SpecBadge 
              icon={<HardDrive className="w-3 h-3" />} 
              label={ssdShort}
            />
          </div>

          {/* Price section */}
          <div className="flex items-end justify-between mb-4">
            <div>
              {(product.hasDiscount || product.price.hasDiscount) && (product.formattedOriginalPrice || product.displayOriginalPrice) ? (
                <>
                  <div className="text-sm text-white/40 line-through font-mono">
                    {product.formattedOriginalPrice || product.displayOriginalPrice}
                  </div>
                  <div className="text-2xl font-inter font-black text-transparent bg-gradient-to-r from-neon-purple-400 to-neon-purple-400 bg-clip-text">
                    {product.formattedPrice || product.displayPrice}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-inter font-black text-white">
                  {product.formattedPrice || product.displayPrice}
                </div>
              )}
            </div>

            {/* Stock status */}
            <StockStatus inStock={product.inStock ?? product.availability === 'in_stock'} />
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-2">
            {/* Details button */}
            <Link href={product.productUrl || `/product/${product.slug}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-3.5 px-6 rounded-xl overflow-hidden font-inter font-bold text-sm uppercase tracking-wider"
              >
                {/* Button gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple-600 to-neon-purple-500" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple-500 to-neon-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
                
                {/* Button text */}
                <span className="relative z-10 text-white">Подробнее</span>
              </motion.button>
            </Link>

            {/* Add to cart button */}
            {onAddToCart && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative w-14 h-14 rounded-xl overflow-hidden',
                  'flex items-center justify-center',
                  'bg-neon-purple-500/20 border border-neon-purple-500/40',
                  'hover:bg-neon-purple-500/30 hover:border-neon-purple-400',
                  'transition-all duration-300'
                )}
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-5 h-5 text-neon-purple-400" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Bottom glow line */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple-500 via-neon-purple-500 to-neon-purple-500"
        />
      </div>
    </motion.article>
  );
}

// Memoize for performance
export const VKProductCard = memo(VKProductCardComponent);

// Named export for compatibility
export { VKProductCardComponent };

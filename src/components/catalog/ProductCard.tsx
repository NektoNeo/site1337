'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/cn';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* RGB Glow effect */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-purple-500 via-neon-magenta-500 to-neon-purple-600 opacity-0 group-hover:opacity-60 blur-xl transition-all duration-500 animate-glow-pulse" />
      
      {/* Card container */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-void-200 border border-neon-purple-500/20 group-hover:border-neon-magenta-400/40 transition-all duration-300">
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {product.badges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
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
              </motion.span>
            ))}
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)]"
            >
              <span className="font-display font-black text-white text-sm">-{discount}%</span>
            </motion.div>
          </div>
        )}

        {/* Image section */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-b from-void-300 to-void-200">
          {/* Tech frame corners */}
          <div className="absolute inset-4 pointer-events-none z-10">
            {/* Top left corner */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-neon-magenta-400/60" />
            {/* Top right corner */}
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-neon-magenta-400/60" />
            {/* Bottom left corner */}
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-neon-purple-400/60" />
            {/* Bottom right corner */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-neon-purple-400/60" />
          </div>

          {/* Placeholder for PC image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48 group-hover:scale-105 transition-transform duration-500">
              {/* Glow under image */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-neon-magenta-500/30 blur-xl rounded-full" />
              
              {/* PC Icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Monitor className="w-24 h-24 text-neon-purple-400/40" strokeWidth={1} />
              </div>
              
              {/* Animated scan line */}
              <motion.div
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-neon-magenta-400 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ top: '0%' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void-200 via-transparent to-transparent" />
        </div>

        {/* Content section */}
        <div className="relative p-5">
          {/* Name */}
          <h3 className="font-display text-lg font-bold text-white mb-3 group-hover:text-neon-magenta-300 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Specs badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <SpecBadge icon={<Cpu className="w-3 h-3" />} label={product.specs.processor.split(' ').slice(-1)[0]} />
            <SpecBadge icon={<Monitor className="w-3 h-3" />} label={product.specs.graphics.split(' ')[0] + ' ' + product.specs.graphics.split(' ')[1]} />
            <SpecBadge icon={<MemoryStick className="w-3 h-3" />} label={product.specs.ram.split(' ')[0]} />
          </div>

          {/* Price section */}
          <div className="flex items-end justify-between mb-4">
            <div>
              {product.salePrice ? (
                <>
                  <div className="text-sm text-white/40 line-through font-mono">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-2xl font-display font-black text-transparent bg-gradient-to-r from-neon-magenta-400 to-neon-purple-400 bg-clip-text">
                    {formatPrice(product.salePrice)}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-display font-black text-white">
                  {formatPrice(product.price)}
                </div>
              )}
            </div>
            
            {/* Stock status */}
            <div className={cn(
              'flex items-center gap-1.5 text-xs font-medium',
              product.inStock ? 'text-green-400' : 'text-red-400'
            )}>
              <div className={cn(
                'w-2 h-2 rounded-full',
                product.inStock ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              )} />
              {product.inStock ? 'В наличии' : 'Под заказ'}
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/catalog/${product.slug}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-3.5 px-6 rounded-xl overflow-hidden font-display font-bold text-sm uppercase tracking-wider"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple-600 to-neon-purple-500" />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta-500 to-neon-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
              
              {/* Button text */}
              <span className="relative z-10 text-white">Подробнее</span>
            </motion.button>
          </Link>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple-500 via-neon-magenta-500 to-neon-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.article>
  );
}

// Spec badge sub-component
function SpecBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-mono">
      <span className="text-neon-magenta-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

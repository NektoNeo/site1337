'use client';

import { motion } from 'motion/react';
import { Trash2, Cpu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType, useCartStore, formatPrice } from '@/store/cart.store';
import { QuantitySelector } from './QuantitySelector';

interface CartItemProps {
  item: CartItemType;
  index: number;
}

export function CartItem({ item, index }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ 
        opacity: 0, 
        x: -100,
        scale: 0.9,
        transition: { duration: 0.3 }
      }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
      className="group relative"
    >
      {/* Main Card */}
      <div className="
        relative overflow-hidden rounded-xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        backdrop-blur-xl
        border border-white/10
        transition-all duration-500
        hover:border-purple-500/30
        hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
      ">
        {/* Animated border gradient */}
        <div className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          pointer-events-none
        ">
          <div className="absolute inset-0 rounded-xl" style={{
            background: 'linear-gradient(45deg, transparent, rgba(139,92,246,0.1), transparent)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 2s linear infinite',
          }} />
        </div>

        {/* Content */}
        <div className="relative p-4 flex items-center gap-4">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <div className="
              relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden
              bg-gradient-to-br from-purple-900/30 to-black
              border border-white/10
              group-hover:border-purple-500/30
              transition-all duration-300
            ">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-purple-500/50" />
                </div>
              )}
              
              {/* Glow overlay */}
              <div className="
                absolute inset-0 
                bg-gradient-to-t from-purple-500/20 to-transparent 
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              " />
            </div>

            {/* Corner decoration */}
            <div className="
              absolute -top-1 -right-1 w-3 h-3
              border-t-2 border-r-2 border-cyan-500/50
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            " />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link 
              href={item.slug ? `/product/${item.slug}` : '#'}
              className="block"
            >
              <h3 className="
                font-semibold text-white text-sm md:text-base
                truncate
                hover:text-purple-400
                transition-colors duration-200
              ">
                {item.name}
              </h3>
            </Link>
            
            <p className="
              mt-1 text-xs md:text-sm text-white/50
              line-clamp-2
              font-mono
            ">
              {item.specs}
            </p>

            {/* Mobile Price */}
            <div className="mt-2 md:hidden">
              <span className="text-cyan-400 font-bold">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          </div>

          {/* Prices */}
          <div className="hidden md:flex flex-col items-end gap-1 min-w-[120px]">
            <span className="text-sm text-white/50">
              {formatPrice(item.price)} x {item.quantity}
            </span>
            <motion.span 
              key={totalPrice}
              initial={{ scale: 1.2, color: '#06B6D4' }}
              animate={{ scale: 1, color: '#FFFFFF' }}
              className="text-lg font-bold"
            >
              {formatPrice(totalPrice)}
            </motion.span>
          </div>

          {/* Remove Button */}
          <motion.button
            type="button"
            onClick={handleRemove}
            className="
              relative p-2 rounded-lg
              text-white/30 hover:text-red-400
              bg-transparent hover:bg-red-500/10
              border border-transparent hover:border-red-500/30
              transition-all duration-300
              group/remove
            "
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
            
            {/* Glow on hover */}
            <motion.div
              className="
                absolute inset-0 rounded-lg
                opacity-0 group-hover/remove:opacity-100
                transition-opacity duration-300
              "
              style={{
                boxShadow: '0 0 15px rgba(239,68,68,0.3)',
              }}
            />
          </motion.button>
        </div>

        {/* Mobile Bottom Row */}
        <div className="
          md:hidden px-4 pb-4 
          flex items-center justify-between
          border-t border-white/5 pt-3 mt-1
        ">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
          
          <div className="flex flex-col items-end">
            <span className="text-xs text-white/40">Итого</span>
            <motion.span 
              key={totalPrice}
              initial={{ scale: 1.1, color: '#06B6D4' }}
              animate={{ scale: 1, color: '#FFFFFF' }}
              className="text-base font-bold"
            >
              {formatPrice(totalPrice)}
            </motion.span>
          </div>
        </div>

        {/* Scan line effect */}
        <motion.div
          className="
            absolute left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent
            pointer-events-none
          "
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
          style={{ opacity: 0.3 }}
        />
      </div>

      {/* Index indicator */}
      <div className="
        absolute -left-2 top-1/2 -translate-y-1/2
        w-1 h-8 rounded-full
        bg-gradient-to-b from-purple-500 to-cyan-500
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      " />
    </motion.div>
  );
}

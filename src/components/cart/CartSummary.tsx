'use client';

import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCartStore, formatPrice } from '@/store/cart.store';

export function CartSummary() {
  const { getTotalItems, getTotalPrice, isEmpty } = useCartStore();
  
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const empty = isEmpty();

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
      className="
        sticky top-24
        h-fit
      "
    >
      {/* Main Card */}
      <div className="
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        backdrop-blur-xl
        border border-white/10
      ">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-500/50" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16">
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-500/50" />
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16">
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-purple-500/50" />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16">
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500/50" />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="
              relative p-2 rounded-lg
              bg-gradient-to-br from-purple-500/20 to-purple-500/20
              border border-purple-500/30
            ">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              
              {/* Animated glow */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(139,92,246,0.3)',
                    '0 0 20px rgba(139,92,246,0.5)',
                    '0 0 10px rgba(139,92,246,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div>
              <h2 className="text-lg font-bold text-white">
                Ваш заказ
              </h2>
              <p className="text-sm text-white/50">
                {totalItems} {getItemsWord(totalItems)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Items count */}
          <div className="flex justify-between items-center">
            <span className="text-white/60">Товаров</span>
            <motion.span 
              key={totalItems}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-mono text-white"
            >
              {totalItems}
            </motion.span>
          </div>

          {/* Divider with circuit pattern */}
          <div className="relative py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-purple-500/50" />
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-end">
            <span className="text-white/60">Итого</span>
            <div className="text-right">
              <motion.div
                key={totalPrice}
                initial={{ scale: 1.1, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                className="text-2xl font-bold"
              >
                <span className="bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="p-6 pt-0">
          <Link href="/checkout">
            <motion.button
              disabled={empty}
              className={`
                relative w-full py-4 px-6 rounded-xl
                font-semibold text-white
                overflow-hidden
                transition-all duration-300
                group
                ${empty 
                  ? 'bg-white/10 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-500'
                }
              `}
              whileHover={!empty ? { scale: 1.02 } : undefined}
              whileTap={!empty ? { scale: 0.98 } : undefined}
            >
              {/* Button glow */}
              {!empty && (
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 30px rgba(139,92,246,0.5), inset 0 0 30px rgba(139,92,246,0.1)',
                  }}
                />
              )}

              {/* Shimmer effect */}
              {!empty && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </div>
              )}

              {/* Button content */}
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>
                  {empty ? 'Корзина пуста' : 'Оформить заказ'}
                </span>
                {!empty && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Decorative circuit lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <defs>
            <pattern id="circuit" patternUnits="userSpaceOnUse" width="50" height="50">
              <path d="M 25 0 L 25 25 L 50 25" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-purple-500" />
              <circle cx="25" cy="25" r="2" fill="currentColor" className="text-purple-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Security badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10"
      >
        <p className="text-xs text-center text-white/40">
          Наш менеджер свяжется с вами для уточнения деталей заказа
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Get correct Russian word form for items count
 */
function getItemsWord(count: number): string {
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

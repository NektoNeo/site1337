'use client';

import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight, Cpu, Gamepad2, Monitor } from 'lucide-react';
import Link from 'next/link';

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Icon Container */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2 
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="
            absolute inset-0 -m-4
            rounded-full
            border-2 border-dashed border-purple-500/30
          "
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Middle ring */}
        <motion.div
          className="
            absolute inset-0 -m-8
            rounded-full
            border border-magenta-500/20
          "
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main icon container */}
        <div className="
          relative w-32 h-32 rounded-2xl
          bg-gradient-to-br from-white/[0.08] to-white/[0.02]
          backdrop-blur-xl
          border border-white/10
          flex items-center justify-center
          overflow-hidden
        ">
          <ShoppingCart className="w-16 h-16 text-white/30" strokeWidth={1} />
          
          {/* Scan line */}
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
          />

          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-purple-500/50" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-magenta-500/50" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-magenta-500/50" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-purple-500/50" />
        </div>

        {/* Floating icons */}
        <motion.div
          className="absolute -top-4 -right-4 text-purple-500/50"
          animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Cpu className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute -bottom-4 -left-4 text-magenta-500/50"
          animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Gamepad2 className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 -right-8 text-purple-500/30"
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Monitor className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Корзина пуста
        </h2>
        <p className="text-white/50 max-w-sm">
          Добавьте игровой ПК или комплектующие, чтобы начать сборку вашей мечты
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/catalog">
          <motion.button
            className="
              relative px-8 py-4 rounded-xl
              bg-gradient-to-r from-purple-600 to-purple-500
              font-semibold text-white
              overflow-hidden
              group
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 30px rgba(139,92,246,0.5)',
              }}
            />

            {/* Shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </div>

            <span className="relative flex items-center gap-2">
              Перейти в каталог
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Decorative circuit pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="empty-circuit" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M 50 0 L 50 40 M 50 60 L 50 100 M 0 50 L 40 50 M 60 50 L 100 50" stroke="currentColor" strokeWidth="1" fill="none" className="text-purple-500" />
              <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="1" fill="none" className="text-magenta-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#empty-circuit)" />
        </svg>
      </div>
    </motion.div>
  );
}

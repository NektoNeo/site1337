'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ShoppingCart, ArrowLeft, Loader2, Zap, Cpu, CircuitBoard } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';

// Floating Particle Component
function FloatingParticle({ delay, duration, startX, startY }: {
  delay: number;
  duration: number;
  startX: number;
  startY: number;
}) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-purple-500/60"
      initial={{ x: startX, y: startY, opacity: 0 }}
      animate={{
        x: [startX, startX + Math.random() * 100 - 50],
        y: [startY, startY - 200],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

// Animated Background Orb
function AnimatedOrb({
  className,
  color,
  size,
  animationDuration
}: {
  className: string;
  color: string;
  size: number;
  animationDuration: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[128px] ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Cart Background Component
function CartBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: i * 0.3,
      duration: 4 + Math.random() * 3,
      startX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      startY: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
    })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <AnimatedOrb
        className="top-0 left-1/4"
        color="rgba(139, 92, 246, 0.2)"
        size={400}
        animationDuration={8}
      />
      <AnimatedOrb
        className="bottom-0 right-1/4"
        color="rgba(6, 182, 212, 0.15)"
        size={350}
        animationDuration={10}
      />
      <AnimatedOrb
        className="top-1/2 right-0 -translate-y-1/2"
        color="rgba(168, 85, 247, 0.1)"
        size={300}
        animationDuration={12}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} {...particle} />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Circuit pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="cartCircuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10h80v80" fill="none" stroke="#8B5CF6" strokeWidth="0.5"/>
            <circle cx="10" cy="10" r="2" fill="#8B5CF6"/>
            <circle cx="90" cy="90" r="2" fill="#06B6D4"/>
            <path d="M50 10v40h40" fill="none" stroke="#06B6D4" strokeWidth="0.5"/>
            <circle cx="50" cy="50" r="3" fill="none" stroke="#A855F7" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cartCircuit)"/>
      </svg>

      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export default function CartPage() {
  const { items, isHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading while hydrating
  if (!mounted || !isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <CircuitBoard className="w-12 h-12 text-purple-500" />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: '0 0 30px rgba(139,92,246,0.5)',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <span className="text-white/50 font-mono text-sm tracking-wider">
            LOADING CART DATA...
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Advanced Background Effects */}
      <motion.div style={{ y: backgroundY }}>
        <CartBackground />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Back link */}
          <Link
            href="/catalog"
            className="
              inline-flex items-center gap-2 mb-6
              text-white/50 hover:text-white
              transition-colors duration-200
              group
            "
          >
            <motion.span
              className="relative"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.span>
            <span className="text-sm font-medium">Вернуться в каталог</span>
          </Link>

          {/* Title */}
          <div className="flex items-center gap-4 flex-wrap">
            <motion.div
              className="
                relative p-4 rounded-2xl
                bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-magenta-500/10
                border border-purple-500/30
                backdrop-blur-sm
              "
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ShoppingCart className="w-8 h-8 text-purple-400" />

              {/* RGB Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(139,92,246,0.3)',
                    '0 0 40px rgba(6,182,212,0.3)',
                    '0 0 20px rgba(139,92,246,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-purple-500/50"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                    Корзина
                  </span>
                </h1>
                {!isEmpty && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="
                      px-3 py-1 rounded-full
                      bg-gradient-to-r from-purple-500/20 to-magenta-500/20
                      border border-purple-500/30
                      text-sm font-mono text-purple-300
                    "
                  >
                    {items.length}
                  </motion.span>
                )}
              </motion.div>
              {!isEmpty && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/50 mt-2 flex items-center gap-2"
                >
                  <motion.span
                    className="inline-block w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  {items.length} {getItemsWord(items.length)} готовы к оформлению
                </motion.p>
              )}
            </div>

            {/* Decorative element */}
            <motion.div
              className="hidden md:flex items-center gap-3 ml-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Cpu className="w-4 h-4 text-magenta-500" />
                </motion.div>
                <span className="text-xs text-white/40 font-mono tracking-wider">VA-PC.CART.v2</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative line with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-8 h-px bg-gradient-to-r from-purple-500/50 via-magenta-500/30 to-transparent origin-left relative"
          >
            <motion.div
              className="absolute left-0 top-0 w-20 h-px bg-gradient-to-r from-purple-500 to-magenta-500"
              animate={{ x: ['0%', '500%', '0%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </motion.header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <EmptyCart key="empty" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CartItem item={item} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary Sidebar */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="sticky top-24">
                  <CartSummary />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom decorative elements */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        {/* Gradient line */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        {/* Corner accents */}
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-purple-500/20 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-magenta-500/20 rounded-br-lg" />
      </div>
    </div>
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

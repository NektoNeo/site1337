'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../ui/ProductCard';

const products = [
  {
    id: 1,
    name: 'VA-PC Starter',
    specs: {
      cpu: 'Intel Core i5-14600K',
      gpu: 'RTX 4070 12GB',
      ram: '32GB DDR5 5600MHz',
      storage: '1TB NVMe Gen4',
    },
    price: 159900,
    badge: 'Популярный',
  },
  {
    id: 2,
    name: 'VA-PC Pro',
    specs: {
      cpu: 'Intel Core i7-14700K',
      gpu: 'RTX 4070 Ti SUPER',
      ram: '32GB DDR5 6000MHz',
      storage: '2TB NVMe Gen4',
    },
    price: 219900,
    originalPrice: 239900,
  },
  {
    id: 3,
    name: 'VA-PC Elite',
    specs: {
      cpu: 'Intel Core i7-14700KF',
      gpu: 'RTX 4080 SUPER 16GB',
      ram: '64GB DDR5 6000MHz',
      storage: '2TB NVMe Gen4',
    },
    price: 299900,
    badge: 'Выбор геймеров',
  },
  {
    id: 4,
    name: 'VA-PC Predator',
    specs: {
      cpu: 'Intel Core i9-14900K',
      gpu: 'RTX 4090 24GB',
      ram: '64GB DDR5 6400MHz',
      storage: '4TB NVMe Gen4',
    },
    price: 459900,
    badge: 'Топ',
  },
  {
    id: 5,
    name: 'VA-PC Stream',
    specs: {
      cpu: 'Intel Core i7-14700K',
      gpu: 'RTX 4070 Ti 12GB',
      ram: '64GB DDR5 5600MHz',
      storage: '2TB NVMe Gen4',
    },
    price: 249900,
  },
  {
    id: 6,
    name: 'VA-PC Workstation',
    specs: {
      cpu: 'Intel Core i9-14900K',
      gpu: 'RTX 4080 16GB',
      ram: '128GB DDR5 5600MHz',
      storage: '4TB NVMe RAID',
    },
    price: 489900,
    badge: 'Для работы',
  },
];

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Готовые <span className="text-gradient-purple">сборки</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl">
              Проверенные конфигурации с идеальным балансом компонентов. Каждый ПК протестирован и готов к играм
            </p>
          </div>
          
          {/* Navigation arrows */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
        
        {/* Products Carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
          
          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[320px] md:w-[350px] snap-start"
              >
                <ProductCard
                  name={product.name}
                  specs={product.specs}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  badge={product.badge}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/catalog"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            whileHover={{ x: 5 }}
          >
            <span>Смотреть все модели</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

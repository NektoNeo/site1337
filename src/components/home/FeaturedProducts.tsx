'use client';

/**
 * Featured Products Section
 * Displays a carousel of VK products from the catalog
 * Uses shadcn/embla-carousel for smooth navigation and touch support
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { useVKCatalogPage } from '@/hooks/use-vk-catalog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

// Loading skeleton
function FeaturedSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[320px] md:w-[350px] h-[480px] rounded-2xl bg-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

// Error state
function FeaturedError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-white/50 mb-4">Не удалось загрузить товары</p>
      <motion.button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 text-sm font-semibold hover:bg-purple-600/30 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Повторить
      </motion.button>
    </div>
  );
}

export function FeaturedProducts() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Fetch featured products (8 products sorted by popularity)
  const { products, isLoading, error, refetch } = useVKCatalogPage({
    filters: {
      pageSize: 8,
      sort: 'popular',
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update scroll state when carousel initializes or changes
  const onApiChange = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    emblaApi.on('select', () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    });

    emblaApi.on('reInit', () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    });
  }, []);

  // Set API and attach listeners
  const handleSetApi = useCallback(
    (emblaApi: CarouselApi) => {
      setApi(emblaApi);
      onApiChange(emblaApi);
    },
    [onApiChange]
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

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
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/50"
              whileHover={canScrollPrev ? { scale: 1.05 } : undefined}
              whileTap={canScrollPrev ? { scale: 0.95 } : undefined}
              aria-label="Прокрутить влево"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/50"
              whileHover={canScrollNext ? { scale: 1.05 } : undefined}
              whileTap={canScrollNext ? { scale: 0.95 } : undefined}
              aria-label="Прокрутить вправо"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

          {/* Loading state */}
          {isLoading && <FeaturedSkeleton />}

          {/* Error state */}
          {error && !isLoading && (
            <FeaturedError onRetry={refetch} />
          )}

          {/* Carousel */}
          {!isLoading && !error && products.length > 0 && (
            <Carousel
              setApi={handleSetApi}
              opts={{
                align: 'start',
                dragFree: true,
                containScroll: 'trimSnaps',
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {products.map((product, index) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-6 basis-auto"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="block w-[320px] md:w-[350px]"
                    >
                      <ProductCard
                        name={product.title}
                        specs={{
                          cpu: product.specs?.cpu || 'Не указано',
                          gpu: product.specs?.gpu || 'Не указано',
                          ram: product.specs?.ram || 'Не указано',
                          storage: product.specs?.ssd || 'Не указано',
                        }}
                        price={product.price.amount}
                        originalPrice={product.price.originalAmount || undefined}
                        image={product.images?.[0]?.url || ''}
                        badge={product.platformBadge || undefined}
                        index={index}
                      />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}

          {/* Empty state */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/50">Товары временно недоступны</p>
            </div>
          )}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/catalog">
            <motion.span
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <span>Смотреть все модели</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

/**
 * Featured Products Section - OPTIMIZED FOR PERFORMANCE
 * Displays a carousel of VK products from the catalog
 * Uses shadcn/embla-carousel for smooth navigation and touch support
 *
 * Changes from original:
 * 1. Removed Framer Motion completely
 * 2. CSS-only animations with IntersectionObserver
 * 3. Replaced whileHover/whileTap with CSS hover:/active: states
 * 4. Replaced transition-all with specific transitions
 */

import { useState, useCallback, memo, useRef, useEffect } from 'react';
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
import { cn } from '@/lib/cn';

// Loading skeleton
const FeaturedSkeleton = memo(function FeaturedSkeleton() {
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
});

// Error state
const FeaturedError = memo(function FeaturedError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <p className="text-white/50 mb-4">Не удалось загрузить товары</p>
      <button
        onClick={onRetry}
        className={cn(
          "px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30",
          "text-purple-400 text-sm font-semibold",
          "hover:bg-purple-500/30 hover:scale-105",
          "active:scale-95",
          "transition-[background-color,transform] duration-200"
        )}
      >
        Повторить
      </button>
    </div>
  );
});

// Navigation button component
const NavButton = memo(function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-12 h-12 rounded-xl bg-white/5 border border-white/10",
        "flex items-center justify-center",
        "text-white/50",
        "hover:text-white hover:bg-white/10 hover:border-purple-500/30 hover:scale-105",
        "active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        "disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-white/50 disabled:hover:scale-100",
        "transition-[color,background-color,border-color,transform,opacity] duration-200"
      )}
      aria-label={direction === 'prev' ? 'Прокрутить влево' : 'Прокрутить вправо'}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
});

export function FeaturedProducts() {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-fuchsia-500/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        >
          <div>
            <h2 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
              Готовые <span className="text-gradient-purple">сборки</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl">
              Проверенные конфигурации с идеальным балансом компонентов. Каждый ПК протестирован и готов к играм
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3">
            <NavButton
              direction="prev"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            />
            <NavButton
              direction="next"
              onClick={scrollNext}
              disabled={!canScrollNext}
            />
          </div>
        </div>

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
        <div
          className={cn(
            "text-center mt-12",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
          style={{ transitionDelay: '400ms' }}
        >
          <Link href="/catalog">
            <span
              className={cn(
                "inline-flex items-center gap-2",
                "text-purple-400 hover:text-purple-300 font-semibold",
                "cursor-pointer group",
                "transition-colors duration-200"
              )}
            >
              <span>Смотреть все модели</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

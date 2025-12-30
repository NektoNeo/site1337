'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

// ============================================
// CASES (REVIEWS) - OPTIMIZED FOR PERFORMANCE
// ============================================
// Changes from original:
// 1. Removed Framer Motion completely
// 2. CSS-only animations with IntersectionObserver
// 3. Mobile carousel uses CSS transitions instead of AnimatePresence
// 4. Replaced transition-all with specific transitions
// ============================================

const reviews = [
  {
    image: '/images/cases/1.jpg',
    service: 'Услуга — сборка ПК',
    name: 'Михаил',
    text: 'Все супер) Рекомендую обратиться в эту компанию, если вы ищете надежных специалистов по сборке компьютеров.',
    rating: 5,
  },
  {
    image: '/images/cases/2.jpg',
    service: 'Услуга — апгрейд ПК',
    name: 'Алексей',
    text: 'Отличная компьютерная мастерская! Я обратился к ним, чтобы собрать свой первый компьютер, ребята сделали все на высшем уровне.',
    rating: 5,
  },
  {
    image: '/images/cases/3.jpg',
    service: 'Услуга — сборка ПК',
    name: 'Василиса',
    text: 'Эти ребята лучшие!! Я честно говоря полный ноль в компах, но они по ходу сборки максимально доступно смогли объяснить принципы всего этого процесса. Спасибо :)))',
    rating: 5,
  },
  {
    image: '/images/cases/4.jpg',
    service: 'Услуга — сборка ПК',
    name: 'Иван',
    text: 'Спасибо за такую красоту))) И за оказанную помощь. В уточнениях и советах при выборе комплектующих. Желаю удачи вашему делу)))',
    rating: 5,
  },
];

const ReviewCard = memo(function ReviewCard({
  review,
  index,
  isVisible,
}: {
  review: typeof reviews[0];
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden",
        "hover:border-purple-500/50",
        "transition-[opacity,transform,border-color] duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      {/* Review image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={review.image}
          alt={`Сборка для ${review.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="p-6">
        {/* Service badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-4">
          {review.service}
        </div>

        {/* Quote icon */}
        <Quote className="absolute top-52 right-6 w-8 h-8 text-purple-500/20" />

        {/* Customer name */}
        <h3 className="text-xl font-bold text-white mb-2">{review.name}</h3>

        {/* Review text */}
        <p className="text-gray-400 leading-relaxed">{review.text}</p>

        {/* Rating */}
        <div className="flex gap-1 mt-4">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
});

// Mobile carousel card with CSS-only transitions
const MobileReviewCard = memo(function MobileReviewCard({
  review,
  isActive,
}: {
  review: typeof reviews[0];
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden",
        "transition-[opacity,transform] duration-300 ease-out",
        isActive
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-12 absolute inset-0 pointer-events-none"
      )}
    >
      {/* Review image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={review.image}
          alt={`Сборка для ${review.name}`}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-4">
          {review.service}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{review.name}</h3>

        <p className="text-gray-400 mb-4">{review.text}</p>

        <div className="flex gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
});

export function Cases() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  const nextReview = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section ref={sectionRef} id="reviews" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-16",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              ОТЗЫВЫ КЛИЕНТОВ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Реальные отзывы от наших клиентов — мы гордимся каждой сборкой
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.name}
              review={review}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <div className="relative min-h-[400px]">
            {reviews.map((review, index) => (
              <MobileReviewCard
                key={review.name}
                review={review}
                isActive={index === activeIndex}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prevReview}
              className={cn(
                "p-2 bg-white/5 border border-white/10 rounded-full",
                "hover:bg-purple-500/20",
                "transition-[background-color] duration-200"
              )}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "h-2 rounded-full",
                    "transition-[width,background-color] duration-300",
                    i === activeIndex
                      ? "bg-purple-500 w-6"
                      : "bg-white/20 w-2"
                  )}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className={cn(
                "p-2 bg-white/5 border border-white/10 rounded-full",
                "hover:bg-purple-500/20",
                "transition-[background-color] duration-200"
              )}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div
          className={cn(
            "text-center mt-12",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
          style={{ transitionDelay: '450ms' }}
        >
          <a
            href="https://vk.com/topic-218975719_49337252"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4",
              "bg-white/5 border border-white/10 text-white font-bold rounded-xl",
              "hover:bg-purple-500/20 hover:border-purple-500/30",
              "transition-[background-color,border-color] duration-300"
            )}
          >
            Все отзывы в VK
          </a>
        </div>
      </div>
    </section>
  );
}

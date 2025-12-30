'use client';

import { memo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Gift as GiftIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

// ============================================
// GIFTS - OPTIMIZED FOR PERFORMANCE
// ============================================
// Changes from original:
// 1. Removed Framer Motion completely
// 2. CSS-only animations with IntersectionObserver
// 3. Staggered animations via transition-delay
// 4. Replaced transition-all with specific transitions
// ============================================

const gifts = [
  {
    title: 'Фирменная гарантия',
    description: 'Документы и гарантийная поддержка — всегда на связи.',
    img: '/IMG_4649.JPG',
  },
  {
    title: 'Чеки и коробки',
    description: 'Полный комплект чеков и коробок от комплектующих.',
    img: '/IMG_4605.JPG',
  },
  {
    title: 'Гайды и пресеты',
    description: 'Готовые пресеты, чек-листы и рекомендации по настройке.',
    img: '/images/gifts/screen.png',
  },
];

const GiftCard = memo(function GiftCard({
  gift,
  index,
  isVisible,
}: {
  gift: typeof gifts[0];
  index: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={cn(
        "relative group bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden text-left",
        "border border-white/10 hover:border-purple-500/30",
        "transition-[opacity,transform] duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      <div className="relative h-48">
        <Image
          src={gift.img}
          alt={gift.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Top gradient for subtle readability */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2">{gift.title}</h3>
        <p className="text-gray-400">{gift.description}</p>
      </div>
    </article>
  );
});

export function Gifts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-purple-900/5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div
          className={cn(
            "text-center mb-16",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-full text-white text-sm mb-6">
            <GiftIcon className="w-4 h-4 text-purple-400" />
            БОНУСЫ ДЛЯ КЛИЕНТОВ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              ВМЕСТЕ С ПК ВЫ ПОЛУЧИТЕ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Упаковываем гайды, чек-листы и пресеты, чтобы вы получили максимум производительности без головной боли
          </p>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {gifts.map((gift, index) => (
            <GiftCard
              key={gift.title}
              gift={gift}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "text-center mt-12",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
          style={{ transitionDelay: '450ms' }}
        >
          <a
            href="#form"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4",
              "bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl",
              "hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105",
              "transition-[box-shadow,transform] duration-300"
            )}
          >
            <GiftIcon className="w-5 h-5" />
            Получить подарки
          </a>
        </div>
      </div>
    </section>
  );
}

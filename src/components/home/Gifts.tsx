'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { Shield, BookOpen, Gift } from 'lucide-react';
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
    icon: Shield,
    title: 'Фирменная гарантия',
    description: 'Фирменную гарантию на компьютер от VA-PC. Вы сможете обратиться к нам по гарантии в течение года.',
    color: 'purple',
  },
  {
    icon: Gift,
    title: 'Чек и коробки',
    description: 'Чек и коробки от комплектующих для возможного гарантийного обслуживания.',
    color: 'purple',
  },
  {
    icon: BookOpen,
    title: 'Личное письмо',
    description: 'Личное письмо от всей команды VA-PC с благодарностью и инструкциями по использованию.',
    color: 'green',
  },
];

const colorClasses = {
  purple: {
    gradient: 'from-purple-600 to-purple-400',
    border: 'border-purple-500/30',
    glow: 'bg-purple-500/10',
  },
  green: {
    gradient: 'from-green-600 to-green-400',
    border: 'border-green-500/30',
    glow: 'bg-green-500/10',
  },
};

const GiftCard = memo(function GiftCard({
  gift,
  index,
  isVisible,
}: {
  gift: typeof gifts[0];
  index: number;
  isVisible: boolean;
}) {
  const Icon = gift.icon;
  const colors = colorClasses[gift.color as keyof typeof colorClasses];

  return (
    <div
      className={cn(
        "relative group bg-black/40 backdrop-blur-sm rounded-2xl p-8 text-center",
        colors.border,
        "border",
        "hover:scale-105",
        "transition-[opacity,transform] duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      )}
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300",
          colors.glow
        )}
      />

      <div className="relative z-10">
        {/* Number badge */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          {index + 1}
        </div>

        {/* Icon */}
        <div
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6",
            "bg-gradient-to-br",
            colors.gradient
          )}
        >
          <Icon className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{gift.title}</h3>
        <p className="text-gray-400">{gift.description}</p>
      </div>
    </div>
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
            <Gift className="w-4 h-4 text-purple-400" />
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
            <Gift className="w-5 h-5" />
            Получить подарки
          </a>
        </div>
      </div>
    </section>
  );
}

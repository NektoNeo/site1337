'use client';

import { memo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

// ============================================
// SERVICES - OPTIMIZED FOR PERFORMANCE
// ============================================
// Changes from original:
// 1. Removed Framer Motion completely
// 2. CSS-only animations with IntersectionObserver
// 3. Staggered animations via transition-delay
// 4. Replaced transition-all with specific transitions
// ============================================

const services = [
  {
    image: '/images/services/service_1.png',
    title: 'ИНДИВИДУАЛЬНАЯ СБОРКА',
    features: [
      'Высокая мощность или компактность? Соберем ПК лично под вас',
      'Никаких "паутин" из проводов',
      'Обновим и настроим BIOS',
      'Стресс-тест после сборки – отправим только рабочий ПК',
    ],
  },
  {
    image: '/images/services/service_2.png',
    title: 'РЕМОНТ',
    features: [
      'Найдем неисправность',
      'Обсудим ремонт, стоимость и сроки',
      'Заменим комплектующие и устраним неисправность',
      'Расскажем, как продлить жизнь ПК',
    ],
  },
  {
    image: '/images/services/service_3.png',
    title: 'АПГРЕЙД',
    features: [
      'Оценим и проанализируем возможность апгрейда',
      'Подберем оптимальные комплектующие под ваш бюджет',
      'Установим новые компоненты',
      'Проверим работоспособность улучшенного ПК',
    ],
  },
  {
    image: '/images/services/service_4.png',
    title: 'ЛИЧНАЯ КОНСУЛЬТАЦИЯ',
    features: [
      'Игры, а может монтаж? – Учтем предпочтения и предложим варианты',
      'Обсудим цену, мощность, комплектующие – все',
      'Расположение ПК, периферия – учтем все',
    ],
  },
];

const ServiceCard = memo(function ServiceCard({
  service,
  index,
  isVisible,
}: {
  service: typeof services[0];
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6",
        "hover:border-purple-500/50",
        "transition-[opacity,transform,border-color] duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Image */}
        <div className="w-16 h-16 mb-4 relative">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="64px"
            className="object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 font-inter">{service.title}</h3>

        {/* Features list */}
        <ul className="space-y-2">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-500 mt-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export function Services() {
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
    <section ref={sectionRef} id="services" className="py-24 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div
          className={cn(
            "text-center mb-16",
            "transition-[opacity,transform] duration-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              НАШИ УСЛУГИ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Полный цикл работы с компьютером — от сборки до обслуживания
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
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
          style={{ transitionDelay: '400ms' }}
        >
          <a
            href="/configurator"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4",
              "bg-gradient-to-r from-purple-600 to-purple-600 text-white font-bold rounded-xl",
              "hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105",
              "transition-[box-shadow,transform] duration-300"
            )}
          >
            Подобрать конфигурацию
          </a>
        </div>
      </div>
    </section>
  );
}

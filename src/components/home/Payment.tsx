'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

// ============================================
// PAYMENT - OPTIMIZED FOR PERFORMANCE
// ============================================
// Changes from original:
// 1. Removed Framer Motion completely
// 2. CSS-only animations with IntersectionObserver
// 3. Staggered animations via transition-delay
// 4. Replaced transition-all with specific transitions
// ============================================

const steps = [
  {
    number: '01',
    title: 'Оставляете заявку',
    description: 'Получаете консультацию по бюджету и требованиям',
  },
  {
    number: '02',
    title: 'Согласовываем',
    description: 'Согласовываем конфигурацию, отправляем договор и ссылку на оплату',
  },
  {
    number: '03',
    title: 'Получаете ПК',
    description: 'Банк подтверждает лимит — собираем, тестируем и доставляем',
  },
];

const StepCard = memo(function StepCard({
  step,
  index,
  isVisible,
  isLast,
}: {
  step: typeof steps[0];
  index: number;
  isVisible: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className={cn(
        "relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 pl-20",
        "transition-[opacity,transform] duration-500 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5"
      )}
      style={{ transitionDelay: `${200 + index * 100}ms` }}
    >
      {/* Step number */}
      <div className="absolute left-6 top-6 text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
        {step.number}
      </div>

      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-10 top-full h-6 w-px bg-gradient-to-b from-purple-500 to-transparent" />
      )}

      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
      <p className="text-gray-400">{step.description}</p>
    </div>
  );
});

const PriceCard = memo(function PriceCard({
  item,
  index,
  isVisible,
}: {
  item: { price: string; label: string };
  index: number;
  isVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "text-center p-4 bg-white/5 border border-white/10 rounded-xl",
        "transition-[opacity,transform] duration-500 ease-out",
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90"
      )}
      style={{ transitionDelay: `${500 + index * 100}ms` }}
    >
      <p className="text-xs text-gray-500 uppercase mb-1">от</p>
      <p className="text-xl font-bold text-white">{item.price} ₽</p>
      <p className="text-xs text-gray-400">в месяц</p>
      <p className="text-xs text-purple-400 mt-1">{item.label}</p>
    </div>
  );
});

export function Payment() {
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

  const prices = [
    { price: '4 500', label: 'VA PHOENIX' },
    { price: '5 300', label: 'VA ROSE' },
    { price: '6 200', label: 'VA BETA' },
  ];

  return (
    <section ref={sectionRef} id="payment" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <div
            className={cn(
              "transition-[opacity,transform] duration-600 ease-out",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            )}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
              <CreditCard className="w-4 h-4" />
              РАССРОЧКА ОТ ТИНЬКОФФ
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Рассрочка{' '}
              <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                без переплат
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Одобрение за 5–10 минут
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                'Без первоначального взноса',
                'Без процентов и скрытых платежей',
                'Срок до 24 месяцев',
                'Досрочное погашение без комиссий',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Tinkoff logo placeholder */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-bold text-xl">
                T
              </div>
              <span className="text-yellow-400 font-medium">Тинькофф Кредит</span>
            </div>
          </div>

          {/* Right side - Steps */}
          <div
            className={cn(
              "space-y-6",
              "transition-[opacity,transform] duration-600 ease-out",
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            )}
            style={{ transitionDelay: '100ms' }}
          >
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isVisible={isVisible}
                isLast={index === steps.length - 1}
              />
            ))}

            {/* Example prices */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {prices.map((item, i) => (
                <PriceCard
                  key={i}
                  item={item}
                  index={i}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

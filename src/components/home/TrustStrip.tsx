'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Icons for trust metrics
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </svg>
  );
}

function VKIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 9.5c3 0 4 3 4 3s1-3 4-3M11 12.5s1 4 4 4" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function TestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

const TRUST_ITEMS = [
  {
    label: 'YouTube',
    value: '250K+',
    description: 'подписчиков',
    icon: YouTubeIcon,
    color: 'text-red-400',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]',
  },
  {
    label: 'VK сообщество',
    value: '15K+',
    description: 'участников',
    icon: VKIcon,
    color: 'text-blue-400',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]',
  },
  {
    label: 'Доставка',
    value: '50+',
    description: 'городов РФ',
    icon: TruckIcon,
    color: 'text-purple-400',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  },
  {
    label: 'Гарантия',
    value: '12+',
    description: 'месяцев',
    icon: ShieldIcon,
    color: 'text-emerald-400',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]',
  },
  {
    label: 'Стресс-тесты',
    value: '100%',
    description: 'сборок',
    icon: TestIcon,
    color: 'text-amber-400',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
  },
];

interface TrustItemProps {
  item: typeof TRUST_ITEMS[0];
  index: number;
  reducedMotion: boolean | null;
}

function TrustItem({ item, index, reducedMotion }: TrustItemProps) {
  const Icon = item.icon;

  const content = (
    <div
      className={cn(
        'group rounded-2xl border border-purple-500/10 bg-purple-500/5',
        'px-5 py-4 transition-all duration-300',
        'hover:border-purple-500/30 hover:bg-purple-500/10',
        item.hoverGlow
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('p-2 rounded-lg bg-white/5', item.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm text-white/50">{item.label}</p>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
      <p className="text-xs text-white/40 uppercase tracking-wider">{item.description}</p>
    </div>
  );

  if (reducedMotion) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {content}
    </motion.div>
  );
}

export function TrustStrip() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="px-4 py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-400/60 mb-2">
              Социальные доказательства
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Нам доверяют комьюнити и партнёры
            </h2>
          </div>
          <p className="text-sm text-white/60 max-w-xl leading-relaxed">
            Мы публично собираем системы в прямом эфире, делимся процессом и отвечаем на вопросы.
            Это прозрачность, которую можно проверить в любой момент.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TRUST_ITEMS.map((item, index) => (
            <TrustItem
              key={item.label}
              item={item}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Eye, Clock, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ShortItem } from '@/lib/youtube';

const FALLBACK_SHORTS: ShortItem[] = [
  {
    id: 'local-1',
    title: 'Сборка VA PHOENIX для стримера',
    description: 'RTX 4080 + i7-14700K, RGB подсветка Corsair iCUE',
    thumbnail: '/images/live/build-1.jpg',
    publishedAt: '2025-01-05T10:00:00Z',
    url: 'https://vk.com/vapcbuild',
    type: 'build',
  },
  {
    id: 'local-2',
    title: 'Стресс-тест системы охлаждения',
    description: 'Проверяем температуры под нагрузкой, настраиваем кривые вентиляторов',
    thumbnail: '/images/live/test-1.jpg',
    publishedAt: '2025-01-04T12:00:00Z',
    url: 'https://vk.com/vapcbuild',
    type: 'test',
  },
  {
    id: 'local-3',
    title: 'Распаковка RTX 4090 ASUS ROG',
    description: 'Новая топовая видеокарта для проекта Creator',
    thumbnail: '/images/live/unbox-1.jpg',
    publishedAt: '2025-01-03T09:00:00Z',
    url: 'https://vk.com/vapcbuild',
    type: 'unboxing',
  },
  {
    id: 'local-4',
    title: 'Компактный ITX билд',
    description: 'Meshlicious + RTX 4070 Ti, максимум производительности в минимуме объёма',
    thumbnail: '/images/live/build-2.jpg',
    publishedAt: '2025-01-02T09:00:00Z',
    url: 'https://vk.com/vapcbuild',
    type: 'build',
  },
];

const typeLabels: Record<string, { label: string }> = {
  build: { label: 'СБОРКА' },
  test: { label: 'ТЕСТЫ' },
  unboxing: { label: 'РАСПАКОВКА' },
};

export function Live() {
  const [isLoading, setIsLoading] = useState(true);
  const [shorts, setShorts] = useState<ShortItem[]>(FALLBACK_SHORTS);

  useEffect(() => {
    let cancelled = false;
    async function loadShorts() {
      try {
        const response = await fetch('/api/shorts');
        if (!response.ok) throw new Error('Failed to load shorts');
        const data = await response.json();
        if (!cancelled && Array.isArray(data?.shorts)) {
          setShorts(data.shorts);
        }
      } catch (error) {
        console.warn('[Live] fallback to local shorts', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadShorts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-24 relative">
      {/* Pulsing live indicator */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <span className="text-sm text-red-400 font-medium">LIVE</span>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              LIVE ЛЕНТА
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Следите за процессом сборки в реальном времени
          </p>
        </motion.div>

        {isLoading ? (
          // Loading skeleton
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                <div className="w-full h-40 bg-white/10 rounded-lg mb-4" />
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shorts.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#111]">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 border border-white/20 rounded text-xs font-medium text-white">
                    {typeLabels[item.type ?? 'build']?.label ?? 'ВИДЕО'}
                  </div>

                  <ExternalLink className="absolute top-2 right-2 w-4 h-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs line-clamp-2 mb-3">{item.description}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <div className="flex items-center gap-1 text-white/50">
                      <Eye className="w-3 h-3" />
                      <span>Shorts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatPublishedAt(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* VK Widget integration hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="https://www.youtube.com/@vapc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white/70 font-medium rounded-xl hover:border-white/40 transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.7 9.4.7 9.4.7s7.5 0 9.4-.7a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8ZM9.75 15.02V8.98L15.5 12z"/>
            </svg>
            Смотреть все на YouTube
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function formatPublishedAt(dateString: string) {
  if (!dateString) return 'в эфире';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

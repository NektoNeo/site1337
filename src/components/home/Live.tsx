'use client';

import { motion } from 'framer-motion';
import { Play, Eye, Clock, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock data for live feed - in production this would come from VK API
const liveItems = [
  {
    id: 1,
    type: 'build',
    title: 'Сборка VA PHOENIX для стримера',
    description: 'RTX 4080 + i7-14700K, RGB подсветка Corsair iCUE',
    thumbnail: '/images/live/build-1.jpg',
    views: 1247,
    date: '2 часа назад',
  },
  {
    id: 2,
    type: 'test',
    title: 'Стресс-тест системы охлаждения',
    description: 'Проверяем температуры под нагрузкой, настраиваем кривые вентиляторов',
    thumbnail: '/images/live/test-1.jpg',
    views: 892,
    date: '5 часов назад',
  },
  {
    id: 3,
    type: 'unboxing',
    title: 'Распаковка RTX 4090 ASUS ROG',
    description: 'Новая топовая видеокарта для проекта Creator',
    thumbnail: '/images/live/unbox-1.jpg',
    views: 2341,
    date: '1 день назад',
  },
  {
    id: 4,
    type: 'build',
    title: 'Компактный ITX билд',
    description: 'Meshlicious + RTX 4070 Ti, максимум производительности в минимуме объёма',
    thumbnail: '/images/live/build-2.jpg',
    views: 1563,
    date: '2 дня назад',
  },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  build: { label: 'СБОРКА', color: 'bg-purple-500' },
  test: { label: 'ТЕСТЫ', color: 'bg-cyan-500' },
  unboxing: { label: 'РАСПАКОВКА', color: 'bg-green-500' },
};

export function Live() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
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
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
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
            {liveItems.map((item, index) => (
              <motion.a
                key={item.id}
                href="https://vk.com/vapcbuild"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-cyan-900/50">
                  {/* Placeholder gradient - replace with actual images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 ${typeLabels[item.type].color} rounded text-xs font-bold text-white`}>
                    {typeLabels[item.type].label}
                  </div>

                  {/* External link indicator */}
                  <ExternalLink className="absolute top-2 right-2 w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{item.description}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.date}</span>
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
            href="https://vk.com/vapcbuild"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-medium rounded-xl hover:bg-blue-600/30 transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.756 4 8.316c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.847 2.455 2.27 4.607 2.862 4.607.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.305-.491.745-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
            </svg>
            Смотреть все в ВКонтакте
          </a>
        </motion.div>
      </div>
    </section>
  );
}

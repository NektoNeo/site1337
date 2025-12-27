'use client';

import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const cases = [
  {
    category: 'Для симрейсинга и VR',
    project: 'Lavington',
    description: 'Собрали тихую машину для VR-гонок. Настроили вентиляторы по кривым, добились комфортных температур и без свиста под нагрузкой.',
    specs: ['RTX 4080', 'i7-14700K', '32GB DDR5'],
    image: '/images/cases/simracing.jpg',
  },
  {
    category: '3D, рендер, монтаж',
    project: 'MotionLab',
    description: 'Баланс GPU/CPU для Autodesk Maya и Premiere Pro. Оставили запас по питанию и охлаждению под будущий апгрейд.',
    specs: ['RTX 4090', 'Ryzen 9 7950X', '64GB DDR5'],
    image: '/images/cases/3d-render.jpg',
  },
  {
    category: 'Киберспорт',
    project: 'Midlane',
    description: 'Топовый FPS в CS2 и Valorant. Оптимизировали BIOS, отключили лишние службы Windows, проверили стабильность на соревновательных настройках.',
    specs: ['RTX 4070 Ti', 'i5-14600K', '32GB DDR5'],
    image: '/images/cases/esports.jpg',
  },
  {
    category: 'Работа + игры',
    project: 'Creator',
    description: 'Делали упор на тишину: широкие вентиляторы, демпферные панели и грамотный airflow. Бенчмарки и шум — в карте сборки.',
    specs: ['RTX 4070', 'Ryzen 7 7800X3D', '32GB DDR5'],
    image: '/images/cases/workstation.jpg',
  },
];

export function Cases() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCase = () => setActiveIndex((prev) => (prev + 1) % cases.length);
  const prevCase = () => setActiveIndex((prev) => (prev - 1 + cases.length) % cases.length);

  return (
    <section id="cases" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              НАШИ КЕЙСЫ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Реальные проекты для разных задач — от киберспорта до продакшена
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {cases.map((item, index) => (
            <motion.div
              key={item.project}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Category badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-4">
                {item.category}
              </div>

              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-purple-500/20" />

              {/* Project name */}
              <h3 className="text-xl font-bold text-white mb-1">
                Проект: <span className="text-purple-400">{item.project}</span>
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-4 leading-relaxed">{item.description}</p>

              {/* Specs badges */}
              <div className="flex flex-wrap gap-2">
                {item.specs.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="absolute bottom-6 right-6 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-4">
              {cases[activeIndex].category}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Проект: <span className="text-purple-400">{cases[activeIndex].project}</span>
            </h3>

            <p className="text-gray-400 mb-4">{cases[activeIndex].description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {cases[activeIndex].specs.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prevCase}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-purple-500/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2">
              {cases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIndex ? 'bg-purple-500 w-6' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextCase}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-purple-500/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* CTA */}
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
          >
            Все отзывы
          </a>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const stages = [
  {
    number: '01',
    title: 'Оставьте заявку',
    description: 'Напишите в Telegram или заполните форму на сайте.',
    img: '/IMG_3026.JPG',
  },
  {
    number: '02',
    title: 'Подбор конфигурации',
    description: 'Согласуем комплектующие под ваши задачи и бюджет.',
    img: '/IMG_4605.JPG',
  },
  {
    number: '03',
    title: 'Сборка и выдача',
    description: 'Соберём, протестируем и передадим с гарантией.',
    img: '/IMG_7781.JPG',
  },
];

export function Stages() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              ЭТАПЫ РАБОТЫ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            От заявки до готового ПК — прозрачный процесс
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {stages.map((stage, index) => (
            <motion.article
              key={stage.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={stage.img}
                  alt={stage.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Fade overlay for readability */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                {/* Number badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-purple-500/40">
                  <span className="text-sm font-bold text-purple-300">ШАГ {stage.number}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{stage.title}</h3>
                <p className="text-gray-400 leading-relaxed">{stage.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

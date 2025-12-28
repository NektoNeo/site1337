'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Settings, Truck } from 'lucide-react';

const stages = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Оставьте заявку',
    description: 'Оставьте заявку на сайте или свяжитесь с нашим менеджером.',
    color: 'from-purple-600 to-purple-400',
  },
  {
    icon: Settings,
    number: '02',
    title: 'Обсуждение сборки',
    description: 'Подробно обсудим ход выполнения сборки и подберем необходимые комплектующие под ваш запрос.',
    color: 'from-purple-600 to-purple-400',
  },
  {
    icon: Truck,
    number: '03',
    title: 'Сборка и доставка',
    description: 'Соберем ПК вашей мечты, сделаем все необходимые тесты, бережно упакуем и доставим.',
    color: 'from-green-600 to-green-400',
  },
];

export function Stages() {
  return (
    <section className="py-24 relative">
      {/* Decorative cross */}
      <div className="absolute top-12 right-12 w-8 h-8 opacity-20">
        <div className="absolute top-1/2 left-0 w-full h-px bg-purple-400" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-purple-400" />
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
              ЭТАПЫ РАБОТЫ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            От заявки до готового ПК — прозрачный процесс
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent hidden lg:block" />

          <div className="grid lg:grid-cols-3 gap-8">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-purple-500/30 transition-all duration-300">
                    {/* Number badge */}
                    <div className="absolute -top-4 left-8 px-4 py-1 bg-black border border-purple-500/50 rounded-full">
                      <span className={`text-sm font-bold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                        ШАГ {stage.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${stage.color} rounded-2xl flex items-center justify-center mb-6 mt-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">{stage.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{stage.description}</p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < stages.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-purple-500 z-10">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

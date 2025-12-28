'use client';

import { motion } from 'framer-motion';
import { Shield, Wrench, BookOpen, Gift } from 'lucide-react';

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
    color: 'magenta',
  },
  {
    icon: BookOpen,
    title: 'Личное письмо',
    description: 'Личное письмо от всей команды VA-PC с благодарностью и инструкциями по использованию.',
    color: 'green',
  },
];

export function Gifts() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-magenta-900/5" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-magenta-500/20 border border-purple-500/30 rounded-full text-white text-sm mb-6">
            <Gift className="w-4 h-4 text-purple-400" />
            БОНУСЫ ДЛЯ КЛИЕНТОВ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
              ВМЕСТЕ С ПК ВЫ ПОЛУЧИТЕ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Упаковываем гайды, чек-листы и пресеты, чтобы вы получили максимум производительности без головной боли
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {gifts.map((gift, index) => {
            const Icon = gift.icon;
            const colorClasses = {
              purple: 'from-purple-600 to-purple-400 border-purple-500/30 bg-purple-500/10',
              magenta: 'from-magenta-600 to-magenta-400 border-magenta-500/30 bg-magenta-500/10',
              green: 'from-green-600 to-green-400 border-green-500/30 bg-green-500/10',
            };
            const colors = colorClasses[gift.color as keyof typeof colorClasses];

            return (
              <motion.div
                key={gift.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative group bg-black/40 backdrop-blur-sm border ${colors.split(' ')[2]} rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300`}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 ${colors.split(' ')[3]} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10">
                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-purple-600 to-magenta-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${colors.split(' ').slice(0, 2).join(' ')} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{gift.title}</h3>
                  <p className="text-gray-400">{gift.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="#form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-magenta-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            <Gift className="w-5 h-5" />
            Получить подарки
          </a>
        </motion.div>
      </div>
    </section>
  );
}

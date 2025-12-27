'use client';

import { motion } from 'framer-motion';
import { Cpu, Clock, Users, BarChart3, Shield, Heart } from 'lucide-react';

const advantages = [
  {
    icon: Cpu,
    title: 'Кастом на топовых компонентах',
    description: 'Работаем с A-класс брендами и проверяем связки под конкретные задачи. Без случайных деталей и компромиссов.',
  },
  {
    icon: Clock,
    title: 'Прозрачные сроки и SLA',
    description: 'Сборка и тесты за 3–7 дней. Отчитываемся по этапам, присылаем фото/видео и чек-листы перед выдачей.',
  },
  {
    icon: Users,
    title: 'Инженеры, а не продавцы',
    description: 'Команда из геймеров и создателей контента. Объясняем решения, не навязываем лишнее и говорим на одном языке.',
  },
  {
    icon: BarChart3,
    title: 'Автотесты и контроль качества',
    description: 'Стресс-тесты, бенчмарки, замер шумов и температур. Фиксируем результаты в карте сборки.',
  },
  {
    icon: Shield,
    title: 'Официальная гарантия',
    description: 'До 24 месяцев на сборку и комплектующие. Поставки напрямую: Intel, ASUS, Gigabyte, NVIDIA и другие партнёры.',
  },
  {
    icon: Heart,
    title: 'Сообщество VA-PC Club',
    description: 'Закрытые гайды, скидки на апгрейды и приоритет в сервисе для клиентов. Помогаем развивать ПК вместе с вами.',
  },
];

export function Advantages() {
  return (
    <section className="py-24 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              НАШИ ПРЕИМУЩЕСТВА
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Почему выбирают VA-PC для сборки игровых и рабочих систем
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Cpu, Wrench, Sparkles, Truck } from 'lucide-react';

const services = [
  {
    icon: Cpu,
    title: 'Индивидуальная сборка',
    features: [
      'Разбираем ваши задачи и бюджет, подбираем комплектующие без узких мест',
      'Даем 2–3 конфигурации на выбор с понятной логикой цены',
      'Настраиваем BIOS/Windows под игры, работу, стрим',
      'Стресс-тесты и шум/температура до передачи ПК',
      'Чистый кабель-менеджмент и продуманное охлаждение',
    ],
  },
  {
    icon: Wrench,
    title: 'Апгрейд текущего ПК',
    features: [
      'Диагностика FPS/нагрева и оценка совместимости деталей',
      'Обновляем прошивки плат/BIOS, ставим актуальные драйверы',
      'Оптимизируем охлаждение и настраиваем профили вентиляторов',
      'Сохраняем данные и аккуратно перекидываем софт',
    ],
  },
  {
    icon: Sparkles,
    title: 'Сервис и уход',
    features: [
      'Глубокая чистка с заменой термопасты/термопрокладок',
      'Замер шумов и температур с настройкой тихих режимов',
      'Ребаланс подсветки и аккуратный кабель-менеджмент',
      'Годовое сопровождение по подписке VA-PC Care',
    ],
  },
  {
    icon: Truck,
    title: 'Доставка и запуск',
    features: [
      'Безопасная упаковка, трекинг и страхование отправки',
      'Курьер по Москве/СПБ или ТК по России под ключ',
      'Показываем FPS/температуры при выдаче, отвечаем на вопросы',
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              НАШИ УСЛУГИ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Полный цикл работы с компьютером — от сборки до обслуживания
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>

                  {/* Features list */}
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/configurator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            Подобрать конфигурацию
          </a>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const services = [
  {
    image: '/images/services/service_1.png',
    title: 'ИНДИВИДУАЛЬНАЯ СБОРКА',
    features: [
      'Высокая мощность или компактность? Соберем ПК лично под вас',
      'Никаких "паутин" из проводов',
      'Обновим и настроим BIOS',
      'Стресс-тест после сборки – отправим только рабочий ПК',
    ],
  },
  {
    image: '/images/services/service_2.png',
    title: 'РЕМОНТ',
    features: [
      'Найдем неисправность',
      'Обсудим ремонт, стоимость и сроки',
      'Заменим комплектующие и устраним неисправность',
      'Расскажем, как продлить жизнь ПК',
    ],
  },
  {
    image: '/images/services/service_3.png',
    title: 'АПГРЕЙД',
    features: [
      'Оценим и проанализируем возможность апгрейда',
      'Подберем оптимальные комплектующие под ваш бюджет',
      'Установим новые компоненты',
      'Проверим работоспособность улучшенного ПК',
    ],
  },
  {
    image: '/images/services/service_4.png',
    title: 'ЛИЧНАЯ КОНСУЛЬТАЦИЯ',
    features: [
      'Игры, а может монтаж? – Учтем предпочтения и предложим варианты',
      'Обсудим цену, мощность, комплектующие – все',
      'Расположение ПК, периферия – учтем все',
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              НАШИ УСЛУГИ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Полный цикл работы с компьютером — от сборки до обслуживания
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Image */}
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="64px"
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 font-inter">{service.title}</h3>

                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-purple-500 mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            Подобрать конфигурацию
          </a>
        </motion.div>
      </div>
    </section>
  );
}

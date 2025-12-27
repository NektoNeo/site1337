'use client';

import { motion } from 'framer-motion';
import { Cpu, Clock, Users, BarChart3, Shield, Heart } from 'lucide-react';

const advantages = [
  {
    icon: Cpu,
    title: 'Профессиональная сборка ПК',
    description: 'Кулер не охлаждает, блок питания слабый? – В наших сборках такого нет. Только идеальный концепт, где каждый компонент дополняет друг друга.',
  },
  {
    icon: Shield,
    title: 'Фирменная гарантия',
    description: 'Мы предоставляем гарантию на наши компьютеры в 1 год. По истечении действует гарантия от производителя.',
  },
  {
    icon: Users,
    title: 'Помощь в настройке ПК',
    description: 'При возникновении проблем с настройкой ПО или работой ПК – экстренно ответим и поможем. Сделаем все, чтобы вы начали комфортно пользоваться устройством.',
  },
  {
    icon: Clock,
    title: 'Доставка по всей России',
    description: 'Бережно доставим ПК по всей территории РФ. А при повреждении груза – компенсируется 100% стоимость ущерба.',
  },
  {
    icon: BarChart3,
    title: 'Сертифицированные компоненты',
    description: 'В наших сборках вы встретите только сертифицированные компоненты от известных компаний: INTEL, ASUS, GIGABYTE, NVIDIA.',
  },
  {
    icon: Heart,
    title: 'Бонусы от VA-PC',
    description: 'Мы добавили систему скидок. Регулярно проводим розыгрыши и акции. Снизить стоимость ПК и получить ценный приз – реально.',
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

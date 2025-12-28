'use client';

import { motion } from 'framer-motion';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Оставляете заявку',
    description: 'Получаете консультацию по бюджету и требованиям',
  },
  {
    number: '02',
    title: 'Согласовываем',
    description: 'Согласовываем конфигурацию, отправляем договор и ссылку на оплату',
  },
  {
    number: '03',
    title: 'Получаете ПК',
    description: 'Банк подтверждает лимит — собираем, тестируем и доставляем',
  },
];

export function Payment() {
  return (
    <section id="payment" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
              <CreditCard className="w-4 h-4" />
              РАССРОЧКА ОТ ТИНЬКОФФ
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Рассрочка{' '}
              <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                без переплат
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Одобрение за 5–10 минут
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                'Без первоначального взноса',
                'Без процентов и скрытых платежей',
                'Срок до 24 месяцев',
                'Досрочное погашение без комиссий',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Tinkoff logo placeholder */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-bold text-xl">
                T
              </div>
              <span className="text-yellow-400 font-medium">Тинькофф Кредит</span>
            </div>
          </motion.div>

          {/* Right side - Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 pl-20"
              >
                {/* Step number */}
                <div className="absolute left-6 top-6 text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  {step.number}
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-10 top-full h-6 w-px bg-gradient-to-b from-purple-500 to-transparent" />
                )}

                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}

            {/* Example prices */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { price: '4 500', label: 'VA PHOENIX' },
                { price: '5 300', label: 'VA ROSE' },
                { price: '6 200', label: 'VA BETA' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <p className="text-xs text-gray-500 uppercase mb-1">от</p>
                  <p className="text-xl font-bold text-white">{item.price} ₽</p>
                  <p className="text-xs text-gray-400">в месяц</p>
                  <p className="text-xs text-purple-400 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

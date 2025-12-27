'use client';

import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const reviews = [
  {
    image: '/images/cases/1.jpg',
    service: 'Услуга — сборка ПК',
    name: 'Михаил',
    text: 'Все супер) Рекомендую обратиться в эту компанию, если вы ищете надежных специалистов по сборке компьютеров.',
    rating: 5,
  },
  {
    image: '/images/cases/2.jpg',
    service: 'Услуга — апгрейд ПК',
    name: 'Алексей',
    text: 'Отличная компьютерная мастерская! Я обратился к ним, чтобы собрать свой первый компьютер, ребята сделали все на высшем уровне.',
    rating: 5,
  },
  {
    image: '/images/cases/3.jpg',
    service: 'Услуга — сборка ПК',
    name: 'Василиса',
    text: 'Эти ребята лучшие!! Я честно говоря полный ноль в компах, но они по ходу сборки максимально доступно смогли объяснить принципы всего этого процесса. Спасибо :)))',
    rating: 5,
  },
  {
    image: '/images/cases/4.jpg',
    service: 'Услуга — сборка ПК',
    name: 'Иван',
    text: 'Спасибо за такую красоту))) И за оказанную помощь. В уточнениях и советах при выборе комплектующих. Желаю удачи вашему делу)))',
    rating: 5,
  },
];

export function Cases() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
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
              ОТЗЫВЫ КЛИЕНТОВ
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Реальные отзывы от наших клиентов — мы гордимся каждой сборкой
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Review image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={review.image}
                  alt={`Сборка для ${review.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="p-6">
                {/* Service badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-4">
                  {review.service}
                </div>

                {/* Quote icon */}
                <Quote className="absolute top-52 right-6 w-8 h-8 text-purple-500/20" />

                {/* Customer name */}
                <h3 className="text-xl font-bold text-white mb-2">{review.name}</h3>

                {/* Review text */}
                <p className="text-gray-400 leading-relaxed">{review.text}</p>

                {/* Rating */}
                <div className="flex gap-1 mt-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
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
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Review image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={reviews[activeIndex].image}
                alt={`Сборка для ${reviews[activeIndex].name}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            <div className="p-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-4">
                {reviews[activeIndex].service}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{reviews[activeIndex].name}</h3>

              <p className="text-gray-400 mb-4">{reviews[activeIndex].text}</p>

              <div className="flex gap-1">
                {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={prevReview}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-purple-500/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
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
              onClick={nextReview}
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
            href="https://vk.com/topic-218975719_49337252"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300"
          >
            Все отзывы в VK
          </a>
        </motion.div>
      </div>
    </section>
  );
}

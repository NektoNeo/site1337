'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

const categories = [
  {
    id: 'gaming',
    title: 'Gaming PC',
    description: 'Максимальный FPS в любых играх. RTX 4070-4090 для ультра настроек в 4K',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    gradient: 'from-purple-600 to-purple-400',
    glow: 'purple' as const,
    stats: ['До 240+ FPS', 'RTX 4070-4090', '4K Gaming'],
  },
  {
    id: 'workstation',
    title: 'Workstation',
    description: 'Для профессионалов: 3D рендеринг, видеомонтаж, разработка и стриминг',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-magenta-600 to-magenta-400',
    glow: 'magenta' as const,
    stats: ['64GB+ RAM', 'NVMe RAID', 'Многозадачность'],
  },
  {
    id: 'streaming',
    title: 'Streaming PC',
    description: 'Стримь и играй одновременно. Мощное железо для контент-криейторов',
    icon: (
      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-magenta-500',
    glow: 'mixed' as const,
    stats: ['NVENC Encoder', 'Dual PC Setup', '1080p60/4K30'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function Categories() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Section background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-72 h-72 rounded-full bg-magenta-600/10 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Выбери свою <span className="text-gradient-purple">категорию</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Каждый компьютер собран под конкретные задачи с оптимальным балансом цены и производительности
          </p>
        </motion.div>
        
        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <GlassCard 
                hoverGlow={category.glow} 
                intensity="medium"
                className="h-full cursor-pointer group"
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Icon with gradient background */}
                  <div className="relative mb-6">
                    <div className={`
                      w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient}
                      flex items-center justify-center text-white
                      shadow-lg group-hover:shadow-xl transition-shadow duration-500
                    `}>
                      {category.icon}
                    </div>
                    
                    {/* Glow effect behind icon */}
                    <div className={`
                      absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient}
                      opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500
                    `} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-purple-200 transition-colors">
                    {category.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/50 mb-6 flex-grow group-hover:text-white/60 transition-colors">
                    {category.description}
                  </p>
                  
                  {/* Stats badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.stats.map((stat, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-white/70"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                  
                  {/* CTA Link */}
                  <motion.div 
                    className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="font-semibold">Смотреть модели</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

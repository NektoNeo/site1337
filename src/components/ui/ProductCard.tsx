'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { GlowCard } from './GlowCard';
import { memo } from 'react';

interface ProductSpec {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
}

interface ProductCardProps {
  name: string;
  specs: ProductSpec;
  price: number;
  originalPrice?: number;
  image?: string;
  badge?: string;
  index?: number;
}

export const ProductCard = memo(function ProductCard({
  name,
  specs,
  price,
  originalPrice,
  image,
  badge,
  index = 0,
}: ProductCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cardContent = (
    <GlowCard
      variant="cosmic"
      enableTilt={!shouldReduceMotion}
      tiltIntensity={8}
      enableGlow={!shouldReduceMotion}
      enableBorder={true}
      enableShine={!shouldReduceMotion}
      enableParticles={false}
      className="h-full"
    >
        <div className="p-5 flex flex-col h-full">
          {/* Badge */}
          {badge && (
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1 text-xs font-inter font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-purple-400 text-black rounded-full">
                {badge}
              </span>
            </div>
          )}
          
          {/* Image placeholder with RGB glow effect */}
          <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-purple-900/20">
            {/* RGB Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-500/20 to-purple-500/20 animate-pulse" />
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 blur-3xl"
                style={{
                  background: 'linear-gradient(to top, rgba(168,85,247,0.4), transparent)',
                }}
              />
            </div>
            
            {/* PC Icon/Placeholder - only show when no image */}
            {!image && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <svg
                    className="w-24 h-24 text-purple-400/50 group-hover:text-purple-400/70 transition-colors duration-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6v2h2a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h2v-2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v12h16V4H4z"/>
                    <circle cx="12" cy="10" r="3" className="text-purple-400/60" />
                  </svg>

                  {/* RGB Ring effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-[-10px] rounded-full border-2 border-purple-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute inset-[-20px] rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                  </div>
                </motion.div>
              </div>
            )}
            
            {image && (
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 320px, 350px"
              />
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="font-inter font-bold text-lg text-white mb-3 group-hover:text-purple-300 transition-colors">
            {name}
          </h3>
          
          {/* Specs */}
          <div className="space-y-2 mb-4 flex-grow">
            <SpecRow icon="cpu" label="CPU" value={specs.cpu} />
            <SpecRow icon="gpu" label="GPU" value={specs.gpu} accent />
            <SpecRow icon="ram" label="RAM" value={specs.ram} />
            <SpecRow icon="storage" label="SSD" value={specs.storage} />
          </div>
          
          {/* Price */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex items-end justify-between">
              <div>
                {originalPrice && (
                  <span className="text-sm text-white/40 line-through mr-2">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                <span className="text-2xl font-inter font-bold text-gradient-purple">
                  {formatPrice(price)}
                </span>
              </div>
              
              <motion.button
                className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-semibold
                  hover:bg-purple-500/30 hover:border-purple-400/50 hover:text-purple-300
                  transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Подробнее
              </motion.button>
            </div>
          </div>
        </div>
      </GlowCard>
  );

  if (shouldReduceMotion) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {cardContent}
    </motion.div>
  );
});

function SpecRow({ 
  icon, 
  label, 
  value, 
  accent = false 
}: { 
  icon: string; 
  label: string; 
  value: string; 
  accent?: boolean;
}) {
  const icons: Record<string, JSX.Element> = {
    cpu: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    gpu: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    ram: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    storage: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={accent ? 'text-purple-400' : 'text-purple-400/70'}>
        {icons[icon]}
      </span>
      <span className="text-white/50 w-10">{label}</span>
      <span className={`font-medium ${accent ? 'text-purple-300' : 'text-white/80'}`}>
        {value}
      </span>
    </div>
  );
}

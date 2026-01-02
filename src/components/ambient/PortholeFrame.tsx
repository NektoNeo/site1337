'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * PortholeFrame - Космический иллюминатор
 *
 * Создает эффект просмотра через стеклянный иллюминатор космической станции/лаборатории.
 * Включает:
 * - Металлическую раму с болтами
 * - Стеклянные блики и отражения
 * - Эффект преломления света по краям
 * - Параллакс при скролле
 */

// Болты/заклепки по периметру иллюминатора
const Bolt = memo(function Bolt({ angle, radius }: { angle: number; radius: number }) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <div
      className="absolute w-3 h-3 rounded-full"
      style={{
        left: `calc(50% + ${x}px - 6px)`,
        top: `calc(50% + ${y}px - 6px)`,
        background: 'linear-gradient(145deg, #4a4a5a, #2a2a35)',
        boxShadow: `
          inset 1px 1px 2px rgba(255,255,255,0.1),
          inset -1px -1px 2px rgba(0,0,0,0.3),
          0 1px 3px rgba(0,0,0,0.5)
        `,
      }}
    >
      {/* Крестовая насечка */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-black/40 absolute" />
        <div className="w-[1px] h-1.5 bg-black/40 absolute" />
      </div>
    </div>
  );
});

// Световой блик на стекле
const GlassHighlight = memo(function GlassHighlight() {
  return (
    <>
      {/* Основной блик сверху-слева */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          left: '12%',
          width: '35%',
          height: '25%',
          background: `
            radial-gradient(ellipse at 30% 30%,
              rgba(255,255,255,0.15) 0%,
              rgba(255,255,255,0.05) 40%,
              transparent 70%
            )
          `,
          transform: 'rotate(-15deg)',
          filter: 'blur(8px)',
        }}
      />

      {/* Вторичный блик */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          left: '8%',
          width: '20%',
          height: '8%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'rotate(-25deg)',
          filter: 'blur(4px)',
        }}
      />

      {/* Отражение снизу-справа (слабое) */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '12%',
          right: '15%',
          width: '25%',
          height: '15%',
          background: `
            radial-gradient(ellipse at 70% 70%,
              rgba(100,200,255,0.08) 0%,
              transparent 60%
            )
          `,
          filter: 'blur(10px)',
        }}
      />
    </>
  );
});

// Эффект преломления света по краям стекла
const EdgeRefraction = memo(function EdgeRefraction() {
  return (
    <div
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        background: `
          radial-gradient(circle at center,
            transparent 60%,
            rgba(100,200,255,0.03) 75%,
            rgba(150,100,255,0.05) 85%,
            rgba(255,255,255,0.02) 95%
          )
        `,
      }}
    />
  );
});

interface PortholeFrameProps {
  /** Размер иллюминатора */
  size?: 'full' | 'large' | 'medium';
  /** Интенсивность эффектов */
  intensity?: 'subtle' | 'normal' | 'strong';
  /** Дочерние элементы (контент внутри иллюминатора) */
  children?: React.ReactNode;
  /** CSS классы */
  className?: string;
  /** Включить параллакс при скролле */
  enableParallax?: boolean;
}

export const PortholeFrame = memo(function PortholeFrame({
  size = 'full',
  intensity = 'normal',
  children,
  className = '',
  enableParallax = true,
}: PortholeFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Параллакс эффект
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const frameScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Размеры в зависимости от size
  const sizeConfig = {
    full: { frame: 'w-[120vw] h-[120vh]', border: 40, boltRadius: 480 },
    large: { frame: 'w-[800px] h-[800px]', border: 30, boltRadius: 360 },
    medium: { frame: 'w-[500px] h-[500px]', border: 20, boltRadius: 220 },
  };

  const config = sizeConfig[size];
  const boltCount = size === 'full' ? 24 : size === 'large' ? 16 : 12;

  // Интенсивность эффектов
  const intensityConfig = {
    subtle: { glowOpacity: 0.3, reflectionOpacity: 0.5 },
    normal: { glowOpacity: 0.5, reflectionOpacity: 0.7 },
    strong: { glowOpacity: 0.7, reflectionOpacity: 1 },
  };

  const effectIntensity = intensityConfig[intensity];

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden ${className}`}
    >
      <motion.div
        className={`relative ${config.frame}`}
        style={{
          scale: enableParallax ? frameScale : 1,
          opacity: enableParallax ? frameOpacity : 1,
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Внешнее свечение рамы */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at center,
                transparent 45%,
                rgba(100,200,255,${0.1 * effectIntensity.glowOpacity}) 55%,
                rgba(139,92,246,${0.15 * effectIntensity.glowOpacity}) 65%,
                rgba(0,0,0,0.8) 80%,
                black 100%
              )
            `,
            filter: 'blur(20px)',
          }}
        />

        {/* Основная металлическая рама */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at center,
                transparent 48%,
                #1a1a25 49%,
                #2a2a3a 50%,
                #3a3a4a 51%,
                #2a2a35 53%,
                #1a1a25 55%,
                #15151f 60%,
                black 70%
              )
            `,
            boxShadow: `
              inset 0 0 100px rgba(0,0,0,0.5),
              inset 0 2px 4px rgba(255,255,255,0.05)
            `,
          }}
        />

        {/* Внутренний обод (chrome accent) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at center,
                transparent 47%,
                rgba(100,200,255,0.3) 48%,
                rgba(150,100,255,0.2) 49%,
                transparent 50%
              )
            `,
            filter: 'blur(1px)',
          }}
        />

        {/* Стекло иллюминатора */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            inset: '5%',
            background: `
              radial-gradient(circle at 30% 30%,
                rgba(100,200,255,0.02) 0%,
                transparent 50%
              )
            `,
            backdropFilter: 'blur(0.5px)',
          }}
        >
          {/* Блики на стекле */}
          <div style={{ opacity: effectIntensity.reflectionOpacity }}>
            <GlassHighlight />
          </div>

          {/* Преломление по краям */}
          <EdgeRefraction />

          {/* Легкий виньетка-эффект */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at center,
                  transparent 40%,
                  rgba(0,0,0,0.1) 70%,
                  rgba(0,0,0,0.3) 100%
                )
              `,
            }}
          />
        </div>

        {/* Болты по периметру */}
        {Array.from({ length: boltCount }).map((_, i) => (
          <Bolt
            key={i}
            angle={(360 / boltCount) * i - 90}
            radius={config.boltRadius}
          />
        ))}

        {/* Маленькие индикаторы/лампочки */}
        <div
          className="absolute"
          style={{
            top: '6%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{
                opacity: [1, 0.4, 1],
                boxShadow: [
                  '0 0 8px rgba(74,222,128,0.8)',
                  '0 0 4px rgba(74,222,128,0.4)',
                  '0 0 8px rgba(74,222,128,0.8)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{
                opacity: [0.6, 1, 0.6],
                boxShadow: [
                  '0 0 4px rgba(34,211,238,0.4)',
                  '0 0 8px rgba(34,211,238,0.8)',
                  '0 0 4px rgba(34,211,238,0.4)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <div className="w-2 h-2 rounded-full bg-gray-600" />
          </div>
        </div>

        {/* Текст на раме */}
        <div
          className="absolute font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase"
          style={{
            bottom: '4%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          VA-PC LAB • OBSERVATION PORT
        </div>
      </motion.div>

      {/* Контент внутри иллюминатора */}
      {children && (
        <div className="absolute inset-0 z-40">
          {children}
        </div>
      )}

      {/* Затемнение по углам (вне иллюминатора) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center,
              transparent 35%,
              rgba(0,0,0,0.95) 55%
            )
          `,
        }}
      />
    </div>
  );
});

export default PortholeFrame;

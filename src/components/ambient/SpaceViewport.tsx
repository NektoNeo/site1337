'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * SpaceViewport - Тонкий эффект "вид через иллюминатор космического корабля"
 *
 * Используется ТОЛЬКО для Hero секции:
 * - Космический фон со звёздами и параллаксом
 * - Лёгкое стеклянное свечение по краям (НЕ блокирует контент)
 * - Плавно исчезает при скролле вниз
 *
 * При скролле ниже Hero - мы уже "внутри корабля"
 */

// ============================================
// КОСМИЧЕСКИЕ ЗВЁЗДЫ С ПАРАЛЛАКСОМ
// ============================================
const CosmicStars = memo(function CosmicStars() {
  const [stars, setStars] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
    duration: number;
    isBright: boolean; // Яркие звёзды с glow эффектом
    color: string; // Цвет звезды (белый, голубоватый, желтоватый)
  }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Генерируем звёзды только на клиенте
    // Увеличенное количество: 40 фоновых + 35 средних + 15 ярких
    const colors = ['#ffffff', '#e0f0ff', '#fff8e0', '#f0e8ff'];
    const generated = Array.from({ length: 90 }, (_, i) => {
      const isBright = i < 15; // Первые 15 - яркие звёзды
      const isMedium = i >= 15 && i < 50; // Следующие 35 - средние
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: isBright ? Math.random() * 2 + 2.5 : (isMedium ? Math.random() * 1.5 + 1.5 : Math.random() * 1 + 0.8),
        opacity: isBright ? Math.random() * 0.3 + 0.7 : (isMedium ? Math.random() * 0.3 + 0.5 : Math.random() * 0.3 + 0.2),
        delay: Math.random() * 4,
        duration: isBright ? 3 + Math.random() * 2 : 2 + Math.random() * 3,
        isBright,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    setStars(generated);
  }, []);

  // Не рендерим до гидрации чтобы избежать mismatch
  if (!isMounted) return <div className="absolute inset-0 overflow-hidden" />;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            // Glow эффект для ярких звёзд
            boxShadow: star.isBright
              ? `0 0 ${star.size * 2}px ${star.color}, 0 0 ${star.size * 4}px ${star.color}40`
              : 'none',
          }}
          animate={{
            opacity: [star.opacity, star.opacity * (star.isBright ? 1.3 : 1.5), star.opacity],
            scale: [1, star.isBright ? 1.15 : 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

// ============================================
// ТУМАННОСТИ / NEBULA EFFECT (УСИЛЕННЫЕ)
// ============================================
const NebulaGlow = memo(function NebulaGlow() {
  return (
    <>
      {/* Основная фиолетовая туманность - слева */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          left: '5%',
          top: '15%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 25, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Глубокая синяя туманность - справа */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          right: '0%',
          top: '25%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(30, 64, 175, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Розово-пурпурная туманность снизу */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          left: '50%',
          bottom: '5%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(168, 85, 247, 0.06) 50%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Акцентная бирюзовая туманность - по центру сверху */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          left: '40%',
          top: '10%',
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </>
  );
});

// ============================================
// ЭФФЕКТ СТЕКЛА ИЛЛЮМИНАТОРА (УСИЛЕННЫЙ)
// ============================================
const ViewportGlass = memo(function ViewportGlass({ opacity }: { opacity: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
    >
      {/* Хроматическая аберрация по краям - иридесцентный эффект стекла */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 130% 110% at 50% 50%,
              transparent 45%,
              rgba(255, 100, 100, 0.02) 55%,
              rgba(100, 255, 100, 0.015) 60%,
              rgba(100, 100, 255, 0.02) 65%,
              rgba(139, 92, 246, 0.04) 75%,
              rgba(59, 130, 246, 0.05) 85%,
              rgba(0, 0, 0, 0.25) 100%
            )
          `,
        }}
      />

      {/* Внутреннее кольцо свечения - эффект толстого стекла */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 115% 105% at 50% 50%,
              transparent 50%,
              rgba(100, 200, 255, 0.04) 65%,
              rgba(139, 92, 246, 0.06) 80%,
              transparent 90%
            )
          `,
        }}
      />

      {/* Верхний блик на "стекле" - основной */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Диагональный блик - как на настоящем стекле */}
      <div
        className="absolute top-[10%] left-[5%] w-[30%] h-[20%]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)',
          filter: 'blur(15px)',
          transform: 'rotate(-5deg)',
        }}
      />

      {/* Нижний отблеск */}
      <div
        className="absolute bottom-[15%] right-[10%] w-[25%] h-[15%]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(100,200,255,0.02) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Усиленная виньетка */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 95% 95% at 50% 50%,
              transparent 50%,
              rgba(0, 0, 0, 0.15) 75%,
              rgba(0, 0, 0, 0.35) 100%
            )
          `,
        }}
      />

      {/* Тонкая линия по краю - граница стекла */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 105% 102% at 50% 50%,
              transparent 88%,
              rgba(100, 200, 255, 0.08) 92%,
              rgba(139, 92, 246, 0.06) 95%,
              transparent 100%
            )
          `,
        }}
      />
    </div>
  );
});

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
interface SpaceViewportProps {
  /** Высота области действия эффекта */
  height?: string;
  /** Интенсивность эффекта (0-1) */
  intensity?: number;
  /** Включить параллакс */
  enableParallax?: boolean;
  children?: React.ReactNode;
}

export const SpaceViewport = memo(function SpaceViewport({
  height = '100vh',
  intensity = 1,
  enableParallax = true,
  children,
}: SpaceViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Плавное угасание эффекта стекла при скролле
  const glassOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const smoothGlassOpacity = useSpring(glassOpacity, { stiffness: 100, damping: 30 });

  // Параллакс для звёзд
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const nebulaY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* Космический фон */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a15] via-[#0d0d1a] to-[#0a0a12]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Звёзды с параллаксом */}
        <motion.div
          className="absolute inset-0"
          style={{ y: enableParallax ? starsY : 0 }}
        >
          <CosmicStars />
        </motion.div>

        {/* Туманности с параллаксом */}
        <motion.div
          className="absolute inset-0"
          style={{ y: enableParallax ? nebulaY : 0 }}
        >
          <NebulaGlow />
        </motion.div>
      </motion.div>

      {/* Эффект стекла иллюминатора */}
      <motion.div style={{ opacity: smoothGlassOpacity }}>
        <ViewportGlass opacity={intensity} />
      </motion.div>

      {/* Контент (Hero) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

// ============================================
// SHIP INTERIOR - СТИЛЬ "ВНУТРИ КОРАБЛЯ"
// ============================================
export const ShipInterior = memo(function ShipInterior({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Тёмный технологичный фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-[#0c0c18] to-[#0a0a12]" />

      {/* Тонкая сетка - "стены корабля" */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Лёгкое ambient освещение */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 opacity-30">
        <div
          className="w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

export default SpaceViewport;

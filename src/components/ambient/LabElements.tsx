'use client';

import { memo, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/**
 * LabElements - Космические лабораторные элементы
 *
 * Декоративные элементы в стиле научной лаборатории/космической станции:
 * - Колбы с RGB охлаждающей жидкостью
 * - Соединительные трубки
 * - Голографические дисплеи с данными
 * - Индикаторы и шкалы
 */

// ============================================
// КОЛБА С ЖИДКОСТЬЮ
// ============================================
interface FlaskProps {
  color: 'cyan' | 'purple' | 'magenta' | 'green';
  size?: 'small' | 'medium' | 'large';
  fillLevel?: number; // 0-100
  bubbles?: boolean;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay?: number;
}

const colorMap = {
  cyan: { primary: '#00d4ff', secondary: '#0891b2', glow: 'rgba(0,212,255,0.4)' },
  purple: { primary: '#8b5cf6', secondary: '#6d28d9', glow: 'rgba(139,92,246,0.4)' },
  magenta: { primary: '#d946ef', secondary: '#a21caf', glow: 'rgba(217,70,239,0.4)' },
  green: { primary: '#22c55e', secondary: '#16a34a', glow: 'rgba(34,197,94,0.4)' },
};

const sizeMap = {
  small: { width: 24, height: 60, neckWidth: 8 },
  medium: { width: 36, height: 90, neckWidth: 12 },
  large: { width: 48, height: 120, neckWidth: 16 },
};

export const Flask = memo(function Flask({
  color,
  size = 'medium',
  fillLevel = 70,
  bubbles = true,
  position,
  delay = 0,
}: FlaskProps) {
  const colors = colorMap[color];
  const dimensions = sizeMap[size];

  return (
    <motion.div
      className="absolute z-[65] pointer-events-none"
      style={position}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      <div
        className="relative"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Горлышко колбы */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-t-sm"
          style={{
            width: dimensions.neckWidth,
            height: dimensions.height * 0.15,
            background: 'linear-gradient(90deg, #3a3a4a, #5a5a6a, #3a3a4a)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />

        {/* Основная колба */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-full overflow-hidden"
          style={{
            height: dimensions.height * 0.85,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: `
              inset 0 0 20px rgba(0,0,0,0.3),
              0 0 20px ${colors.glow}
            `,
          }}
        >
          {/* Жидкость */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${fillLevel}%`,
              background: `linear-gradient(180deg, ${colors.primary}40, ${colors.secondary}80)`,
              borderRadius: '0 0 100% 100%',
            }}
            animate={{
              height: [`${fillLevel}%`, `${fillLevel + 3}%`, `${fillLevel}%`],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Поверхность жидкости */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: `linear-gradient(180deg, ${colors.primary}60, transparent)`,
              }}
            />

            {/* Пузырьки */}
            {bubbles && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 3 + Math.random() * 4,
                      height: 3 + Math.random() * 4,
                      left: `${20 + Math.random() * 60}%`,
                      bottom: 0,
                      background: colors.primary,
                      opacity: 0.6,
                    }}
                    animate={{
                      y: [0, -dimensions.height * 0.6],
                      opacity: [0.6, 0],
                      scale: [1, 0.5],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Блик на стекле */}
          <div
            className="absolute top-2 left-2 w-1/3 h-1/2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)',
            }}
          />
        </div>

        {/* Свечение снизу */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-4 rounded-full"
          style={{
            background: colors.glow,
            filter: 'blur(8px)',
          }}
        />
      </div>
    </motion.div>
  );
});

// ============================================
// СОЕДИНИТЕЛЬНАЯ ТРУБКА
// ============================================
interface TubeProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: 'cyan' | 'purple' | 'magenta' | 'green';
  animated?: boolean;
  delay?: number;
}

export const Tube = memo(function Tube({
  from,
  to,
  color,
  animated = true,
  delay = 0,
}: TubeProps) {
  const colors = colorMap[color];
  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

  return (
    <motion.div
      className="absolute z-[65] pointer-events-none"
      style={{
        left: from.x,
        top: from.y,
        width: length,
        height: 6,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left center',
      }}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.6 }}
    >
      {/* Трубка */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #4a4a5a, #2a2a35, #4a4a5a)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)',
        }}
      />

      {/* Жидкость внутри */}
      <div
        className="absolute inset-[2px] rounded-full overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${colors.primary}40, ${colors.secondary}60)`,
        }}
      >
        {/* Анимированный поток */}
        {animated && (
          <motion.div
            className="absolute inset-y-0 w-8"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            }}
            animate={{ x: [-32, length + 32] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay,
            }}
          />
        )}
      </div>
    </motion.div>
  );
});

// ============================================
// ГОЛОГРАФИЧЕСКИЙ ДИСПЛЕЙ
// ============================================
interface HoloDisplayProps {
  data: { label: string; value: string | number; unit?: string }[];
  title?: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: 'small' | 'medium';
  delay?: number;
}

export const HoloDisplay = memo(function HoloDisplay({
  data,
  title,
  position,
  size = 'medium',
  delay = 0,
}: HoloDisplayProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [data.length]);

  const sizeClasses = size === 'small' ? 'w-32 p-2' : 'w-48 p-3';

  return (
    <motion.div
      className={`absolute z-[65] ${sizeClasses}`}
      style={position}
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      {/* Голографическая рамка */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(139,92,246,0.05))',
          border: '1px solid rgba(0,212,255,0.3)',
          boxShadow: `
            0 0 20px rgba(0,212,255,0.2),
            inset 0 0 20px rgba(0,212,255,0.05)
          `,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Scan line эффект */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,212,255,0.03) 50%)',
            backgroundSize: '100% 4px',
          }}
          animate={{ backgroundPositionY: ['0px', '4px'] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        />

        {/* Заголовок */}
        {title && (
          <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-wider mb-2 border-b border-cyan-400/20 pb-1">
            {title}
          </div>
        )}

        {/* Данные */}
        <div className="space-y-1">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              className={`flex justify-between items-center text-xs font-mono transition-colors ${
                index === activeIndex ? 'text-cyan-300' : 'text-white/40'
              }`}
              animate={{
                opacity: index === activeIndex ? 1 : 0.5,
              }}
            >
              <span className="uppercase text-[10px]">{item.label}</span>
              <span className="font-bold">
                {item.value}
                {item.unit && <span className="text-[9px] ml-0.5 opacity-60">{item.unit}</span>}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Угловые акценты */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-400/50" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-400/50" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-400/50" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-400/50" />
      </div>
    </motion.div>
  );
});

// ============================================
// ИНДИКАТОР / ДАТЧИК
// ============================================
interface GaugeProps {
  value: number; // 0-100
  label: string;
  color: 'cyan' | 'purple' | 'magenta' | 'green';
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: number;
  delay?: number;
}

export const Gauge = memo(function Gauge({
  value,
  label,
  color,
  position,
  size = 60,
  delay = 0,
}: GaugeProps) {
  const colors = colorMap[color];
  const circumference = 2 * Math.PI * 22; // radius = 22
  const strokeDashoffset = circumference - (value / 100) * circumference * 0.75;

  return (
    <motion.div
      className="absolute z-[65] pointer-events-none"
      style={{ ...position, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
    >
      <svg viewBox="0 0 50 50" className="w-full h-full -rotate-135">
        {/* Фоновая дуга */}
        <circle
          cx="25"
          cy="25"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
        />

        {/* Активная дуга */}
        <motion.circle
          cx="25"
          cy="25"
          r="22"
          fill="none"
          stroke={colors.primary}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 4px ${colors.glow})`,
          }}
        />
      </svg>

      {/* Значение в центре */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        <span
          className="text-sm font-bold font-mono"
          style={{ color: colors.primary }}
        >
          {value}%
        </span>
        <span className="text-[8px] text-white/40 uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Свечение */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(10px)',
          opacity: 0.3,
        }}
      />
    </motion.div>
  );
});

// ============================================
// КОМПЛЕКСНЫЙ ЛАБОРАТОРНЫЙ ОВЕРЛЕЙ
// ============================================
export const LabOverlay = memo(function LabOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {/* Колбы */}
      <Flask
        color="cyan"
        size="medium"
        fillLevel={75}
        position={{ bottom: '15%', left: '5%' }}
        delay={0.5}
      />
      <Flask
        color="purple"
        size="small"
        fillLevel={60}
        position={{ bottom: '20%', left: '12%' }}
        delay={0.7}
      />
      <Flask
        color="magenta"
        size="large"
        fillLevel={85}
        position={{ bottom: '10%', right: '8%' }}
        delay={0.6}
      />

      {/* Голографические дисплеи */}
      <HoloDisplay
        title="SYSTEM STATUS"
        data={[
          { label: 'CPU', value: 4.8, unit: 'GHz' },
          { label: 'GPU', value: 2100, unit: 'MHz' },
          { label: 'TEMP', value: 42, unit: '°C' },
        ]}
        position={{ top: '20%', left: '3%' }}
        delay={0.8}
      />

      <HoloDisplay
        title="COOLING"
        data={[
          { label: 'FLOW', value: 1.2, unit: 'L/m' },
          { label: 'PUMP', value: 2800, unit: 'RPM' },
        ]}
        position={{ top: '25%', right: '3%' }}
        size="small"
        delay={1}
      />

      {/* Датчики */}
      <Gauge
        value={78}
        label="LOAD"
        color="cyan"
        position={{ bottom: '35%', left: '2%' }}
        delay={1.2}
      />
      <Gauge
        value={92}
        label="PERF"
        color="green"
        position={{ bottom: '30%', right: '4%' }}
        size={50}
        delay={1.4}
      />
    </div>
  );
});

export default LabOverlay;

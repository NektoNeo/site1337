'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PowerButtonProps {
  onPowerOn: () => void;
  isOn: boolean;
  disabled?: boolean;
}

export function PowerButton({ onPowerOn, isOn, disabled }: PowerButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled || isOn) return;
    setIsPressed(true);

    // Эффект нажатия
    setTimeout(() => {
      setIsPressed(false);
      onPowerOn();
    }, 150);
  };

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Ambient glow behind button - only when OFF */}
      {!isOn && (
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 220, 255, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main power button */}
      <motion.button
        onClick={handleClick}
        disabled={disabled || isOn}
        className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer disabled:cursor-default outline-none focus:outline-none"
        style={{
          background: isOn
            ? 'linear-gradient(145deg, #1a1a2e, #0f0f1a)'
            : 'linear-gradient(145deg, #0a0a12, #050508)',
          boxShadow: isOn
            ? `
                0 0 30px rgba(0, 220, 255, 0.6),
                0 0 60px rgba(139, 92, 246, 0.4),
                inset 0 0 20px rgba(0, 220, 255, 0.2)
              `
            : `
                0 4px 15px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.05),
                inset 0 -1px 0 rgba(0, 0, 0, 0.3)
              `,
          border: isOn
            ? '2px solid rgba(0, 220, 255, 0.5)'
            : '2px solid rgba(255, 255, 255, 0.08)',
        }}
        animate={{
          scale: isPressed ? 0.92 : 1,
          boxShadow: !isOn ? [
            '0 4px 15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            '0 4px 25px rgba(0, 220, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            '0 4px 15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          ] : undefined,
        }}
        transition={{
          scale: { duration: 0.1 },
          boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={!isOn ? {
          scale: 1.05,
          boxShadow: '0 0 40px rgba(0, 220, 255, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
        } : {}}
        whileTap={!isOn ? { scale: 0.95 } : {}}
      >
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: isOn
              ? '1px solid rgba(0, 220, 255, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.06)',
          }}
        />

        {/* Power icon */}
        <motion.svg
          viewBox="0 0 24 24"
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: isOn ? '#00dcff' : 'rgba(255, 255, 255, 0.4)',
            filter: isOn ? 'drop-shadow(0 0 10px #00dcff)' : 'none',
          }}
          animate={!isOn ? {
            color: ['rgba(255, 255, 255, 0.4)', 'rgba(0, 220, 255, 0.7)', 'rgba(255, 255, 255, 0.4)'],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path d="M12 2v10" />
          <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
        </motion.svg>

        {/* Press flash effect */}
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/30"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>

      {/* Label */}
      <motion.div
        className="text-center"
        animate={{
          opacity: isOn ? 0 : 1,
          y: isOn ? -10 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.p
          className="text-white/60 text-sm font-medium tracking-wider uppercase"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Нажми чтобы включить
        </motion.p>
      </motion.div>

      {/* Decorative lines - tech panel feel */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-r from-transparent to-white/20" />
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-l from-transparent to-white/20" />
    </div>
  );
}

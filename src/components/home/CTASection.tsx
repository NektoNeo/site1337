'use client';

import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { GlowButton } from '../ui/GlowButton';
import { PowerButton } from './PowerButton';

type FloatingDataParticleSpec = {
  id: number;
  size: number;
  color: string;
  left: string;
  x: number[];
  y: number[];
  duration: number;
  delay: number;
};

type BubbleSpec = {
  id: number;
  size: number;
  left: string;
  duration: number;
  delay: number;
};

// Компонент трубки с жидкостью
function LiquidTube({
  side,
  delay = 0,
  color = 'cyan'
}: {
  side: 'left' | 'right';
  delay?: number;
  color?: 'cyan' | 'purple' | 'green';
}) {
  const colors = {
    cyan: { primary: '#00dcff', secondary: '#0891b2' },
    purple: { primary: '#a855f7', secondary: '#7c3aed' },
    green: { primary: '#22c55e', secondary: '#16a34a' },
  };
  const c = colors[color];

  // Pre-generate bubble specs once
  const bubbles = useMemo<BubbleSpec[]>(() => 
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      size: 3 + Math.random() * 4,
      left: `${20 + Math.random() * 60}%`,
      duration: 2 + Math.random() * 2,
      delay: i * 0.5 + Math.random(),
    })),
    []
  );

  // Liquid animation duration (stable)
  const liquidDuration = useMemo(() => 3 + Math.random() * 2, []);
  const liquidDelay = useMemo(() => delay + Math.random(), [delay]);

  return (
    <motion.div
      className={`absolute ${side === 'left' ? 'left-4 lg:left-8' : 'right-4 lg:right-8'} top-1/2 -translate-y-1/2`}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      {/* Tube frame */}
      <div
        className="relative w-6 h-[300px] rounded-full"
        style={{
          background: 'linear-gradient(90deg, rgba(30, 30, 50, 0.9), rgba(20, 20, 35, 0.9))',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Liquid inside */}
        <motion.div
          className="absolute bottom-1 left-1 right-1 rounded-full"
          style={{
            background: `linear-gradient(to top, ${c.primary}, ${c.secondary}, transparent)`,
            boxShadow: `0 0 20px ${c.primary}40, inset 0 0 10px ${c.primary}60`,
          }}
          initial={{ height: '0%' }}
          animate={{ height: ['60%', '75%', '60%'] }}
          transition={{
            duration: liquidDuration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: liquidDelay
          }}
        />

        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              background: c.primary,
              left: bubble.left,
              boxShadow: `0 0 6px ${c.primary}`,
            }}
            animate={{
              bottom: ['20%', '90%'],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Glass reflection */}
        <div
          className="absolute top-0 left-1 w-1 h-full rounded-full opacity-30"
          style={{ background: 'linear-gradient(to bottom, white, transparent)' }}
        />
      </div>

      {/* Connection pipes */}
      <div
        className={`absolute top-1/4 ${side === 'left' ? '-right-8' : '-left-8'} w-8 h-1 rounded-full`}
        style={{
          background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(50, 50, 70, 0.8), transparent)`,
          boxShadow: `0 0 10px ${c.primary}30`,
        }}
      />
      <div
        className={`absolute top-2/3 ${side === 'left' ? '-right-12' : '-left-12'} w-12 h-1 rounded-full`}
        style={{
          background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(50, 50, 70, 0.8), transparent)`,
          boxShadow: `0 0 10px ${c.primary}30`,
        }}
      />
    </motion.div>
  );
}

// Компонент створки ворот
function GatePanel({
  side,
  isOpen
}: {
  side: 'left' | 'right';
  isOpen: boolean;
}) {
  const isLeft = side === 'left';

  return (
    <motion.div
      className="absolute top-0 bottom-0 w-1/2 z-30 overflow-hidden"
      style={{
        [isLeft ? 'left' : 'right']: 0,
      }}
      initial={{ x: 0 }}
      animate={{
        x: isOpen ? (isLeft ? '-100%' : '100%') : 0,
      }}
      transition={{
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {/* Main panel */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${isLeft ? '90deg' : '270deg'},
            #0a0a12 0%,
            #12121f 50%,
            #1a1a2e 100%
          )`,
        }}
      >
        {/* Horizontal segments */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(i + 1) * 12}%`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
          />
        ))}

        {/* Vertical detail lines */}
        <div
          className={`absolute top-0 bottom-0 w-px ${isLeft ? 'right-8' : 'left-8'}`}
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <div
          className={`absolute top-0 bottom-0 w-px ${isLeft ? 'right-16' : 'left-16'}`}
          style={{ background: 'rgba(255,255,255,0.03)' }}
        />

        {/* Edge glow - the seam where gates meet */}
        <motion.div
          className={`absolute top-0 bottom-0 w-2 ${isLeft ? 'right-0' : 'left-0'}`}
          style={{
            background: `linear-gradient(to ${isLeft ? 'right' : 'left'},
              transparent,
              rgba(0, 220, 255, 0.3)
            )`,
          }}
          animate={{
            opacity: isOpen ? [1, 0.5, 0] : [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: isOpen ? 0.5 : 2,
            repeat: isOpen ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Tech details / rivets */}
        {[20, 40, 60, 80].map((top) => (
          <div
            key={top}
            className={`absolute ${isLeft ? 'right-4' : 'left-4'} w-2 h-2 rounded-full`}
            style={{
              top: `${top}%`,
              background: 'radial-gradient(circle, rgba(60,60,80,1), rgba(30,30,50,1))',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        ))}

        {/* Warning stripes at edge */}
        <div
          className={`absolute top-0 bottom-0 w-4 ${isLeft ? 'right-0' : 'left-0'} overflow-hidden opacity-20`}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #f59e0b 0px,
                #f59e0b 10px,
                transparent 10px,
                transparent 20px
              )`,
            }}
          />
        </div>

        {/* "SECTOR" label */}
        <div
          className={`absolute top-8 ${isLeft ? 'left-8' : 'right-8'} text-white/20 text-xs font-mono tracking-widest`}
        >
          {isLeft ? 'SECTOR-A7' : 'SECTOR-B7'}
        </div>
      </div>
    </motion.div>
  );
}

// HUD элементы
function HUDElement({
  position,
  delay = 0
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay?: number;
}) {
  const posClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <motion.div
      className={`absolute ${posClasses[position]} font-mono text-xs`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-cyan-400/60 mb-1">
        {position.includes('left') ? 'SYS.STATUS' : 'PWR.LEVEL'}
      </div>
      <motion.div
        className="text-white/40 flex items-center gap-2"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400" />
        {position.includes('left') ? 'ONLINE' : '98.7%'}
      </motion.div>

      {/* Mini graph */}
      <div className="flex items-end gap-px mt-2 h-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-cyan-400/40 rounded-sm"
            animate={{
              height: [
                `${20 + Math.random() * 60}%`,
                `${20 + Math.random() * 60}%`,
              ],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Animation stages:
  // 0 - Gates closed, power button visible
  // 1 - Gates opening, light bleeding through
  // 2 - Gates fully open, lab revealed, PC appears
  // 3 - CTA content appears (1.5s after stage 2)
  const [stage, setStage] = useState(0);

  const handlePowerOn = useCallback(() => {
    if (stage !== 0) return;
    setStage(1);
    // Gates open
    setTimeout(() => setStage(2), 1500);
    // CTA appears with delay
    setTimeout(() => setStage(3), 3000); // 1.5s after gates open
  }, [stage]);

  const isOpen = stage >= 1;
  const isFullyOpen = stage >= 2;
  const showCTA = stage >= 3;

  const floatingDataParticles = useMemo<FloatingDataParticleSpec[]>(() => {
    if (!isFullyOpen) return [];

    return Array.from({ length: 12 }, (_, i) => {
      const size = 2 + Math.random() * 3;
      const left = `${10 + Math.random() * 80}%`;
      const y = [0, -200 - Math.random() * 150];
      const x = [0, (Math.random() - 0.5) * 80];
      const duration = 3 + Math.random() * 2;
      const delay = Math.random() * 3;
      const color = i % 2 === 0 ? '#00dcff' : '#a855f7';

      return { id: i, size, color, left, x, y, duration, delay };
    });
  }, [isFullyOpen]);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative min-h-[80vh] overflow-hidden bg-[#030306]"
    >
      {/* Deep lab background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030306] via-[#050510] to-[#030306]" />

      {/* Grid pattern - lab floor feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 220, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 220, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* GATES */}
      <GatePanel side="left" isOpen={isOpen} />
      <GatePanel side="right" isOpen={isOpen} />

      {/* VA-PC LAB Plaque - Top center of gates */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div
            className="absolute inset-x-0 top-8 z-50 flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main plaque */}
            <div
              className="relative px-8 py-3 rounded-lg pointer-events-auto"
              style={{
                background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.98), rgba(10, 10, 18, 0.98))',
                border: '2px solid rgba(0, 220, 255, 0.3)',
                boxShadow: `
                  0 0 30px rgba(0, 220, 255, 0.2),
                  0 10px 40px rgba(0, 0, 0, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br" />

              {/* Text */}
              <motion.h3
                className="text-2xl md:text-3xl font-black tracking-[0.3em] text-center"
                style={{
                  background: 'linear-gradient(135deg, #00dcff 0%, #ffffff 50%, #00dcff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                VA-PC LAB
              </motion.h3>

              {/* Subtitle */}
              <div className="text-center mt-1">
                <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">
                  EXPERIMENTAL DIVISION
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTER POWER BUTTON - On the gate seam */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
          >
            {/* Control panel frame */}
            <div
              className="relative p-10 md:p-12 rounded-2xl pointer-events-auto"
              style={{
                background: 'linear-gradient(145deg, rgba(15, 15, 25, 0.98), rgba(8, 8, 15, 0.99))',
                border: '2px solid rgba(0, 220, 255, 0.2)',
                boxShadow: `
                  0 0 60px rgba(0, 220, 255, 0.15),
                  0 25px 80px rgba(0, 0, 0, 0.7),
                  inset 0 1px 0 rgba(255, 255, 255, 0.05)
                `,
              }}
            >
              {/* Panel label */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0a0a12] border border-cyan-400/30 rounded text-xs font-mono text-cyan-400/80 tracking-wider whitespace-nowrap">
                GATE CONTROL
              </div>

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-cyan-400/40" />
              <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-cyan-400/40" />
              <div className="absolute bottom-2 left-2 w-5 h-5 border-l-2 border-b-2 border-cyan-400/40" />
              <div className="absolute bottom-2 right-2 w-5 h-5 border-r-2 border-b-2 border-cyan-400/40" />

              {/* Status indicators */}
              <div className="absolute top-4 left-8 flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono text-white/30">SYS.RDY</span>
              </div>
              <div className="absolute top-4 right-8 flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/30">PWR.OK</span>
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </div>

              <PowerButton
                onPowerOn={handlePowerOn}
                isOn={isOpen}
              />

              {/* Teaser text below button */}
              <motion.p
                className="mt-6 text-white/40 text-xs text-center font-mono tracking-wider"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                [ ОТКРЫТЬ ЛАБОРАТОРИЮ ]
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light bleeding through gate seam - before fully open */}
      <AnimatePresence>
        {stage === 1 && (
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 z-20"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: [0, 1, 0.5],
              scaleY: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'linear-gradient(to bottom, transparent, #00dcff, #a855f7, #00dcff, transparent)',
              filter: 'blur(8px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* === LAB ENVIRONMENT (behind gates) === */}
      <div className="absolute inset-0 z-10">

        {/* Ambient reactor glow behind PC */}
        <motion.div
          className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at center,
                rgba(0, 220, 255, 0.4) 0%,
                rgba(139, 92, 246, 0.2) 30%,
                rgba(168, 85, 247, 0.1) 50%,
                transparent 70%
              )
            `,
            filter: 'blur(60px)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isFullyOpen ? 0.8 : 0,
            scale: isFullyOpen ? [1, 1.1, 1] : 0.5,
          }}
          transition={{
            opacity: { duration: 1 },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
        />

        {/* Liquid tubes */}
        <AnimatePresence>
          {isFullyOpen && (
            <>
              <LiquidTube side="left" delay={0.2} color="cyan" />
              <LiquidTube side="right" delay={0.4} color="purple" />
            </>
          )}
        </AnimatePresence>

        {/* Floor reflection/glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
          style={{
            background: `
              linear-gradient(to top,
                rgba(0, 220, 255, 0.1) 0%,
                rgba(139, 92, 246, 0.05) 30%,
                transparent 100%
              )
            `,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFullyOpen ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* HUD Elements */}
        <AnimatePresence>
          {isFullyOpen && (
            <>
              <HUDElement position="top-left" delay={0.8} />
              <HUDElement position="top-right" delay={1} />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main content - z-40 when gates closed so button is visible */}
      <div className={`relative container mx-auto px-4 min-h-[80vh] flex items-center ${stage === 0 ? 'z-40' : 'z-20'}`}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-16">

          {/* LEFT: PC in the lab */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">

            {/* Experiment platform glow */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(0, 220, 255, 0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isFullyOpen ? [0.5, 0.8, 0.5] : 0,
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* THE PC - The Experiment */}
            <motion.div
              className="relative z-10"
              initial={{
                opacity: 0,
                scale: 0.8,
                filter: 'brightness(0.2) blur(10px)',
              }}
              animate={{
                opacity: isFullyOpen ? 1 : 0,
                scale: isFullyOpen ? 1 : 0.8,
                filter: isFullyOpen
                  ? 'brightness(1.1) blur(0px)'
                  : 'brightness(0.2) blur(10px)',
              }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.3,
              }}
            >
              <Image
                src="/1d0306c1-69a4-4cc0-a340-d9598dfc3509.png"
                alt="Игровой компьютер VA-PC"
                width={520}
                height={650}
                className="object-contain"
                style={{
                  filter: isFullyOpen
                    ? 'drop-shadow(0 0 60px rgba(0, 220, 255, 0.5)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.3)) drop-shadow(0 30px 50px rgba(0, 0, 0, 0.8))'
                    : 'none',
                  transition: 'filter 1s ease-out',
                }}
              />

              {/* Connection cables to PC */}
              {isFullyOpen && (
                <>
                  <motion.div
                    className="absolute -left-16 top-1/3 w-16 h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, rgba(0, 220, 255, 0.6), transparent)',
                      boxShadow: '0 0 10px rgba(0, 220, 255, 0.4)',
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  />
                  <motion.div
                    className="absolute -left-24 top-1/2 w-24 h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.6), transparent)',
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  />
                  <motion.div
                    className="absolute -right-20 top-2/5 w-20 h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(270deg, rgba(0, 220, 255, 0.6), transparent)',
                      boxShadow: '0 0 10px rgba(0, 220, 255, 0.4)',
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  />
                </>
              )}
            </motion.div>

            {/* Platform base */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-4 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 220, 255, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)',
                filter: 'blur(8px)',
              }}
              initial={{ opacity: 0, scaleX: 0.3 }}
              animate={{
                opacity: isFullyOpen ? 1 : 0,
                scaleX: isFullyOpen ? 1 : 0.3
              }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            {/* Floating data particles */}
            {isFullyOpen && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {floatingDataParticles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      color: p.color,
                      left: p.left,
                      bottom: '30%',
                      boxShadow: `0 0 8px currentColor`,
                    }}
                    animate={{
                      y: p.y,
                      x: p.x,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: CTA Content - Reveals after gates open with delay */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[400px]">
            {/* CONTENT - Reveals 1.5s after gates fully open */}
            <AnimatePresence>
              {showCTA && (
                <motion.div
                  key="content"
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                  {/* Main headline */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-2 leading-[1.1]"
                  >
                    Ты готов
                  </motion.h2>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-[1.1]"
                    style={{
                      background: 'linear-gradient(135deg, #00dcff 0%, #8b5cf6 50%, #a855f7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    к своей мечте?
                  </motion.h2>

                  {/* Subtext */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-lg md:text-xl text-white/50 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                  >
                    Создадим идеальную машину под твои задачи. Напиши — и мечта станет реальностью.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                  >
                    <GlowButton
                      variant="primary"
                      size="lg"
                      href="https://t.me/vapc_manager"
                    >
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Написать в Telegram
                    </GlowButton>

                    <GlowButton
                      variant="secondary"
                      size="lg"
                      href="/catalog"
                    >
                      <span>Смотреть каталог</span>
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </GlowButton>
                  </motion.div>

                  {/* Trust badges */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/40 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span>Онлайн 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                      <span>2000+ собранных ПК</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
                      <span>Гарантия 3 года</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-30" />
    </section>
  );
}

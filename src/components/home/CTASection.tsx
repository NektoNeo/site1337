'use client';

import { useRef, useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { GlowButton } from '../ui/GlowButton';
import { PowerButton } from './PowerButton';
import { cn } from '@/lib/cn';

// ============================================
// CTA SECTION - OPTIMIZED FOR PERFORMANCE
// ============================================
// Changes from original:
// 1. Removed Framer Motion completely
// 2. AnimatePresence replaced with CSS visibility + transitions
// 3. Infinite animations use CSS @keyframes
// 4. Gate panels use CSS transform transitions
// 5. Particles use CSS animations
// ============================================

// Компонент трубки с жидкостью
const LiquidTube = memo(function LiquidTube({
  side,
  delay = 0,
  color = 'cyan',
  isVisible,
}: {
  side: 'left' | 'right';
  delay?: number;
  color?: 'cyan' | 'purple' | 'green';
  isVisible: boolean;
}) {
  const colors = {
    cyan: { primary: '#00dcff', secondary: '#0891b2' },
    purple: { primary: '#a855f7', secondary: '#7c3aed' },
    green: { primary: '#22c55e', secondary: '#16a34a' },
  };
  const c = colors[color];

  return (
    <div
      className={cn(
        `absolute top-1/2 -translate-y-1/2`,
        side === 'left' ? 'left-4 lg:left-8' : 'right-4 lg:right-8',
        "transition-[opacity,transform] duration-800 ease-out",
        "origin-center",
        isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
      )}
      style={{ transitionDelay: `${delay * 1000}ms` }}
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
        {/* Liquid inside - CSS animation */}
        <div
          className="absolute bottom-1 left-1 right-1 rounded-full animate-liquid-rise"
          style={{
            background: `linear-gradient(to top, ${c.primary}, ${c.secondary}, transparent)`,
            boxShadow: `0 0 20px ${c.primary}40, inset 0 0 10px ${c.primary}60`,
          }}
        />

        {/* Bubbles - CSS animated */}
        {isVisible && [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bubble"
            style={{
              width: 3 + i * 1.5,
              height: 3 + i * 1.5,
              background: c.primary,
              left: `${20 + i * 15}%`,
              boxShadow: `0 0 6px ${c.primary}`,
              animationDelay: `${i * 0.5 + delay}s`,
              animationDuration: `${2 + i * 0.5}s`,
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
        className={cn(
          "absolute top-1/4 w-8 h-1 rounded-full",
          side === 'left' ? '-right-8' : '-left-8'
        )}
        style={{
          background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(50, 50, 70, 0.8), transparent)`,
          boxShadow: `0 0 10px ${c.primary}30`,
        }}
      />
      <div
        className={cn(
          "absolute top-2/3 w-12 h-1 rounded-full",
          side === 'left' ? '-right-12' : '-left-12'
        )}
        style={{
          background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(50, 50, 70, 0.8), transparent)`,
          boxShadow: `0 0 10px ${c.primary}30`,
        }}
      />
    </div>
  );
});

// Компонент створки ворот
const GatePanel = memo(function GatePanel({
  side,
  isOpen,
}: {
  side: 'left' | 'right';
  isOpen: boolean;
}) {
  const isLeft = side === 'left';

  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-1/2 z-30 overflow-hidden",
        "transition-transform duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)]",
      )}
      style={{
        [isLeft ? 'left' : 'right']: 0,
        transform: isOpen
          ? `translateX(${isLeft ? '-100%' : '100%'})`
          : 'translateX(0)',
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
          className={cn(
            "absolute top-0 bottom-0 w-px",
            isLeft ? 'right-8' : 'left-8'
          )}
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <div
          className={cn(
            "absolute top-0 bottom-0 w-px",
            isLeft ? 'right-16' : 'left-16'
          )}
          style={{ background: 'rgba(255,255,255,0.03)' }}
        />

        {/* Edge glow - the seam where gates meet */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-2",
            isLeft ? 'right-0' : 'left-0',
            isOpen ? "animate-none opacity-0" : "animate-pulse-glow"
          )}
          style={{
            background: `linear-gradient(to ${isLeft ? 'right' : 'left'},
              transparent,
              rgba(0, 220, 255, 0.3)
            )`,
          }}
        />

        {/* Tech details / rivets */}
        {[20, 40, 60, 80].map((top) => (
          <div
            key={top}
            className={cn(
              "absolute w-2 h-2 rounded-full",
              isLeft ? 'right-4' : 'left-4'
            )}
            style={{
              top: `${top}%`,
              background: 'radial-gradient(circle, rgba(60,60,80,1), rgba(30,30,50,1))',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)',
            }}
          />
        ))}

        {/* Warning stripes at edge */}
        <div
          className={cn(
            "absolute top-0 bottom-0 w-4 overflow-hidden opacity-20",
            isLeft ? 'right-0' : 'left-0'
          )}
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
          className={cn(
            "absolute top-8 text-white/20 text-xs font-mono tracking-widest",
            isLeft ? 'left-8' : 'right-8'
          )}
        >
          {isLeft ? 'SECTOR-A7' : 'SECTOR-B7'}
        </div>
      </div>
    </div>
  );
});

// HUD элементы
const HUDElement = memo(function HUDElement({
  position,
  delay = 0,
  isVisible,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay?: number;
  isVisible: boolean;
}) {
  const posClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={cn(
        `absolute ${posClasses[position]} font-mono text-xs`,
        "transition-[opacity,transform] duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
      )}
      style={{ transitionDelay: `${delay * 1000}ms` }}
    >
      <div className="text-cyan-400/60 mb-1">
        {position.includes('left') ? 'SYS.STATUS' : 'PWR.LEVEL'}
      </div>
      <div className="text-white/40 flex items-center gap-2 animate-pulse-slow">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        {position.includes('left') ? 'ONLINE' : '98.7%'}
      </div>

      {/* Mini graph - CSS animated bars */}
      <div className="flex items-end gap-px mt-2 h-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-cyan-400/40 rounded-sm animate-bar-graph"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

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
      <div
        className={cn(
          "absolute inset-x-0 top-8 z-50 flex justify-center pointer-events-none",
          "transition-[opacity,transform] duration-500",
          stage === 0 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-90"
        )}
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
          <h3
            className="text-2xl md:text-3xl font-black tracking-[0.3em] text-center"
            style={{
              background: 'linear-gradient(135deg, #00dcff 0%, #ffffff 50%, #00dcff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            VA-PC LAB
          </h3>

          {/* Subtitle */}
          <div className="text-center mt-1">
            <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">
              EXPERIMENTAL DIVISION
            </span>
          </div>
        </div>
      </div>

      {/* CENTER POWER BUTTON - On the gate seam */}
      <div
        className={cn(
          "absolute inset-0 z-50 flex items-center justify-center pointer-events-none",
          "transition-[opacity,transform,filter] duration-500",
          stage === 0
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-50 blur-lg"
        )}
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
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow" />
            <span className="text-[10px] font-mono text-white/30">SYS.RDY</span>
          </div>
          <div className="absolute top-4 right-8 flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/30">PWR.OK</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" style={{ animationDelay: '0.3s' }} />
          </div>

          <PowerButton
            onPowerOn={handlePowerOn}
            isOn={isOpen}
          />

          {/* Teaser text below button */}
          <p className="mt-6 text-white/40 text-xs text-center font-mono tracking-wider animate-pulse-slow">
            [ ОТКРЫТЬ ЛАБОРАТОРИЮ ]
          </p>
        </div>
      </div>

      {/* Light bleeding through gate seam - before fully open */}
      <div
        className={cn(
          "absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 z-20",
          "transition-[opacity,transform] duration-800 origin-top",
          stage === 1 ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        )}
        style={{
          background: 'linear-gradient(to bottom, transparent, #00dcff, #a855f7, #00dcff, transparent)',
          filter: 'blur(8px)',
        }}
      />

      {/* === LAB ENVIRONMENT (behind gates) === */}
      <div className="absolute inset-0 z-10">

        {/* Ambient reactor glow behind PC */}
        <div
          className={cn(
            "absolute left-1/3 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none",
            "transition-[opacity,transform] duration-1000",
            isFullyOpen ? "opacity-80 scale-100 animate-pulse-scale" : "opacity-0 scale-50"
          )}
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
        />

        {/* Liquid tubes */}
        <LiquidTube side="left" delay={0.2} color="cyan" isVisible={isFullyOpen} />
        <LiquidTube side="right" delay={0.4} color="purple" isVisible={isFullyOpen} />

        {/* Floor reflection/glow */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none",
            "transition-opacity duration-1000 delay-500",
            isFullyOpen ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `
              linear-gradient(to top,
                rgba(0, 220, 255, 0.1) 0%,
                rgba(139, 92, 246, 0.05) 30%,
                transparent 100%
              )
            `,
          }}
        />

        {/* HUD Elements */}
        <HUDElement position="top-left" delay={0.8} isVisible={isFullyOpen} />
        <HUDElement position="top-right" delay={1} isVisible={isFullyOpen} />
      </div>

      {/* Main content - z-40 when gates closed so button is visible */}
      <div className={cn(
        "relative container mx-auto px-4 min-h-[80vh] flex items-center",
        stage === 0 ? 'z-40' : 'z-20'
      )}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-16">

          {/* LEFT: PC in the lab */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">

            {/* Experiment platform glow */}
            <div
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none",
                "transition-opacity duration-1000",
                isFullyOpen ? "opacity-100 animate-pulse-glow-slow" : "opacity-0"
              )}
              style={{
                background: 'radial-gradient(circle, rgba(0, 220, 255, 0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* THE PC - The Experiment */}
            <div
              className={cn(
                "relative z-10",
                "transition-[opacity,transform,filter] duration-1200 ease-[cubic-bezier(0.4,0,0.2,1)] delay-300",
                isFullyOpen
                  ? "opacity-100 scale-100 blur-0 brightness-110"
                  : "opacity-0 scale-80 blur-md brightness-20"
              )}
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
                  <div
                    className="absolute -left-16 top-1/3 w-16 h-1 rounded-full origin-right transition-[transform,opacity] duration-500 delay-1000"
                    style={{
                      background: 'linear-gradient(90deg, rgba(0, 220, 255, 0.6), transparent)',
                      boxShadow: '0 0 10px rgba(0, 220, 255, 0.4)',
                    }}
                  />
                  <div
                    className="absolute -left-24 top-1/2 w-24 h-1 rounded-full origin-right transition-[transform,opacity] duration-500 delay-1200"
                    style={{
                      background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.6), transparent)',
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                    }}
                  />
                  <div
                    className="absolute -right-20 top-2/5 w-20 h-1 rounded-full origin-left transition-[transform,opacity] duration-500 delay-1100"
                    style={{
                      background: 'linear-gradient(270deg, rgba(0, 220, 255, 0.6), transparent)',
                      boxShadow: '0 0 10px rgba(0, 220, 255, 0.4)',
                    }}
                  />
                </>
              )}
            </div>

            {/* Platform base */}
            <div
              className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-4 rounded-full pointer-events-none",
                "transition-[opacity,transform] duration-800 delay-500 origin-center",
                isFullyOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-30"
              )}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0, 220, 255, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Floating data particles - CSS animated */}
            {isFullyOpen && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-particle"
                    style={{
                      width: 2 + (i % 3) * 1.5,
                      height: 2 + (i % 3) * 1.5,
                      background: i % 2 === 0 ? '#00dcff' : '#a855f7',
                      left: `${10 + (i * 7) % 80}%`,
                      bottom: '30%',
                      boxShadow: '0 0 8px currentColor',
                      animationDelay: `${i * 0.25}s`,
                      animationDuration: `${3 + (i % 3)}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: CTA Content - Reveals after gates open with delay */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[400px]">
            {/* CONTENT - Reveals 1.5s after gates fully open */}
            <div
              className={cn(
                "text-center lg:text-left",
                "transition-[opacity,transform,filter] duration-800 ease-out delay-200",
                showCTA ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-md"
              )}
            >
              {/* Main headline */}
              <h2
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-2 leading-[1.1]",
                  "transition-[opacity,transform] duration-600 delay-300",
                  showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                )}
              >
                Ты готов
              </h2>

              <h2
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-[1.1]",
                  "transition-[opacity,transform] duration-600 delay-400",
                  showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                )}
                style={{
                  background: 'linear-gradient(135deg, #00dcff 0%, #8b5cf6 50%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                к своей мечте?
              </h2>

              {/* Subtext */}
              <p
                className={cn(
                  "text-lg md:text-xl text-white/50 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed",
                  "transition-[opacity,transform] duration-600 delay-500",
                  showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                )}
              >
                Создадим идеальную машину под твои задачи. Напиши — и мечта станет реальностью.
              </p>

              {/* CTA Buttons */}
              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8",
                  "transition-[opacity,transform] duration-600 delay-600",
                  showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                )}
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
              </div>

              {/* Trust badges */}
              <div
                className={cn(
                  "flex flex-wrap justify-center lg:justify-start gap-6 text-white/40 text-sm",
                  "transition-opacity duration-600 delay-800",
                  showCTA ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-30" />
    </section>
  );
}

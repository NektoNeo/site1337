'use client';

/**
 * ConfiguratorCTA - "ПОПРОБУЙ СОБРАТЬ САМ" section
 *
 * Interactive CTA section promoting the PC configurator.
 * Features:
 * - Animated 3D-style PC preview
 * - Floating component icons
 * - Glowing neon accents
 * - Call-to-action to /configurator/custom
 */

import { useRef, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Fan,
  Droplets,
  Palette,
  Sparkles,
  ArrowRight,
  Wrench,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// FLOATING COMPONENT ICON
// ============================================================================

interface FloatingIconProps {
  icon: React.ReactNode;
  label: string;
  delay: number;
  position: { x: string; y: string };
  color: string;
}

const FloatingIcon = memo(function FloatingIcon({
  icon,
  label,
  delay,
  position,
  color
}: FloatingIconProps) {
  return (
    <div
      className="absolute animate-float-slow group cursor-pointer"
      style={{
        left: position.x,
        top: position.y,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className={cn(
          "relative p-3 rounded-xl backdrop-blur-md",
          "border border-white/10 transition-all duration-300",
          "hover:scale-110 hover:border-white/30",
          "shadow-lg"
        )}
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
          boxShadow: `0 0 20px ${color}30, inset 0 0 20px ${color}10`,
        }}
      >
        <div style={{ color }}>{icon}</div>

        {/* Tooltip on hover */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <span className="text-xs text-white/60 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// PC PREVIEW VISUALIZATION
// ============================================================================

const PCPreview = memo(function PCPreview() {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const slots = [
    { id: 'cpu', label: 'Процессор', icon: <Cpu className="w-4 h-4" />, top: '15%', left: '40%', color: '#f97316' },
    { id: 'gpu', label: 'Видеокарта', icon: <Monitor className="w-4 h-4" />, top: '45%', left: '30%', color: '#22c55e' },
    { id: 'ram', label: 'Память', icon: <MemoryStick className="w-4 h-4" />, top: '25%', left: '60%', color: '#3b82f6' },
    { id: 'storage', label: 'Накопитель', icon: <HardDrive className="w-4 h-4" />, top: '65%', left: '50%', color: '#a855f7' },
    { id: 'cooling', label: 'Охлаждение', icon: <Droplets className="w-4 h-4" />, top: '35%', left: '70%', color: '#06b6d4' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-3xl opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle at center, #a855f7 0%, #7c3aed 30%, transparent 70%)',
        }}
      />

      {/* Main PC case outline */}
      <div className="absolute inset-8 rounded-2xl border-2 border-purple-500/30 backdrop-blur-sm bg-black/20">
        {/* Glass panel effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(135deg, white 0%, transparent 50%, white 100%)',
            }}
          />
        </div>

        {/* Component slots */}
        {slots.map((slot) => (
          <button
            key={slot.id}
            className={cn(
              "absolute p-2 rounded-lg transition-all duration-300",
              "border backdrop-blur-sm cursor-pointer",
              hoveredSlot === slot.id
                ? "scale-125 border-white/50 z-10"
                : "border-white/20 hover:border-white/40"
            )}
            style={{
              top: slot.top,
              left: slot.left,
              transform: 'translate(-50%, -50%)',
              background: hoveredSlot === slot.id
                ? `linear-gradient(135deg, ${slot.color}40, ${slot.color}20)`
                : `linear-gradient(135deg, ${slot.color}20, transparent)`,
              boxShadow: hoveredSlot === slot.id
                ? `0 0 30px ${slot.color}50`
                : `0 0 15px ${slot.color}20`,
            }}
            onMouseEnter={() => setHoveredSlot(slot.id)}
            onMouseLeave={() => setHoveredSlot(null)}
          >
            <div style={{ color: slot.color }}>{slot.icon}</div>

            {/* Label on hover */}
            {hoveredSlot === slot.id && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap animate-fade-in">
                <span className="text-[10px] text-white/80 bg-black/70 px-2 py-0.5 rounded">
                  {slot.label}
                </span>
              </div>
            )}
          </button>
        ))}

        {/* RGB strips */}
        <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full overflow-hidden">
          <div
            className="h-full animate-rgb-flow"
            style={{
              background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ef4444)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-float-particle"
          style={{
            left: `${20 + (i * 10)}%`,
            top: `${15 + (i * 8) % 70}%`,
            background: i % 2 === 0 ? '#a855f7' : '#06b6d4',
            boxShadow: `0 0 10px ${i % 2 === 0 ? '#a855f7' : '#06b6d4'}`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// FEATURE BADGE
// ============================================================================

interface FeatureBadgeProps {
  icon: React.ReactNode;
  text: string;
  delay?: number;
}

const FeatureBadge = memo(function FeatureBadge({ icon, text, delay = 0 }: FeatureBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-white/5 border border-white/10 backdrop-blur-sm",
        "transition-all duration-300 hover:bg-white/10 hover:border-white/20",
        "animate-fade-in-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-purple-400">{icon}</span>
      <span className="text-sm text-white/70">{text}</span>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ConfiguratorCTA = memo(function ConfiguratorCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating component icons */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <FloatingIcon
          icon={<Cpu className="w-5 h-5" />}
          label="Intel / AMD"
          delay={0}
          position={{ x: '5%', y: '20%' }}
          color="#f97316"
        />
        <FloatingIcon
          icon={<Monitor className="w-5 h-5" />}
          label="RTX / RX"
          delay={0.5}
          position={{ x: '90%', y: '30%' }}
          color="#22c55e"
        />
        <FloatingIcon
          icon={<MemoryStick className="w-5 h-5" />}
          label="DDR5"
          delay={1}
          position={{ x: '8%', y: '70%' }}
          color="#3b82f6"
        />
        <FloatingIcon
          icon={<Droplets className="w-5 h-5" />}
          label="СВО"
          delay={1.5}
          position={{ x: '88%', y: '75%' }}
          color="#06b6d4"
        />
        <FloatingIcon
          icon={<Palette className="w-5 h-5" />}
          label="Кастом"
          delay={2}
          position={{ x: '15%', y: '45%' }}
          color="#ec4899"
        />
        <FloatingIcon
          icon={<Fan className="w-5 h-5" />}
          label="RGB"
          delay={2.5}
          position={{ x: '82%', y: '50%' }}
          color="#a855f7"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div
            className={cn(
              "space-y-8 transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Новый конфигуратор</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-white">Попробуй</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  собрать сам
                </span>
              </h2>
              <p className="text-lg text-white/60 max-w-md">
                Создай свою идеальную сборку с нуля. Выбирай компоненты,
                добавляй кастомизацию и наблюдай, как оживает твой уникальный ПК.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3">
              <FeatureBadge
                icon={<Wrench className="w-4 h-4" />}
                text="Выбор компонентов"
                delay={100}
              />
              <FeatureBadge
                icon={<Droplets className="w-4 h-4" />}
                text="Водяное охлаждение"
                delay={200}
              />
              <FeatureBadge
                icon={<Palette className="w-4 h-4" />}
                text="Винил & Фотопечать"
                delay={300}
              />
              <FeatureBadge
                icon={<Zap className="w-4 h-4" />}
                text="Мгновенный расчёт"
                delay={400}
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/configurator/custom"
                className={cn(
                  "group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl",
                  "bg-gradient-to-r from-purple-500 to-fuchsia-500",
                  "hover:from-purple-600 hover:to-fuchsia-600",
                  "text-white font-semibold text-lg",
                  "transition-all duration-300 hover:scale-105",
                  "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                )}
              >
                <Wrench className="w-5 h-5" />
                Открыть конфигуратор
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/configurator"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl",
                  "bg-white/5 border border-white/10",
                  "hover:bg-white/10 hover:border-white/20",
                  "text-white/80 font-medium",
                  "transition-all duration-300"
                )}
              >
                Быстрый выбор
              </Link>
            </div>

            {/* Trust note */}
            <p className="text-sm text-white/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Более 500 собранных кастомных ПК
            </p>
          </div>

          {/* Right: PC Preview */}
          <div
            className={cn(
              "transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
          >
            <PCPreview />
          </div>
        </div>
      </div>
    </section>
  );
});

export default ConfiguratorCTA;

"use client";

import * as React from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SpotlightProps {
  children?: React.ReactNode;
  className?: string;
  /** Container class for the spotlight wrapper */
  containerClassName?: string;
  /** Primary color for the spotlight (default: purple-500) */
  color?: string;
  /** Secondary color for gradient effect (default: fuchsia-500) */
  secondaryColor?: string;
  /** Size of the spotlight in pixels (default: 400) */
  size?: number;
  /** Opacity of the spotlight (0-1, default: 0.15) */
  opacity?: number;
  /** Enable enhanced mode with secondary spotlight (default: false) */
  enhanced?: boolean;
  /** Disable mouse tracking (static spotlight) */
  static?: boolean;
  /** Static position for x (0-1, default: 0.5) */
  staticX?: number;
  /** Static position for y (0-1, default: 0.3) */
  staticY?: number;
  /** Blur amount in pixels (default: 80) */
  blur?: number;
}

/**
 * Spotlight Component
 *
 * Creates a mouse-following spotlight effect using CSS gradients.
 * Respects prefers-reduced-motion for accessibility.
 * No canvas - pure CSS for better performance.
 *
 * @example
 * ```tsx
 * // Basic spotlight
 * <Spotlight>
 *   <div className="min-h-screen">Content</div>
 * </Spotlight>
 *
 * // Enhanced mode with dual spotlights
 * <Spotlight enhanced>
 *   <HeroSection />
 * </Spotlight>
 *
 * // Custom colors and size
 * <Spotlight
 *   color="rgba(168, 85, 247, 0.2)"
 *   secondaryColor="rgba(217, 70, 239, 0.15)"
 *   size={600}
 * >
 *   <Content />
 * </Spotlight>
 *
 * // Static spotlight (no mouse tracking)
 * <Spotlight static staticX={0.7} staticY={0.3}>
 *   <Section />
 * </Spotlight>
 * ```
 */
export function Spotlight({
  children,
  className,
  containerClassName,
  color = "rgba(168, 85, 247, 0.15)",
  secondaryColor = "rgba(217, 70, 239, 0.12)",
  size = 400,
  opacity = 0.15,
  enhanced = false,
  static: isStatic = false,
  staticX = 0.5,
  staticY = 0.3,
  blur = 80,
}: SpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse position with spring physics for smooth movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the spotlight
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Secondary spotlight offset (for enhanced mode)
  const secondaryX = useMotionValue(0);
  const secondaryY = useMotionValue(0);
  const smoothSecondaryX = useSpring(secondaryX, { damping: 30, stiffness: 100 });
  const smoothSecondaryY = useSpring(secondaryY, { damping: 30, stiffness: 100 });

  React.useEffect(() => {
    if (isStatic || prefersReducedMotion) {
      // Set static positions
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        mouseX.set(rect.width * staticX);
        mouseY.set(rect.height * staticY);
        if (enhanced) {
          secondaryX.set(rect.width * (1 - staticX));
          secondaryY.set(rect.height * (1 - staticY));
        }
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);

      if (enhanced) {
        // Secondary spotlight follows with offset and delay
        secondaryX.set(rect.width - x);
        secondaryY.set(rect.height - y);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [
    isStatic,
    prefersReducedMotion,
    mouseX,
    mouseY,
    secondaryX,
    secondaryY,
    staticX,
    staticY,
    enhanced,
  ]);

  // For reduced motion, show a subtle static glow
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", containerClassName)}
      >
        {/* Static ambient glow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            className
          )}
          style={{
            background: `
              radial-gradient(
                circle at ${staticX * 100}% ${staticY * 100}%,
                ${color} 0%,
                transparent 50%
              )
            `,
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {/* Primary spotlight */}
      <motion.div
        className={cn(
          "pointer-events-none absolute",
          className
        )}
        style={{
          width: size,
          height: size,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      />

      {/* Secondary spotlight (enhanced mode only) */}
      {enhanced && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            width: size * 0.8,
            height: size * 0.8,
            x: smoothSecondaryX,
            y: smoothSecondaryY,
            translateX: "-50%",
            translateY: "-50%",
            background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
            filter: `blur(${blur * 1.2}px)`,
            opacity: opacity * 0.8,
          }}
        />
      )}

      {children}
    </div>
  );
}

/**
 * SpotlightCard Component
 *
 * A card with built-in spotlight effect on hover.
 * Perfect for feature cards and interactive elements.
 */
export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Spotlight color */
  color?: string;
  /** Spotlight size */
  size?: number;
  /** Enable border glow effect */
  borderGlow?: boolean;
}

export function SpotlightCard({
  children,
  className,
  color = "rgba(168, 85, 247, 0.1)",
  size = 300,
  borderGlow = false,
}: SpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden",
        borderGlow && "before:absolute before:inset-0 before:rounded-inherit before:p-px before:bg-gradient-to-br before:from-purple-500/20 before:via-transparent before:to-fuchsia-500/20",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover spotlight */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute"
          style={{
            width: size,
            height: size,
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: "blur(40px)",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ opacity: { duration: 0.2 } }}
        />
      )}

      {children}
    </motion.div>
  );
}

/**
 * AmbientGlow Component
 *
 * Static decorative glow elements for backgrounds.
 * No mouse interaction, pure CSS.
 */
export interface AmbientGlowProps {
  className?: string;
  /** Position from left (0-100%) */
  x?: number;
  /** Position from top (0-100%) */
  y?: number;
  /** Glow color */
  color?: string;
  /** Glow size in pixels */
  size?: number;
  /** Blur amount */
  blur?: number;
  /** Animate pulsing */
  pulse?: boolean;
}

export function AmbientGlow({
  className,
  x = 50,
  y = 50,
  color = "rgba(168, 85, 247, 0.2)",
  size = 400,
  blur = 100,
  pulse = false,
}: AmbientGlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-full",
        pulse && "animate-pulse-slow",
        className
      )}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        background: color,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}

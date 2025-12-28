"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animation direction options
 */
type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * Animation preset types
 */
type AnimationPreset = "fade" | "slide" | "scale" | "blur" | "reveal";

export interface FadeInProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate"> {
  children: React.ReactNode;
  className?: string;
  /** Animation direction (default: "up") */
  direction?: Direction;
  /** Animation preset (default: "fade") */
  preset?: AnimationPreset;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds (default: 0.5) */
  duration?: number;
  /** Viewport margin for triggering (default: "-50px") */
  threshold?: string;
  /** Only animate once (default: true) */
  once?: boolean;
  /** Disable animation entirely */
  disabled?: boolean;
  /** Custom initial offset in pixels (default: 24) */
  offset?: number;
}

/**
 * Get initial animation state based on direction and preset
 */
function getInitialState(
  direction: Direction,
  preset: AnimationPreset,
  offset: number,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    return { opacity: 0 };
  }

  const baseOpacity = preset === "reveal" ? 1 : 0;
  const baseState = { opacity: baseOpacity };

  switch (preset) {
    case "scale":
      return { ...baseState, scale: 0.95 };
    case "blur":
      return { ...baseState, filter: "blur(10px)" };
    case "reveal":
      return { clipPath: "inset(0 100% 0 0)" };
    default:
      break;
  }

  switch (direction) {
    case "up":
      return { ...baseState, y: offset };
    case "down":
      return { ...baseState, y: -offset };
    case "left":
      return { ...baseState, x: offset };
    case "right":
      return { ...baseState, x: -offset };
    case "none":
    default:
      return baseState;
  }
}

/**
 * Get final animation state
 */
function getFinalState(preset: AnimationPreset) {
  const baseState = { opacity: 1 };

  switch (preset) {
    case "scale":
      return { ...baseState, scale: 1 };
    case "blur":
      return { ...baseState, filter: "blur(0px)" };
    case "reveal":
      return { clipPath: "inset(0 0% 0 0)" };
    default:
      return { ...baseState, x: 0, y: 0 };
  }
}

/**
 * FadeIn Component
 *
 * A performant fade-in animation component using IntersectionObserver.
 * Respects prefers-reduced-motion for accessibility.
 *
 * @example
 * ```tsx
 * // Basic fade up
 * <FadeIn>
 *   <h1>Hello World</h1>
 * </FadeIn>
 *
 * // Slide from right with delay
 * <FadeIn direction="right" delay={0.2}>
 *   <Card>Content</Card>
 * </FadeIn>
 *
 * // Scale animation
 * <FadeIn preset="scale" duration={0.8}>
 *   <Image src="..." />
 * </FadeIn>
 *
 * // Blur reveal
 * <FadeIn preset="blur">
 *   <Text>Blurred content</Text>
 * </FadeIn>
 *
 * // Stagger children
 * <FadeIn delay={0}>First</FadeIn>
 * <FadeIn delay={0.1}>Second</FadeIn>
 * <FadeIn delay={0.2}>Third</FadeIn>
 * ```
 */
export function FadeIn({
  children,
  className,
  direction = "up",
  preset = "fade",
  delay = 0,
  duration = 0.5,
  threshold = "-50px",
  once = true,
  disabled = false,
  offset = 24,
  ...props
}: FadeInProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: threshold as "-50px" | undefined,
  });
  const prefersReducedMotion = useReducedMotion();

  // Skip animations if disabled or user prefers reduced motion
  const shouldAnimate = !disabled && !prefersReducedMotion;

  const initialState = getInitialState(
    direction,
    preset,
    offset,
    !!prefersReducedMotion
  );
  const finalState = getFinalState(preset);

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={shouldAnimate ? initialState : finalState}
      animate={isInView ? finalState : initialState}
      transition={{
        duration: shouldAnimate ? duration : 0,
        delay: shouldAnimate ? delay : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInStagger Component
 *
 * Container for staggered FadeIn animations.
 * Automatically staggers child FadeIn components.
 */
export interface FadeInStaggerProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate"> {
  children: React.ReactNode;
  className?: string;
  /** Base delay for first child (default: 0) */
  baseDelay?: number;
  /** Delay between each child (default: 0.1) */
  staggerDelay?: number;
  /** Viewport margin for triggering (default: "-50px") */
  threshold?: string;
  /** Only animate once (default: true) */
  once?: boolean;
}

export function FadeInStagger({
  children,
  className,
  baseDelay = 0,
  staggerDelay = 0.1,
  threshold = "-50px",
  once = true,
  ...props
}: FadeInStaggerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: threshold as "-50px" | undefined,
  });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
            delayChildren: prefersReducedMotion ? 0 : baseDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInItem Component
 *
 * Use inside FadeInStagger for automatic staggered animations.
 */
export interface FadeInItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  className?: string;
  /** Animation direction (default: "up") */
  direction?: Direction;
  /** Custom offset in pixels (default: 24) */
  offset?: number;
  /** Duration in seconds (default: 0.5) */
  duration?: number;
}

export function FadeInItem({
  children,
  className,
  direction = "up",
  offset = 24,
  duration = 0.5,
  ...props
}: FadeInItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          ...(direction === "up" && { y: offset }),
          ...(direction === "down" && { y: -offset }),
          ...(direction === "left" && { x: offset }),
          ...(direction === "right" && { x: -offset }),
        },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div className={cn(className)} variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

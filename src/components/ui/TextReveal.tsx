'use client';

import { motion, useInView, Variants, useReducedMotion } from 'framer-motion';
import { useRef, useMemo, memo, useState, useEffect } from 'react';
import { cn } from '@/lib/cn';

// ============================================
// PERFORMANCE OPTIMIZED TEXT REVEAL
// ============================================
// Optimizations applied:
// 1. useReducedMotion support
// 2. Word-based animation mode for long text (reduces DOM nodes)
// 3. MAX_CHAR_ANIMATION limit to prevent DOM bloat
// 4. Memoized animation variants
// 5. React.memo for sub-components
// 6. Conditional rendering based on visibility
// ============================================

// Maximum characters for per-character animation
// Above this threshold, use word-based animation automatically
const MAX_CHAR_ANIMATION = 50;

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  once?: boolean;
  animation?: 'fade-up' | 'fade-down' | 'slide-right' | 'slide-left' | 'typewriter' | 'glitch' | 'wave';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  gradient?: boolean;
  glowOnReveal?: boolean;
  /** Force word-based animation for better performance */
  wordMode?: boolean;
}

// Animation variants - defined outside component
const animations: Record<string, { container: Variants; child: Variants }> = {
  'fade-up': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03 },
      },
    },
    child: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  'fade-down': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03 },
      },
    },
    child: {
      hidden: { opacity: 0, y: -20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  'slide-right': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 },
      },
    },
    child: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 },
    },
  },
  'slide-left': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 },
      },
    },
    child: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
    },
  },
  typewriter: {
    container: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
    },
    child: {
      hidden: { opacity: 0, display: 'none' },
      visible: { opacity: 1, display: 'inline-block' },
    },
  },
  glitch: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 },
      },
    },
    child: {
      hidden: {
        opacity: 0,
        x: 0,
        textShadow: '0 0 0 transparent',
      },
      visible: {
        opacity: 1,
        x: [0, -2, 2, -2, 0],
        textShadow: [
          '0 0 0 transparent',
          '-2px 0 #ff00ff, 2px 0 #00ffff',
          '2px 0 #ff00ff, -2px 0 #00ffff',
          '-2px 0 #ff00ff, 2px 0 #00ffff',
          '0 0 0 transparent',
        ],
        transition: {
          duration: 0.3,
        }
      },
    },
  },
  wave: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
      },
    },
    child: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: [20, -10, 5, 0],
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 200,
        }
      },
    },
  },
};

// Word-based animations for better performance with long text
const wordAnimations: Record<string, { container: Variants; child: Variants }> = {
  'fade-up': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
      },
    },
    child: {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    },
  },
  'fade-down': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
      },
    },
    child: {
      hidden: { opacity: 0, y: -15 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    },
  },
  'slide-right': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
      },
    },
    child: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    },
  },
  'slide-left': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
      },
    },
    child: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    },
  },
  typewriter: {
    container: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    },
    child: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    },
  },
  glitch: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
    },
    child: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.3 }
      },
    },
  },
  wave: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
      },
    },
    child: {
      hidden: { opacity: 0, y: 15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          damping: 15,
          stiffness: 150,
        }
      },
    },
  },
};

function TextRevealComponent({
  children,
  className,
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.03,
  once = true,
  animation = 'fade-up',
  as: Component = 'span',
  gradient = false,
  glowOnReveal = false,
  wordMode = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  // Auto-switch to word mode for long text or if reduced motion is preferred
  const useWordMode = wordMode || children.length > MAX_CHAR_ANIMATION || shouldReduceMotion;

  const selectedAnimation = useWordMode
    ? wordAnimations[animation] || wordAnimations['fade-up']
    : animations[animation];

  const words = useMemo(() => children.split(' '), [children]);

  const MotionComponent = motion[Component] as typeof motion.span;

  // If reduced motion, show text immediately without animation
  if (shouldReduceMotion) {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={cn(
          'inline-block',
          gradient && 'bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent',
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      className={cn(
        'inline-block',
        gradient && 'bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto]',
        glowOnReveal && isInView && 'animate-text-glow',
        className
      )}
      variants={selectedAnimation.container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay, staggerChildren }}
      style={gradient ? {
        backgroundSize: '200% auto',
        animation: isInView ? 'gradient-shift 3s linear infinite' : 'none',
      } : undefined}
    >
      {useWordMode ? (
        // Word-based animation - fewer DOM elements
        words.map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            className="inline-block whitespace-pre"
            variants={selectedAnimation.child}
            transition={{ duration }}
          >
            {word}
            {wordIndex < words.length - 1 && <span>&nbsp;</span>}
          </motion.span>
        ))
      ) : (
        // Character-based animation - more DOM elements but smoother
        words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-pre">
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className="inline-block"
                variants={selectedAnimation.child}
                transition={{ duration }}
              >
                {char}
              </motion.span>
            ))}
            {wordIndex < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))
      )}
    </MotionComponent>
  );
}

export const TextReveal = memo(TextRevealComponent);

// Line-by-line reveal for paragraphs
interface LineRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerLines?: number;
  once?: boolean;
}

function LineRevealComponent({
  children,
  className,
  delay = 0,
  staggerLines = 0.1,
  once = true,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  const lines = useMemo(() => children.split('\n'), [children]);

  // If reduced motion, show text immediately
  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay, staggerChildren: staggerLines }}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          className="overflow-hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '100%' },
              visible: { y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {line}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export const LineReveal = memo(LineRevealComponent);

// Counter animation for numbers
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  delay?: number;
}

function AnimatedCounterComponent({
  value,
  suffix = '',
  prefix = '',
  className,
  duration = 2,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion, show final value immediately
  if (shouldReduceMotion) {
    return (
      <span ref={ref} className={cn('tabular-nums', className)}>
        {prefix}{value}{suffix}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay }}
      >
        {isInView && (
          <Counter from={0} to={value} duration={duration} delay={delay} />
        )}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

export const AnimatedCounter = memo(AnimatedCounterComponent);

const Counter = memo(function Counter({
  from,
  to,
  duration,
  delay,
}: {
  from: number;
  to: number;
  duration: number;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const startTime = Date.now();
    const delayMs = delay * 1000;
    const durationMs = duration * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime - delayMs;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [from, to, duration, delay]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {displayValue}
    </motion.span>
  );
});

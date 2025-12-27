"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Button Variants (shadcn v4 optimized)
 * Cyberpunk/Neon styled button with glow effects
 */
const buttonVariants = cva(
  // Base styles - enhanced with shadcn v4 patterns
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-300 ease-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    "shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "relative overflow-hidden",
    "font-outfit tracking-wide uppercase",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary - Purple glow effect
        primary: [
          "bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]",
          "text-white",
          "border border-[#8B5CF6]/50",
          "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
          "hover:shadow-[0_0_30px_rgba(139,92,246,0.5),0_0_60px_rgba(139,92,246,0.3)]",
          "hover:border-[#A855F7]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
          "focus-visible:ring-[#8B5CF6]",
        ].join(" "),

        // Secondary - Cyan glow effect
        secondary: [
          "bg-gradient-to-r from-[#06B6D4] to-[#22D3EE]",
          "text-white",
          "border border-[#06B6D4]/50",
          "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
          "hover:shadow-[0_0_30px_rgba(6,182,212,0.5),0_0_60px_rgba(6,182,212,0.3)]",
          "hover:border-[#22D3EE]",
          "hover:scale-[1.02]",
          "active:scale-[0.98]",
          "focus-visible:ring-[#06B6D4]",
        ].join(" "),

        // Outline - Gradient border with transparent background
        outline: [
          "bg-transparent",
          "text-white",
          "border border-[#8B5CF6]/50",
          "hover:bg-[#8B5CF6]/10",
          "hover:border-[#8B5CF6]",
          "hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
          "hover:text-[#A855F7]",
          "active:bg-[#8B5CF6]/20",
          "focus-visible:ring-[#8B5CF6]",
        ].join(" "),

        // Outline Cyan variant
        "outline-cyan": [
          "bg-transparent",
          "text-white",
          "border border-[#06B6D4]/50",
          "hover:bg-[#06B6D4]/10",
          "hover:border-[#06B6D4]",
          "hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]",
          "hover:text-[#22D3EE]",
          "active:bg-[#06B6D4]/20",
          "focus-visible:ring-[#06B6D4]",
        ].join(" "),

        // Ghost - Minimal styling with hover effect
        ghost: [
          "bg-transparent",
          "text-zinc-400",
          "hover:bg-white/5",
          "hover:text-white",
          "active:bg-white/10",
          "focus-visible:ring-zinc-400",
        ].join(" "),

        // Glass - Glassmorphism effect
        glass: [
          "bg-white/5",
          "backdrop-blur-md",
          "text-white",
          "border border-white/10",
          "hover:bg-white/10",
          "hover:border-[#8B5CF6]/30",
          "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
          "active:bg-white/15",
          "focus-visible:ring-white/50",
        ].join(" "),

        // Destructive - Red/danger variant
        destructive: [
          "bg-gradient-to-r from-red-600 to-red-500",
          "text-white",
          "border border-red-500/50",
          "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
          "hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
          "hover:border-red-400",
          "active:scale-[0.98]",
          "focus-visible:ring-red-500",
        ].join(" "),

        // Link - Text only with underline on hover
        link: [
          "bg-transparent",
          "text-[#8B5CF6]",
          "underline-offset-4",
          "hover:underline",
          "hover:text-[#A855F7]",
          "p-0 h-auto",
        ].join(" "),

        // Neon - Intense glow effect
        neon: [
          "bg-black",
          "text-[#8B5CF6]",
          "border-2 border-[#8B5CF6]",
          "shadow-[0_0_10px_#8B5CF6,inset_0_0_10px_rgba(139,92,246,0.1)]",
          "hover:shadow-[0_0_20px_#8B5CF6,0_0_40px_#8B5CF6,inset_0_0_20px_rgba(139,92,246,0.2)]",
          "hover:text-white",
          "hover:bg-[#8B5CF6]/20",
          "active:scale-[0.98]",
          "focus-visible:ring-[#8B5CF6]",
        ].join(" "),

        // Neon Cyan variant
        "neon-cyan": [
          "bg-black",
          "text-[#06B6D4]",
          "border-2 border-[#06B6D4]",
          "shadow-[0_0_10px_#06B6D4,inset_0_0_10px_rgba(6,182,212,0.1)]",
          "hover:shadow-[0_0_20px_#06B6D4,0_0_40px_#06B6D4,inset_0_0_20px_rgba(6,182,212,0.2)]",
          "hover:text-white",
          "hover:bg-[#06B6D4]/20",
          "active:scale-[0.98]",
          "focus-visible:ring-[#06B6D4]",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      loading: {
        true: "pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
      loading: false,
    },
  }
);

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="animate-spin size-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Glow effect overlay component
const GlowOverlay = ({ variant }: { variant?: string }) => {
  const glowColor =
    variant === "secondary" || variant === "outline-cyan" || variant === "neon-cyan"
      ? "rgba(6, 182, 212, 0.4)"
      : "rgba(139, 92, 246, 0.4)";

  return (
    <span
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor} 0%, transparent 50%)`,
      }}
    />
  );
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * VA-PC Button Component
 *
 * A cyberpunk-styled button with multiple variants including glow effects,
 * glassmorphism, and neon aesthetics.
 *
 * @example
 * ```tsx
 * // Primary button with purple glow
 * <Button variant="primary">Buy Now</Button>
 *
 * // Secondary button with cyan glow
 * <Button variant="secondary">Learn More</Button>
 *
 * // Neon effect button
 * <Button variant="neon">Activate</Button>
 *
 * // Loading state
 * <Button loading>Processing...</Button>
 *
 * // With icons
 * <Button leftIcon={<ShoppingCart />}>Add to Cart</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      fullWidth = false,
      loading = false,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onMouseMove,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Handle mouse move for glow effect position
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        buttonRef.current.style.setProperty("--mouse-x", `${x}%`);
        buttonRef.current.style.setProperty("--mouse-y", `${y}%`);
      }
      onMouseMove?.(e);
    };

    // Merge refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    return (
      <Comp
        ref={buttonRef}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={cn(
          buttonVariants({ variant, size, fullWidth, loading, className }),
          "group"
        )}
        disabled={disabled || loading}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Glow effect overlay */}
        {!loading && variant !== "link" && variant !== "ghost" && (
          <GlowOverlay variant={variant ?? undefined} />
        )}

        {/* Loading spinner or left icon */}
        {loading ? (
          <LoadingSpinner />
        ) : leftIcon ? (
          <span className="mr-1">{leftIcon}</span>
        ) : null}

        {/* Button content */}
        <span className="relative z-10">{children}</span>

        {/* Right icon */}
        {!loading && rightIcon && <span className="ml-1">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

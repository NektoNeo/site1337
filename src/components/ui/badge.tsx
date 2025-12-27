"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Badge Variants
 * Cyberpunk/Neon styled badges for specs, labels, and status indicators
 * Includes brand-specific variants for Intel, NVIDIA, AMD, etc.
 */
const badgeVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center",
    "rounded-full border px-3 py-1",
    "text-xs font-semibold uppercase tracking-wider",
    "transition-all duration-200",
    "whitespace-nowrap",
    "[&>svg]:size-3 [&>svg]:mr-1.5",
    "font-outfit",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - Purple theme
        default: [
          "bg-[#8B5CF6]/10",
          "border-[#8B5CF6]/30",
          "text-[#A855F7]",
          "hover:bg-[#8B5CF6]/20",
          "hover:border-[#8B5CF6]/50",
        ].join(" "),

        // Secondary - Cyan theme
        secondary: [
          "bg-[#06B6D4]/10",
          "border-[#06B6D4]/30",
          "text-[#22D3EE]",
          "hover:bg-[#06B6D4]/20",
          "hover:border-[#06B6D4]/50",
        ].join(" "),

        // Outline - Transparent with border
        outline: [
          "bg-transparent",
          "border-zinc-600",
          "text-zinc-300",
          "hover:bg-white/5",
          "hover:border-zinc-500",
        ].join(" "),

        // Destructive - Red/error
        destructive: [
          "bg-red-500/10",
          "border-red-500/30",
          "text-red-400",
          "hover:bg-red-500/20",
        ].join(" "),

        // Success - Green
        success: [
          "bg-emerald-500/10",
          "border-emerald-500/30",
          "text-emerald-400",
          "hover:bg-emerald-500/20",
        ].join(" "),

        // Warning - Yellow/Orange
        warning: [
          "bg-amber-500/10",
          "border-amber-500/30",
          "text-amber-400",
          "hover:bg-amber-500/20",
        ].join(" "),

        // ========================================
        // BRAND VARIANTS - Tech company styles
        // ========================================

        // Intel - Blue theme
        intel: [
          "bg-[#0071C5]/10",
          "border-[#0071C5]/40",
          "text-[#00A8E8]",
          "shadow-[0_0_10px_rgba(0,113,197,0.2)]",
          "hover:shadow-[0_0_15px_rgba(0,113,197,0.4)]",
          "hover:bg-[#0071C5]/20",
        ].join(" "),

        // NVIDIA - Green theme
        nvidia: [
          "bg-[#76B900]/10",
          "border-[#76B900]/40",
          "text-[#76B900]",
          "shadow-[0_0_10px_rgba(118,185,0,0.2)]",
          "hover:shadow-[0_0_15px_rgba(118,185,0,0.4)]",
          "hover:bg-[#76B900]/20",
        ].join(" "),

        // AMD - Red theme
        amd: [
          "bg-[#ED1C24]/10",
          "border-[#ED1C24]/40",
          "text-[#FF4444]",
          "shadow-[0_0_10px_rgba(237,28,36,0.2)]",
          "hover:shadow-[0_0_15px_rgba(237,28,36,0.4)]",
          "hover:bg-[#ED1C24]/20",
        ].join(" "),

        // ASUS ROG - Red/Orange theme
        rog: [
          "bg-[#FF0000]/10",
          "border-[#FF0000]/40",
          "text-[#FF3333]",
          "shadow-[0_0_10px_rgba(255,0,0,0.2)]",
          "hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]",
          "hover:bg-[#FF0000]/20",
        ].join(" "),

        // Corsair - Yellow theme
        corsair: [
          "bg-[#FFD100]/10",
          "border-[#FFD100]/40",
          "text-[#FFD100]",
          "shadow-[0_0_10px_rgba(255,209,0,0.2)]",
          "hover:shadow-[0_0_15px_rgba(255,209,0,0.4)]",
          "hover:bg-[#FFD100]/20",
        ].join(" "),

        // MSI - Red/Dragon theme
        msi: [
          "bg-[#FF0000]/10",
          "border-[#FF0000]/40",
          "text-[#FF3333]",
          "shadow-[0_0_10px_rgba(255,0,0,0.2)]",
          "hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]",
          "hover:bg-[#FF0000]/20",
        ].join(" "),

        // Razer - Green theme
        razer: [
          "bg-[#00FF00]/10",
          "border-[#00FF00]/40",
          "text-[#00FF00]",
          "shadow-[0_0_10px_rgba(0,255,0,0.2)]",
          "hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]",
          "hover:bg-[#00FF00]/20",
        ].join(" "),

        // Kingston - Red theme
        kingston: [
          "bg-[#E4002B]/10",
          "border-[#E4002B]/40",
          "text-[#FF4444]",
          "shadow-[0_0_10px_rgba(228,0,43,0.2)]",
          "hover:shadow-[0_0_15px_rgba(228,0,43,0.4)]",
          "hover:bg-[#E4002B]/20",
        ].join(" "),

        // Samsung - Blue theme
        samsung: [
          "bg-[#1428A0]/10",
          "border-[#1428A0]/40",
          "text-[#5B8DEE]",
          "shadow-[0_0_10px_rgba(20,40,160,0.2)]",
          "hover:shadow-[0_0_15px_rgba(20,40,160,0.4)]",
          "hover:bg-[#1428A0]/20",
        ].join(" "),

        // ========================================
        // SPECIAL EFFECTS
        // ========================================

        // Glow - Purple neon glow
        glow: [
          "bg-[#8B5CF6]/20",
          "border-[#8B5CF6]",
          "text-white",
          "shadow-[0_0_10px_#8B5CF6,0_0_20px_rgba(139,92,246,0.3)]",
          "hover:shadow-[0_0_15px_#8B5CF6,0_0_30px_rgba(139,92,246,0.5)]",
        ].join(" "),

        // Glow Cyan
        "glow-cyan": [
          "bg-[#06B6D4]/20",
          "border-[#06B6D4]",
          "text-white",
          "shadow-[0_0_10px_#06B6D4,0_0_20px_rgba(6,182,212,0.3)]",
          "hover:shadow-[0_0_15px_#06B6D4,0_0_30px_rgba(6,182,212,0.5)]",
        ].join(" "),

        // Gradient - Purple to Cyan gradient
        gradient: [
          "bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]",
          "border-transparent",
          "text-white",
          "shadow-[0_0_15px_rgba(139,92,246,0.3)]",
          "hover:shadow-[0_0_25px_rgba(139,92,246,0.5),0_0_25px_rgba(6,182,212,0.3)]",
        ].join(" "),

        // Glass - Glassmorphism effect
        glass: [
          "bg-white/5",
          "backdrop-blur-md",
          "border-white/10",
          "text-white",
          "hover:bg-white/10",
        ].join(" "),

        // Solid Dark
        dark: [
          "bg-zinc-800",
          "border-zinc-700",
          "text-zinc-300",
          "hover:bg-zinc-700",
        ].join(" "),
      },
      size: {
        default: "h-6 px-3 text-xs",
        sm: "h-5 px-2 text-[10px]",
        lg: "h-7 px-4 text-sm",
      },
      animated: {
        true: "animate-pulse-glow",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animated: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  dot?: boolean;
  dotColor?: string;
}

/**
 * VA-PC Badge Component
 *
 * A cyberpunk-styled badge for displaying specs, labels, and status.
 * Includes brand-specific variants for Intel, NVIDIA, AMD, etc.
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // Intel processor badge
 * <Badge variant="intel" icon={<CpuIcon />}>Core i9-14900K</Badge>
 *
 * // NVIDIA GPU badge
 * <Badge variant="nvidia">RTX 4090</Badge>
 *
 * // Status badge with dot
 * <Badge variant="success" dot>In Stock</Badge>
 *
 * // Animated glow badge
 * <Badge variant="glow" animated>Limited Edition</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      animated = false,
      asChild = false,
      icon,
      dot = false,
      dotColor,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant, size, animated, className }))}
        {...props}
      >
        {/* Status dot */}
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
            style={{
              backgroundColor:
                dotColor ||
                (variant === "success"
                  ? "#10B981"
                  : variant === "destructive"
                  ? "#EF4444"
                  : variant === "warning"
                  ? "#F59E0B"
                  : "#8B5CF6"),
            }}
          />
        )}

        {/* Icon */}
        {icon}

        {/* Content */}
        {children}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";

// Predefined spec badges for common components
interface SpecBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  type: "cpu" | "gpu" | "ram" | "storage" | "cooling" | "psu" | "case";
  brand?: "intel" | "amd" | "nvidia" | "corsair" | "samsung" | "kingston";
  value: string;
}

const SpecBadge = React.forwardRef<HTMLSpanElement, SpecBadgeProps>(
  ({ type, brand, value, className, ...props }, ref) => {
    // Determine variant based on brand or type
    const getVariant = (): BadgeProps["variant"] => {
      if (brand) {
        return brand as BadgeProps["variant"];
      }

      switch (type) {
        case "cpu":
          return "intel";
        case "gpu":
          return "nvidia";
        case "ram":
        case "storage":
          return "secondary";
        case "cooling":
          return "glow-cyan";
        case "psu":
          return "warning";
        case "case":
          return "glass";
        default:
          return "default";
      }
    };

    // Get icon based on type
    const getIcon = () => {
      switch (type) {
        case "cpu":
          return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          );
        case "gpu":
          return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="7" cy="12" r="2" />
              <circle cx="17" cy="12" r="2" />
              <line x1="11" y1="9" x2="13" y2="9" />
              <line x1="11" y1="12" x2="13" y2="12" />
              <line x1="11" y1="15" x2="13" y2="15" />
            </svg>
          );
        case "ram":
          return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="10" rx="1" />
              <line x1="6" y1="10" x2="6" y2="14" />
              <line x1="10" y1="10" x2="10" y2="14" />
              <line x1="14" y1="10" x2="14" y2="14" />
              <line x1="18" y1="10" x2="18" y2="14" />
            </svg>
          );
        case "storage":
          return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <Badge
        ref={ref}
        variant={getVariant()}
        icon={getIcon()}
        className={className}
        {...props}
      >
        {value}
      </Badge>
    );
  }
);

SpecBadge.displayName = "SpecBadge";

export { Badge, badgeVariants, SpecBadge };

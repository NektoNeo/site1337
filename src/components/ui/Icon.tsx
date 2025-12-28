"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Icon size variants
 *
 * Provides consistent sizing across the application.
 * All icons are stroke-based and monochrome by default.
 */
const iconVariants = cva(
  // Base styles - stroke-based, monochrome
  ["inline-flex", "shrink-0", "stroke-[1.5]"].join(" "),
  {
    variants: {
      size: {
        xs: "size-3",      // 12px
        sm: "size-4",      // 16px
        default: "size-5", // 20px
        md: "size-6",      // 24px
        lg: "size-8",      // 32px
        xl: "size-10",     // 40px
        "2xl": "size-12",  // 48px
      },
      color: {
        default: "text-current",
        muted: "text-[var(--color-text-muted)]",
        secondary: "text-[var(--color-text-secondary)]",
        primary: "text-[var(--color-text-primary)]",
        accent: "text-purple-500",
        fuchsia: "text-fuchsia-500",
        success: "text-emerald-500",
        warning: "text-amber-500",
        error: "text-red-500",
      },
    },
    defaultVariants: {
      size: "default",
      color: "default",
    },
  }
);

export interface IconProps
  extends Omit<LucideProps, "size" | "color">,
    VariantProps<typeof iconVariants> {
  /** The Lucide icon component to render */
  icon: LucideIcon;
  /** Add hover glow effect */
  glow?: boolean;
  /** Glow color (default: purple) */
  glowColor?: "purple" | "fuchsia";
}

/**
 * Icon Component
 *
 * A wrapper for Lucide icons with consistent sizing and theming.
 * All icons are stroke-based and monochrome by default.
 *
 * @example
 * ```tsx
 * import { ShoppingCart, Heart, Settings } from 'lucide-react';
 *
 * // Default icon (20px)
 * <Icon icon={ShoppingCart} />
 *
 * // Small muted icon
 * <Icon icon={Heart} size="sm" color="muted" />
 *
 * // Large accent icon with glow
 * <Icon icon={Settings} size="lg" color="accent" glow />
 *
 * // Custom className
 * <Icon icon={Heart} className="hover:text-red-500 transition-colors" />
 * ```
 */
export function Icon({
  icon: IconComponent,
  size,
  color,
  glow = false,
  glowColor = "purple",
  className,
  ...props
}: IconProps) {
  const glowClasses = glow
    ? glowColor === "fuchsia"
      ? "drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]"
      : "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
    : "";

  return (
    <IconComponent
      className={cn(iconVariants({ size, color }), glowClasses, className)}
      {...props}
    />
  );
}

/**
 * IconButton Component
 *
 * An icon wrapped in a clickable button with focus and hover states.
 *
 * @example
 * ```tsx
 * import { X, Menu } from 'lucide-react';
 *
 * <IconButton icon={X} onClick={handleClose} label="Close" />
 * <IconButton icon={Menu} size="lg" variant="ghost" label="Open menu" />
 * ```
 */
const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-lg",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-purple-500/50 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--color-bg-primary)]",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--glass-bg)]",
          "border border-[var(--glass-border)]",
          "text-[var(--color-text-secondary)]",
          "hover:text-[var(--color-text-primary)]",
          "hover:border-[var(--color-border-glow)]",
        ].join(" "),
        ghost: [
          "bg-transparent",
          "text-[var(--color-text-secondary)]",
          "hover:bg-[var(--glass-bg)]",
          "hover:text-[var(--color-text-primary)]",
        ].join(" "),
        glow: [
          "bg-[var(--glass-bg)]",
          "border border-purple-500/30",
          "text-purple-400",
          "hover:text-purple-300",
          "hover:border-purple-500/50",
          "hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        ].join(" "),
      },
      size: {
        sm: "size-8 p-1.5",
        default: "size-10 p-2",
        lg: "size-12 p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon;
  /** Accessible label for the button */
  label: string;
  /** Icon size within the button */
  iconSize?: IconProps["size"];
}

export function IconButton({
  icon,
  label,
  variant,
  size,
  iconSize,
  className,
  ...props
}: IconButtonProps) {
  // Map button size to icon size
  const computedIconSize = iconSize || (size === "sm" ? "sm" : size === "lg" ? "md" : "default");

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      <Icon icon={icon} size={computedIconSize} />
    </button>
  );
}

/**
 * Pre-configured icon components for common use cases
 */

// Re-export commonly used icons from lucide-react for convenience
export {
  // Navigation
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  // Actions
  ShoppingCart,
  Heart,
  Share2,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit,
  Settings,
  Search,
  Filter,
  Plus,
  Minus,
  Check,
  // Communication
  Phone,
  Mail,
  MessageCircle,
  Send,
  // Social
  Youtube,
  Instagram,
  // Hardware/PC
  Cpu,
  HardDrive,
  Monitor,
  Gamepad2,
  Zap,
  Thermometer,
  Fan,
  // Status
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  // Misc
  Star,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  User,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";

export { iconVariants, iconButtonVariants };

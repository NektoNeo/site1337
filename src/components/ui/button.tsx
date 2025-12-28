import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * VA-PC Button Variants
 *
 * Includes standard variants plus premium glass/UV glow options
 * aligned with the design system tokens.
 */
const buttonVariants = cva(
  // Base styles with focus ring using design tokens
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-purple-500/50 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--color-bg-primary)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - Solid purple
        default: [
          "bg-purple-500 text-white",
          "hover:bg-purple-600",
          "active:bg-purple-700",
        ].join(" "),

        // Glass - Premium glassmorphism button
        glass: [
          "bg-[var(--glass-bg)] backdrop-blur-md",
          "border border-[var(--glass-border)]",
          "text-[var(--color-text-primary)]",
          "hover:border-[var(--color-border-glow)]",
          "hover:bg-[var(--color-bg-elevated)]",
        ].join(" "),

        // UV Glow - Glass with purple glow effect
        glow: [
          "bg-[var(--glass-bg)] backdrop-blur-md",
          "border border-purple-500/30",
          "text-white",
          "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
          "hover:border-purple-500/60",
          "hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]",
        ].join(" "),

        // Fuchsia Glow - Glass with fuchsia glow
        "glow-fuchsia": [
          "bg-[var(--glass-bg)] backdrop-blur-md",
          "border border-fuchsia-500/30",
          "text-white",
          "shadow-[0_0_15px_rgba(217,70,239,0.3)]",
          "hover:border-fuchsia-500/60",
          "hover:shadow-[0_0_25px_rgba(217,70,239,0.5)]",
        ].join(" "),

        // Gradient - Purple to Fuchsia gradient
        gradient: [
          "bg-gradient-to-r from-purple-500 to-fuchsia-500",
          "text-white border-0",
          "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          "hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]",
          "hover:from-purple-600 hover:to-fuchsia-600",
        ].join(" "),

        // Outline - Border only
        outline: [
          "border border-[var(--color-border-subtle)]",
          "bg-transparent text-[var(--color-text-primary)]",
          "hover:bg-[var(--glass-bg)]",
          "hover:border-[var(--color-border-glow)]",
        ].join(" "),

        // Secondary - Muted background
        secondary: [
          "bg-[var(--color-bg-tertiary)]",
          "text-[var(--color-text-secondary)]",
          "hover:bg-[var(--color-bg-card)]",
          "hover:text-[var(--color-text-primary)]",
        ].join(" "),

        // Ghost - No background until hover
        ghost: [
          "bg-transparent",
          "text-[var(--color-text-secondary)]",
          "hover:bg-[var(--glass-bg)]",
          "hover:text-[var(--color-text-primary)]",
        ].join(" "),

        // Link - Text only with underline
        link: [
          "text-purple-400",
          "underline-offset-4",
          "hover:underline",
          "hover:text-purple-300",
        ].join(" "),

        // Destructive - Red/danger
        destructive: [
          "bg-red-500/10 border border-red-500/30",
          "text-red-400",
          "hover:bg-red-500/20",
          "hover:border-red-500/50",
        ].join(" "),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

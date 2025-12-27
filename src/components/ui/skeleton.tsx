"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Skeleton Component
 *
 * A cyberpunk-styled loading placeholder with shimmer animation.
 * Perfect for loading states while content is being fetched.
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton className="h-4 w-[200px]" />
 *
 * // Circle skeleton (for avatars)
 * <Skeleton variant="circular" className="size-12" />
 *
 * // Card skeleton
 * <Skeleton variant="card" />
 *
 * // Product card skeleton
 * <ProductCardSkeleton />
 * ```
 */

const skeletonVariants = cva(
  [
    "relative overflow-hidden",
    "bg-zinc-800/50",
    "rounded-md",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        circular: "rounded-full",
        card: "rounded-xl",
        text: "rounded-sm h-4",
        button: "rounded-lg h-10",
      },
      animation: {
        shimmer: "",
        pulse: "animate-pulse",
        wave: "",
        none: "",
      },
      glow: {
        purple: "",
        cyan: "",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "shimmer",
      glow: "purple",
    },
  }
);

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({
  className,
  variant = "default",
  animation = "shimmer",
  glow = "purple",
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant, animation, glow }), className)}
      {...props}
    >
      {/* Shimmer effect */}
      {animation === "shimmer" && (
        <div
          className="absolute inset-0"
          style={{
            background:
              glow === "cyan"
                ? "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent)"
                : glow === "purple"
                ? "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}

      {/* Wave effect */}
      {animation === "wave" && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.15) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "wave 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

// Predefined skeleton components for common use cases

// Text skeleton with multiple lines
interface TextSkeletonProps extends Omit<SkeletonProps, "variant"> {
  lines?: number;
  lastLineWidth?: string;
}

function TextSkeleton({
  lines = 3,
  lastLineWidth = "60%",
  className,
  ...props
}: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            i === lines - 1 ? `w-[${lastLineWidth}]` : "w-full"
          )}
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
          {...props}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
interface AvatarSkeletonProps extends Omit<SkeletonProps, "variant"> {
  size?: "sm" | "md" | "lg" | "xl";
}

function AvatarSkeleton({
  size = "md",
  className,
  ...props
}: AvatarSkeletonProps) {
  const sizeStyles = {
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
    xl: "size-16",
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeStyles[size], className)}
      {...props}
    />
  );
}

// Button skeleton
interface ButtonSkeletonProps extends Omit<SkeletonProps, "variant"> {
  size?: "sm" | "default" | "lg";
}

function ButtonSkeleton({
  size = "default",
  className,
  ...props
}: ButtonSkeletonProps) {
  const sizeStyles = {
    sm: "h-8 w-20",
    default: "h-10 w-28",
    lg: "h-12 w-36",
  };

  return (
    <Skeleton
      variant="button"
      className={cn(sizeStyles[size], className)}
      {...props}
    />
  );
}

// Card skeleton with image placeholder
function CardSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        "bg-[rgba(10,10,10,0.7)] border border-zinc-800/50",
        className
      )}
      {...props}
    >
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/3] rounded-none" glow="purple" />

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-24" glow="cyan" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

// Product card skeleton (specialized for VA-PC products)
function ProductCardSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        "bg-[rgba(10,10,10,0.7)] backdrop-blur-xl",
        "border border-[rgba(139,92,246,0.2)]",
        className
      )}
      {...props}
    >
      {/* Image placeholder */}
      <div className="relative aspect-[4/3]">
        <Skeleton className="absolute inset-0 rounded-none" glow="purple" />

        {/* Badges area */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" glow="cyan" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-4/5" />

        {/* Specs */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-28" glow="cyan" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
interface TableRowSkeletonProps extends Omit<SkeletonProps, "variant"> {
  columns?: number;
}

function TableRowSkeleton({
  columns = 4,
  className,
  ...props
}: TableRowSkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4 py-4", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === 0 ? "w-1/4" : i === columns - 1 ? "w-20" : "flex-1"
          )}
          {...props}
        />
      ))}
    </div>
  );
}

// Input skeleton
function InputSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-24" {...props} />
      <Skeleton className="h-10 w-full rounded-lg" {...props} />
    </div>
  );
}

// Header skeleton
function HeaderSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-4",
        className
      )}
      {...props}
    >
      {/* Logo */}
      <Skeleton className="h-10 w-32" glow="purple" />

      {/* Nav items */}
      <div className="hidden md:flex items-center gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  ProductCardSkeleton,
  TableRowSkeleton,
  InputSkeleton,
  HeaderSkeleton,
};

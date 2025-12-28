"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * VA-PC Card Component
 *
 * A cyberpunk-styled card with glassmorphism effect, gradient borders,
 * and glow shadow effects. Perfect for product cards and content containers.
 *
 * @example
 * ```tsx
 * <Card variant="glass" hoverEffect="glow">
 *   <CardHeader>
 *     <CardTitle>RTX 4090 Gaming PC</CardTitle>
 *     <CardDescription>Ultimate performance</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Specs here...</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Buy Now</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient-border" | "neon" | "solid";
  hoverEffect?: "none" | "lift" | "glow" | "border-glow" | "scale";
  glowColor?: "purple" | "magenta" | "multi";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "glass",
      hoverEffect = "glow",
      glowColor = "purple",
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = [
      "relative rounded-xl overflow-hidden",
      "transition-all duration-300 ease-out",
    ].join(" ");

    // Variant styles
    const variantStyles = {
      default: [
        "bg-[#0a0a0a]",
        "border border-zinc-800",
      ].join(" "),

      glass: [
        "bg-[rgba(10,10,10,0.7)]",
        "backdrop-blur-xl",
        "border border-[rgba(139,92,246,0.2)]",
      ].join(" "),

      "gradient-border": [
        "bg-[#0a0a0a]",
        "p-[1px]",
        "bg-gradient-to-br from-[#8B5CF6] via-[#06B6D4] to-[#8B5CF6]",
      ].join(" "),

      neon: [
        "bg-black",
        "border-2 border-[#8B5CF6]",
        "shadow-[0_0_15px_rgba(139,92,246,0.3),inset_0_0_15px_rgba(139,92,246,0.05)]",
      ].join(" "),

      solid: [
        "bg-zinc-900",
        "border border-zinc-700",
      ].join(" "),
    };

    // Hover effect styles
    const hoverStyles = {
      none: "",
      lift: "hover:-translate-y-1 hover:shadow-2xl",
      glow:
        glowColor === "magenta"
          ? "hover:shadow-[0_0_30px_rgba(6,182,212,0.3),0_0_60px_rgba(6,182,212,0.1)]"
          : glowColor === "multi"
          ? "hover:shadow-[0_0_30px_rgba(139,92,246,0.3),0_0_60px_rgba(6,182,212,0.2)]"
          : "hover:shadow-[0_0_30px_rgba(139,92,246,0.3),0_0_60px_rgba(139,92,246,0.1)]",
      "border-glow": [
        "hover:border-[#8B5CF6]/50",
        "hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]",
      ].join(" "),
      scale: "hover:scale-[1.02]",
    };

    // Combine lift and glow for better effect
    const combinedHoverStyles =
      hoverEffect === "glow"
        ? `${hoverStyles.glow} hover:-translate-y-1`
        : hoverStyles[hoverEffect];

    return (
      <div
        ref={ref}
        data-slot="card"
        data-variant={variant}
        className={cn(
          baseStyles,
          variantStyles[variant],
          combinedHoverStyles,
          className
        )}
        {...props}
      >
        {/* Gradient border inner content wrapper */}
        {variant === "gradient-border" ? (
          <div className="bg-[#0a0a0a] rounded-[11px] h-full">{children}</div>
        ) : (
          children
        )}

        {/* Gradient overlay for glass variant */}
        {variant === "glass" && (
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 50%, rgba(6, 182, 212, 0.05) 100%)",
            }}
          />
        )}
      </div>
    );
  }
);
Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 p-6",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        withBorder && "border-b border-zinc-800/50 pb-6",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  gradient?: boolean;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Tag = "h3", gradient = false, children, ...props }, ref) => (
    <Tag
      ref={ref}
      data-slot="card-title"
      className={cn(
        "text-xl font-bold tracking-wide font-orbitron",
        gradient
          ? "bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent"
          : "text-white",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-zinc-400 font-outfit", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-6 pt-0", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "flex items-center p-6 pt-0",
        withBorder && "border-t border-zinc-800/50 pt-6 mt-auto",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Card Action (for action buttons in header)
const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn("ml-auto", className)}
    {...props}
  />
));
CardAction.displayName = "CardAction";

// Product Card - Specialized card for PC products
interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: string;
  title: string;
  description?: string;
  price?: number | string;
  originalPrice?: number | string;
  badges?: React.ReactNode;
  inStock?: boolean;
  featured?: boolean;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      className,
      image,
      title,
      description,
      price,
      originalPrice,
      badges,
      inStock = true,
      featured = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        variant={featured ? "gradient-border" : "glass"}
        hoverEffect="glow"
        glowColor={featured ? "multi" : "purple"}
        className={cn("group cursor-pointer", className)}
        {...props}
      >
        {/* Image Container */}
        {image && (
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

            {/* Featured badge */}
            {featured && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white rounded-full shadow-lg">
                  Featured
                </span>
              </div>
            )}

            {/* Out of stock overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-zinc-400 font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Badges container */}
            {badges && (
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                {badges}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white font-orbitron mb-2 line-clamp-2 group-hover:text-[#A855F7] transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Price */}
          {price && (
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-white font-orbitron">
                {typeof price === "number"
                  ? new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                      minimumFractionDigits: 0,
                    }).format(price)
                  : price}
              </span>
              {originalPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {typeof originalPrice === "number"
                    ? new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        minimumFractionDigits: 0,
                      }).format(originalPrice)
                    : originalPrice}
                </span>
              )}
            </div>
          )}

          {/* Additional content */}
          {children}
        </div>
      </Card>
    );
  }
);
ProductCard.displayName = "ProductCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ProductCard,
};

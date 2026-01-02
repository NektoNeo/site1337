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

// Memoized style maps - defined outside component to avoid recreation
const baseStyles = [
  "relative rounded-xl overflow-hidden",
  "transition-all duration-300 ease-out",
].join(" ");

const variantStyles = {
  default: ["bg-[#0f0f12]", "border border-white/10"].join(" "),
  glass: [
    "bg-white/[0.02]",
    "backdrop-blur-md",
    "border border-white/[0.08]",
  ].join(" "),
  "gradient-border": ["bg-[#0f0f12]", "border border-white/12"].join(" "),
  neon: ["bg-[#0f0f12]", "border border-white/12"].join(" "),
  solid: ["bg-[#0f0f12]", "border border-white/10"].join(" "),
} as const;

const hoverStyles = {
  none: "",
  lift: "hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.55)]",
  glow: "hover:border-white/20 hover:shadow-[0_20px_45px_rgba(0,0,0,0.55)]",
  "border-glow": "hover:border-white/25",
  scale: "hover:scale-[1.01]",
} as const;

const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
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
          {children}
        </div>
      );
    }
  )
);
Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, withBorder = false, ...props }, ref) => (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 p-6",
          "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
          withBorder && "border-b border-white/5 pb-6",
          className
        )}
        {...props}
      />
    )
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  gradient?: boolean;
}

const CardTitle = React.memo(
  React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, as: Tag = "h3", gradient = false, children, ...props }, ref) => (
      <Tag
        ref={ref}
        data-slot="card-title"
        className={cn(
          "text-xl font-semibold tracking-tight",
          gradient ? "text-white" : "text-white",
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.memo(
  React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-white/60", className)}
      {...props}
    />
  ))
);
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn("p-6 pt-0", className)}
        {...props}
      />
    )
  )
);
CardContent.displayName = "CardContent";

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, withBorder = false, ...props }, ref) => (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          "flex items-center p-6 pt-0",
          withBorder && "border-t border-white/5 pt-6 mt-auto",
          className
        )}
        {...props}
      />
    )
  )
);
CardFooter.displayName = "CardFooter";

// Card Action (for action buttons in header)
const CardAction = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn("ml-auto", className)}
        {...props}
      />
    )
  )
);
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

// Memoized price formatter - created once, reused across all ProductCards
const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
});

const formatPrice = (value: number | string): string =>
  typeof value === "number" ? priceFormatter.format(value) : value;

const ProductCard = React.memo(
  React.forwardRef<HTMLDivElement, ProductCardProps>(
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
          variant="glass"
          hoverEffect="glow"
          className={cn("group cursor-pointer", className)}
          {...props}
        >
          {/* Image Container */}
          {image && (
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Featured badge */}
              {featured && (
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider border border-white/20 text-white rounded-full bg-black/50">
                    Рекомендовано
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
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {title}
            </h3>

            {description && (
              <p className="text-sm text-white/60 mb-4 line-clamp-2">
                {description}
              </p>
            )}

            {/* Price */}
            {price && (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-white">
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-white/40 line-through">
                    {formatPrice(originalPrice)}
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
  )
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

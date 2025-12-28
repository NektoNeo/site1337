"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Input Variants
 *
 * Cyberpunk/Neon styled input with glow focus effects.
 * Uses CSS variables from the design system for consistent theming.
 */
const inputVariants = cva(
  // Base styles using design tokens
  [
    "w-full rounded-lg",
    "bg-[var(--color-bg-primary)]",
    "border border-[var(--color-border-subtle)]",
    "px-4 py-2.5",
    "text-[var(--color-text-primary)] text-sm font-inter",
    "placeholder:text-[var(--color-text-muted)]",
    "transition-all duration-300 ease-out",
    "outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - Purple glow on focus
        default: [
          "focus:border-purple-500",
          "focus:ring-2 focus:ring-purple-500/20",
          "focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
          "hover:border-[var(--color-border-glow)]",
        ].join(" "),

        // Fuchsia - Fuchsia glow on focus
        fuchsia: [
          "focus:border-fuchsia-500",
          "focus:ring-2 focus:ring-fuchsia-500/20",
          "focus:shadow-[0_0_20px_rgba(217,70,239,0.15)]",
          "hover:border-fuchsia-500/30",
        ].join(" "),

        // Glass - Glassmorphism effect
        glass: [
          "bg-[var(--glass-bg)]",
          "backdrop-blur-md",
          "border-[var(--glass-border)]",
          "focus:border-purple-500/50",
          "focus:bg-[var(--color-bg-elevated)]",
          "focus:shadow-[0_0_20px_rgba(168,85,247,0.1)]",
          "hover:bg-[var(--color-bg-card)]",
        ].join(" "),

        // Neon - Intense neon glow
        neon: [
          "border-purple-500/30",
          "focus:border-purple-500",
          "focus:shadow-[0_0_10px_#a855f7,0_0_20px_rgba(168,85,247,0.3),inset_0_0_10px_rgba(168,85,247,0.1)]",
          "hover:border-purple-500/50",
        ].join(" "),

        // Neon Fuchsia
        "neon-fuchsia": [
          "border-fuchsia-500/30",
          "focus:border-fuchsia-500",
          "focus:shadow-[0_0_10px_#d946ef,0_0_20px_rgba(217,70,239,0.3),inset_0_0_10px_rgba(217,70,239,0.1)]",
          "hover:border-fuchsia-500/50",
        ].join(" "),

        // Gradient Border - Purple to Fuchsia
        gradient: [
          "border-transparent",
          "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20",
          "focus:from-purple-500/30 focus:to-fuchsia-500/30",
          "focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
        ].join(" "),

        // Error state
        error: [
          "border-red-500/50",
          "focus:border-red-500",
          "focus:ring-2 focus:ring-red-500/20",
          "focus:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
        ].join(" "),

        // Success state
        success: [
          "border-emerald-500/50",
          "focus:border-emerald-500",
          "focus:ring-2 focus:ring-emerald-500/20",
          "focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
        ].join(" "),
      },
      inputSize: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      fullWidth: true,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  success?: string;
  hint?: string;
  label?: string;
  required?: boolean;
}

/**
 * VA-PC Input Component
 *
 * A cyberpunk-styled input with glow focus effects and multiple variants.
 *
 * @example
 * ```tsx
 * // Default input with purple glow
 * <Input placeholder="Enter your email" />
 *
 * // Magenta variant
 * <Input variant="magenta" placeholder="Search..." />
 *
 * // With label and icon
 * <Input
 *   label="Email Address"
 *   leftIcon={<MailIcon />}
 *   placeholder="you@example.com"
 * />
 *
 * // Neon effect
 * <Input variant="neon" placeholder="Username" />
 *
 * // With error state
 * <Input variant="error" error="This field is required" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "default",
      inputSize = "default",
      fullWidth = true,
      leftIcon,
      rightIcon,
      error,
      success,
      hint,
      label,
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    // Determine variant based on error/success states
    const computedVariant = error ? "error" : success ? "success" : variant;

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block mb-2 text-sm font-medium text-zinc-300 font-inter",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && <span className="ml-1 text-purple-500">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            data-slot="input"
            data-variant={computedVariant}
            data-size={inputSize}
            className={cn(
              inputVariants({
                variant: computedVariant,
                inputSize,
                fullWidth,
                className,
              }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              // shadcn v4 focus-visible pattern
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              // aria-invalid styling
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
              {rightIcon}
            </div>
          )}

          {/* Focus glow effect (additional visual) */}
          <div
            className={cn(
              "absolute inset-0 rounded-lg pointer-events-none opacity-0",
              "transition-opacity duration-300",
              "peer-focus:opacity-100"
            )}
            style={{
              background:
                computedVariant === "error"
                  ? "radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)"
                  : computedVariant === "success"
                  ? "radial-gradient(circle at center, rgba(16,185,129,0.1) 0%, transparent 70%)"
                  : computedVariant === "fuchsia" || computedVariant === "neon-fuchsia"
                  ? "radial-gradient(circle at center, rgba(217,70,239,0.1) 0%, transparent 70%)"
                  : "radial-gradient(circle at center, rgba(168,85,247,0.1) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-xs text-red-400 flex items-center gap-1"
          >
            <svg
              className="size-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Success message */}
        {success && !error && (
          <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <svg
              className="size-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </p>
        )}

        {/* Hint text */}
        {hint && !error && !success && (
          <p
            id={`${inputId}-hint`}
            className="mt-2 text-xs text-zinc-500"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Search Input - Specialized input for search functionality
interface SearchInputProps extends Omit<InputProps, "leftIcon" | "type"> {
  onSearch?: (value: string) => void;
  loading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, loading, className, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(value);
      }
    };

    return (
      <div data-slot="search-input">
        <Input
          ref={ref}
          type="search"
          variant="glass"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={className}
        leftIcon={
          loading ? (
            <svg
              className="animate-spin size-4"
              viewBox="0 0 24 24"
              fill="none"
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
          ) : (
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          )
        }
        rightIcon={
          value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                onSearch?.("");
              }}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer pointer-events-auto"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )
        }
        {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { Input, inputVariants, SearchInput };

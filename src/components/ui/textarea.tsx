"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Textarea Variants
 *
 * Cyberpunk/Neon styled textarea with glow focus effects.
 * Uses CSS variables from the design system for consistent theming.
 */
const textareaVariants = cva(
  // Base styles using design tokens
  [
    "w-full rounded-lg",
    "bg-[var(--color-bg-primary)]",
    "border border-[var(--color-border-subtle)]",
    "px-4 py-3",
    "text-[var(--color-text-primary)] text-sm font-inter",
    "placeholder:text-[var(--color-text-muted)]",
    "transition-all duration-300 ease-out",
    "outline-none",
    "resize-y min-h-[100px]",
    "disabled:cursor-not-allowed disabled:opacity-50",
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
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      resize: "vertical",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string;
  success?: string;
  hint?: string;
  label?: string;
  required?: boolean;
  /** Character count display */
  showCount?: boolean;
  maxLength?: number;
}

/**
 * VA-PC Textarea Component
 *
 * A cyberpunk-styled textarea with glow focus effects and multiple variants.
 *
 * @example
 * ```tsx
 * // Default textarea with purple glow
 * <Textarea placeholder="Enter your message..." />
 *
 * // Glass variant with label
 * <Textarea
 *   variant="glass"
 *   label="Message"
 *   placeholder="Type your message..."
 * />
 *
 * // With character count
 * <Textarea
 *   showCount
 *   maxLength={500}
 *   placeholder="Limited to 500 characters"
 * />
 *
 * // With error state
 * <Textarea variant="error" error="This field is required" />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      resize = "vertical",
      error,
      success,
      hint,
      label,
      required,
      showCount,
      maxLength,
      disabled,
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const [charCount, setCharCount] = React.useState(
      String(value || defaultValue || "").length
    );

    // Determine variant based on error/success states
    const computedVariant = error ? "error" : success ? "success" : variant;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block mb-2 text-sm font-medium text-zinc-300 font-inter",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && <span className="ml-1 text-purple-500">*</span>}
          </label>
        )}

        {/* Textarea wrapper */}
        <div className="relative">
          {/* Textarea element */}
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            maxLength={maxLength}
            data-slot="textarea"
            data-variant={computedVariant}
            className={cn(
              textareaVariants({
                variant: computedVariant,
                resize,
                className,
              }),
              // shadcn v4 focus-visible pattern
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              // aria-invalid styling
              "aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : hint
                ? `${textareaId}-hint`
                : undefined
            }
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            {...props}
          />

          {/* Character count */}
          {showCount && (
            <div
              className={cn(
                "absolute bottom-2 right-3 text-xs font-inter",
                maxLength && charCount >= maxLength
                  ? "text-red-400"
                  : charCount >= (maxLength || 0) * 0.9
                  ? "text-amber-400"
                  : "text-zinc-500"
              )}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-2 text-xs text-red-400 flex items-center gap-1"
          >
            <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
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
            <svg className="size-3" viewBox="0 0 20 20" fill="currentColor">
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
          <p id={`${textareaId}-hint`} className="mt-2 text-xs text-zinc-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };

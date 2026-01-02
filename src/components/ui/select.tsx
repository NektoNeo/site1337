"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * VA-PC Select Component
 *
 * A cyberpunk-styled select dropdown with dark theme and magenta/purple focus effects.
 *
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select a GPU" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="rtx4090">RTX 4090</SelectItem>
 *     <SelectItem value="rtx4080">RTX 4080</SelectItem>
 *     <SelectItem value="rtx4070">RTX 4070 Ti</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */

const Select = React.memo(function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
});

const SelectGroup = React.memo(function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
});

const SelectValue = React.memo(function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
});

interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  variant?: "default" | "fuchsia" | "glass" | "neon" | "neon-fuchsia";
  size?: "sm" | "default" | "lg";
}

// Static variant styles - defined outside component
const triggerVariantStyles = {
  default: [
    "bg-[var(--color-bg-primary)]",
    "border-[var(--color-border-subtle)]",
    "hover:border-[var(--color-border-glow)]",
    "focus:border-purple-500",
    "focus:ring-2 focus:ring-purple-500/20",
    "focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    "data-[state=open]:border-purple-500",
    "data-[state=open]:ring-2 data-[state=open]:ring-purple-500/20",
  ].join(" "),
  fuchsia: [
    "bg-[var(--color-bg-primary)]",
    "border-[var(--color-border-subtle)]",
    "hover:border-fuchsia-500/30",
    "focus:border-fuchsia-500",
    "focus:ring-2 focus:ring-fuchsia-500/20",
    "focus:shadow-[0_0_20px_rgba(217,70,239,0.15)]",
    "data-[state=open]:border-fuchsia-500",
    "data-[state=open]:ring-2 data-[state=open]:ring-fuchsia-500/20",
  ].join(" "),
  glass: [
    "bg-[var(--glass-bg)]",
    "backdrop-blur-md",
    "border-[var(--glass-border)]",
    "hover:bg-[var(--color-bg-card)]",
    "focus:border-purple-500/50",
    "focus:bg-[var(--color-bg-elevated)]",
    "data-[state=open]:bg-[var(--color-bg-elevated)]",
  ].join(" "),
  neon: [
    "bg-black",
    "border-purple-500/30",
    "hover:border-purple-500/50",
    "focus:border-purple-500",
    "focus:shadow-[0_0_10px_#a855f7,0_0_20px_rgba(168,85,247,0.3)]",
    "data-[state=open]:border-purple-500",
    "data-[state=open]:shadow-[0_0_10px_#a855f7,0_0_20px_rgba(168,85,247,0.3)]",
  ].join(" "),
  "neon-fuchsia": [
    "bg-black",
    "border-fuchsia-500/30",
    "hover:border-fuchsia-500/50",
    "focus:border-fuchsia-500",
    "focus:shadow-[0_0_10px_#d946ef,0_0_20px_rgba(217,70,239,0.3)]",
    "data-[state=open]:border-fuchsia-500",
    "data-[state=open]:shadow-[0_0_10px_#d946ef,0_0_20px_rgba(217,70,239,0.3)]",
  ].join(" "),
} as const;

const triggerSizeStyles = {
  sm: "h-8 px-3 text-xs",
  default: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
} as const;

const triggerBaseClasses = [
  "flex w-full items-center justify-between gap-2",
  "rounded-lg border",
  "text-white font-inter",
  "transition-all duration-300 ease-out",
  "outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[placeholder]:text-zinc-500",
  "[&_svg:not([class*='text-'])]:text-zinc-500",
].join(" ");

const SelectTrigger = React.memo(function SelectTrigger({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        triggerBaseClasses,
        triggerSizeStyles[size],
        triggerVariantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

// Static content styles
const contentBaseClasses = [
  // Base styles
  "relative z-50 overflow-hidden",
  "rounded-lg border border-zinc-800",
  "bg-[var(--color-bg-primary)]/95 backdrop-blur-xl",
  "text-[var(--color-text-primary)]",
  "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_30px_rgba(168,85,247,0.1)]",
  // Animation
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
].join(" ");

const contentPopperClasses = "max-h-[--radix-select-content-available-height] w-[var(--radix-select-trigger-width)]";
const viewportPopperClasses = "w-full min-w-[var(--radix-select-trigger-width)]";

const gradientGlowStyle = {
  background:
    "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, transparent 50%, rgba(168, 85, 247, 0.05) 100%)",
} as const;

const SelectContent = React.memo(function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          contentBaseClasses,
          position === "popper" && contentPopperClasses,
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn("p-1", position === "popper" && viewportPopperClasses)}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />

        {/* Gradient border glow effect */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-50"
          style={gradientGlowStyle}
        />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

// Static label classes
const labelClasses = [
  "px-2 py-1.5 text-xs font-semibold uppercase tracking-wider",
  "text-zinc-500 font-inter",
].join(" ");

const SelectLabel = React.memo(function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(labelClasses, className)}
      {...props}
    />
  );
});

// Static item classes - critical for performance with many items
const itemClasses = [
  // Base styles
  "relative flex w-full cursor-pointer select-none items-center gap-2",
  "rounded-md py-2 px-8 text-sm",
  "font-inter text-zinc-300",
  "outline-none transition-colors duration-150",
  // Hover and focus states
  "hover:bg-purple-500/10 hover:text-white",
  "focus:bg-purple-500/10 focus:text-white",
  // Selected state
  "data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-400",
  // Disabled state
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
].join(" ");

const SelectItem = React.memo(function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(itemClasses, className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-purple-500" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

const separatorClasses = "my-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent";

const SelectSeparator = React.memo(function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(separatorClasses, className)}
      {...props}
    />
  );
});

// Static scroll button classes
const scrollButtonClasses = [
  "flex cursor-default items-center justify-center py-1",
  "text-zinc-500 hover:text-white transition-colors",
].join(" ");

const SelectScrollUpButton = React.memo(function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(scrollButtonClasses, className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});

const SelectScrollDownButton = React.memo(function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(scrollButtonClasses, className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

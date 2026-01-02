"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Dialog Component
 *
 * A cyberpunk-styled modal dialog with glassmorphism effects and neon glow.
 * Perfect for confirmations, forms, and important interactions.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Confirm Purchase</DialogTitle>
 *       <DialogDescription>
 *         Are you sure you want to complete this purchase?
 *       </DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <Button variant="outline">Cancel</Button>
 *       <Button>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */

const Dialog = React.memo(function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
});

const DialogTrigger = React.memo(function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
});

const DialogPortal = React.memo(function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
});

const DialogClose = React.memo(function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
});

// Static overlay classes
const overlayClasses = [
  "fixed inset-0 z-50",
  "bg-black/70 backdrop-blur-sm",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
].join(" ");

const DialogOverlay = React.memo(function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(overlayClasses, className)}
      {...props}
    />
  );
});

const dialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-50",
    "-translate-x-1/2 -translate-y-1/2",
    "w-full max-w-lg",
    // Glass effect
    "bg-[#0a0a0a]/95 backdrop-blur-xl",
    "border border-zinc-800",
    "rounded-xl",
    // Shadow
    "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
    // Grid layout
    "grid gap-4 p-6",
    // Animation
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    "duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
          "border-zinc-800",
        ].join(" "),
        neon: [
          "border-[#8B5CF6]/50",
          "shadow-[0_0_30px_rgba(139,92,246,0.3),inset_0_0_20px_rgba(139,92,246,0.05)]",
        ].join(" "),
        magenta: [
          "border-[#8B5CF6]/30",
          "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
        ].join(" "),
        danger: [
          "border-red-500/30",
          "shadow-[0_0_30px_rgba(239,68,68,0.2)]",
        ].join(" "),
      },
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  showCloseButton?: boolean;
}

// Static styles extracted for performance
const gradientOverlayStyle = {
  background:
    "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 50%, rgba(139, 92, 246, 0.05) 100%)",
} as const;

const closeButtonClasses = [
  "absolute top-4 right-4",
  "size-8 rounded-lg",
  "flex items-center justify-center",
  "bg-zinc-800/50 border border-zinc-700",
  "text-zinc-400 hover:text-white",
  "transition-all duration-200",
  "hover:bg-zinc-700/50 hover:border-[#8B5CF6]/30",
  "hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]",
  "focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
].join(" ");

const DialogContent = React.memo(function DialogContent({
  className,
  children,
  variant = "default",
  size = "default",
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ variant, size }), className)}
        {...props}
      >
        {/* Gradient overlay effect */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-50"
          style={gradientOverlayStyle}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Close button */}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={closeButtonClasses}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

const DialogHeader = React.memo(function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
});

const dialogFooterClasses = [
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  "pt-4 mt-2 border-t border-zinc-800/50",
].join(" ");

const DialogFooter = React.memo(function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFooterClasses, className)}
      {...props}
    />
  );
});

const DialogTitle = React.memo(function DialogTitle({
  className,
  gradient = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title> & {
  gradient?: boolean;
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-xl font-bold leading-none font-orbitron tracking-wide",
        gradient
          ? "bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6] bg-clip-text text-transparent"
          : "text-white",
        className
      )}
      {...props}
    />
  );
});

const DialogDescription = React.memo(function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-zinc-400 font-inter", className)}
      {...props}
    />
  );
});

// Alert Dialog - For confirmations and warnings
interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
  children?: React.ReactNode;
}

// Static button styles
const alertCancelButtonClasses = [
  "px-4 py-2 rounded-lg text-sm font-medium",
  "bg-zinc-800 text-zinc-300",
  "border border-zinc-700",
  "hover:bg-zinc-700 hover:text-white",
  "transition-all duration-200",
].join(" ");

const alertConfirmButtonBase = [
  "px-4 py-2 rounded-lg text-sm font-medium text-white",
  "transition-all duration-200",
].join(" ");

const alertConfirmButtonVariants = {
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  default:
    "bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#C084FC] shadow-[0_0_15px_rgba(139,92,246,0.3)]",
} as const;

const AlertDialog = React.memo(function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  children,
}: AlertDialogProps) {
  const handleCancel = React.useCallback(() => {
    onCancel?.();
    onOpenChange?.(false);
  }, [onCancel, onOpenChange]);

  const handleConfirm = React.useCallback(() => {
    onConfirm?.();
    onOpenChange?.(false);
  }, [onConfirm, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        variant={variant === "danger" ? "danger" : "default"}
        size="sm"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <button onClick={handleCancel} className={alertCancelButtonClasses}>
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              alertConfirmButtonBase,
              alertConfirmButtonVariants[variant]
            )}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
};

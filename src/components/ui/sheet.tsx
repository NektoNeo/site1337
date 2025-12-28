"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * VA-PC Sheet Component
 *
 * A cyberpunk-styled slide-out panel with glassmorphism effects.
 * Perfect for cart drawers, mobile navigation, and side panels.
 *
 * @example
 * ```tsx
 * <Sheet>
 *   <SheetTrigger asChild>
 *     <Button variant="outline">Open Cart</Button>
 *   </SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Shopping Cart</SheetTitle>
 *       <SheetDescription>Review your items</SheetDescription>
 *     </SheetHeader>
 *     <div>Cart items here...</div>
 *     <SheetFooter>
 *       <Button>Checkout</Button>
 *     </SheetFooter>
 *   </SheetContent>
 * </Sheet>
 * ```
 */

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/60 backdrop-blur-sm",
        // Animation
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

const sheetContentVariants = cva(
  [
    "fixed z-50 flex flex-col",
    // Glass effect background
    "bg-[#0a0a0a]/95 backdrop-blur-xl",
    "border-zinc-800",
    // Shadow and glow
    "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
    // Transition
    "transition-all ease-in-out",
    "data-[state=closed]:duration-300 data-[state=open]:duration-500",
  ].join(" "),
  {
    variants: {
      side: {
        right: [
          "inset-y-0 right-0 h-full w-3/4 max-w-md border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ].join(" "),
        left: [
          "inset-y-0 left-0 h-full w-3/4 max-w-md border-r",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ].join(" "),
        top: [
          "inset-x-0 top-0 h-auto max-h-[80vh] border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0 h-auto max-h-[80vh] border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ].join(" "),
      },
      glowColor: {
        purple: "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
        magenta: "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
        none: "",
      },
    },
    defaultVariants: {
      side: "right",
      glowColor: "purple",
    },
  }
);

interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  showCloseButton?: boolean;
}

function SheetContent({
  className,
  children,
  side = "right",
  glowColor = "purple",
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          sheetContentVariants({ side, glowColor }),
          // Animation classes
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        {...props}
      >
        {/* Gradient overlay effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              side === "right" || side === "left"
                ? "linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 20%, transparent 80%, rgba(139, 92, 246, 0.05) 100%)"
                : "linear-gradient(90deg, rgba(139, 92, 246, 0.05) 0%, transparent 20%, transparent 80%, rgba(139, 92, 246, 0.05) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {children}
        </div>

        {/* Close button */}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "absolute top-4 right-4 z-20",
              "size-8 rounded-lg",
              "flex items-center justify-center",
              "bg-zinc-800/50 border border-zinc-700",
              "text-zinc-400 hover:text-white",
              "transition-all duration-200",
              "hover:bg-zinc-700/50 hover:border-[#8B5CF6]/30",
              "hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]",
              "focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50"
            )}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-2 p-6",
        "border-b border-zinc-800/50",
        className
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-3 p-6",
        "border-t border-zinc-800/50",
        "bg-[#0a0a0a]/50",
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "text-xl font-bold text-white font-orbitron tracking-wide",
        className
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-zinc-400 font-inter", className)}
      {...props}
    />
  );
}

// Cart Sheet - Specialized sheet for shopping cart
interface CartSheetProps extends React.ComponentProps<typeof Sheet> {
  cartCount?: number;
}

function CartSheet({ cartCount = 0, children, ...props }: CartSheetProps) {
  return (
    <Sheet {...props}>
      {children}
    </Sheet>
  );
}

function CartSheetContent({
  className,
  children,
  ...props
}: Omit<SheetContentProps, "side" | "glowColor">) {
  return (
    <SheetContent
      side="right"
      glowColor="magenta"
      className={cn("w-full sm:max-w-lg", className)}
      {...props}
    >
      {children}
    </SheetContent>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  CartSheet,
  CartSheetContent,
};

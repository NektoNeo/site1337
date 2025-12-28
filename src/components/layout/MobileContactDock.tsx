"use client";

import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

// Environment variables for CTA links
const TG_URL = process.env.NEXT_PUBLIC_TG_URL || "https://t.me/vapc_support";
const WA_URL = process.env.NEXT_PUBLIC_WA_URL || "https://wa.me/79999999999";
const PHONE = process.env.NEXT_PUBLIC_PHONE || "+74951234567";

// Telegram Icon
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

// WhatsApp Icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

interface DockButtonProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "default" | "primary" | "green";
}

function DockButton({ href, icon: Icon, label, variant = "default" }: DockButtonProps) {
  const variants = {
    default: "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10",
    primary: "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10",
    green: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
  };

  return (
    <a
      href={href}
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"}
      className={cn(
        "flex flex-col items-center justify-center gap-1 flex-1",
        "py-2.5 px-3 rounded-xl",
        "transition-all duration-200",
        "active:scale-95",
        variants[variant]
      )}
      aria-label={label}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
        {label}
      </span>
    </a>
  );
}

interface MobileContactDockProps {
  className?: string;
}

/**
 * MobileContactDock Component
 *
 * Sticky dock at the bottom of mobile screens for quick contact actions.
 * Only visible on mobile (< lg breakpoint).
 * Uses glass effect for premium look.
 *
 * Important: Add pb-20 or pb-24 to main content to prevent overlap.
 */
export function MobileContactDock({ className }: MobileContactDockProps) {
  return (
    <div
      className={cn(
        // Positioning
        "fixed bottom-0 left-0 right-0 z-40",
        // Only show on mobile
        "lg:hidden",
        // Glass effect
        "bg-void-dark/90 backdrop-blur-xl",
        // Border
        "border-t border-purple-500/20",
        // Safe area for iPhone notch
        "pb-[env(safe-area-inset-bottom,0px)]",
        className
      )}
    >
      {/* Gradient glow on top edge */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Dock content */}
      <div className="flex items-center justify-around px-4 py-2">
        <DockButton
          href={TG_URL}
          icon={TelegramIcon}
          label="Telegram"
          variant="primary"
        />

        <DockButton
          href={WA_URL}
          icon={WhatsAppIcon}
          label="WhatsApp"
          variant="green"
        />

        <DockButton
          href={`tel:${PHONE.replace(/\D/g, '')}`}
          icon={Phone}
          label="Позвонить"
          variant="default"
        />
      </div>
    </div>
  );
}

export default MobileContactDock;

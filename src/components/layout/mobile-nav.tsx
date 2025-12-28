"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

// Environment variables for CTA links
const TG_URL = process.env.NEXT_PUBLIC_TG_URL || "https://t.me/vapc_support";
const WA_URL = process.env.NEXT_PUBLIC_WA_URL || "https://wa.me/79999999999";
const PHONE = process.env.NEXT_PUBLIC_PHONE || "+74951234567";
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || "+7 (495) 123-45-67";

// Animated background grid pattern
function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#a855f7"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Glowing orbs */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl" />
    </div>
  );
}

// Navigation link with stagger animation
function MobileNavLink({
  href,
  label,
  index,
  onClose,
}: NavLink & { index: number; onClose: () => void }) {
  // Handle hash links with smooth scroll
  const isHashLink = href.startsWith('/#');
  const handleClick = (e: React.MouseEvent) => {
    if (isHashLink) {
      e.preventDefault();
      onClose(); // Close mobile nav first
      // Small delay to allow nav to close before scrolling
      setTimeout(() => {
        const targetId = href.slice(2);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', href);
        }
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{
        delay: index * 0.1,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link
        href={href}
        scroll={!isHashLink}
        onClick={handleClick}
        className={cn(
          "group flex items-center justify-between py-4 px-2",
          "border-b border-purple-500/10",
          "transition-all duration-300",
          "hover:bg-purple-500/5 hover:px-4"
        )}
      >
        <span className="font-inter text-xl font-semibold text-white/90 uppercase tracking-wider group-hover:text-purple-400 transition-colors">
          {label}
        </span>
        <ChevronRight className="w-5 h-5 text-purple-500/50 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}

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

// Quick CTA Button
function QuickCTAButton({
  href,
  icon: Icon,
  label,
  variant = "default",
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "default" | "primary" | "green";
}) {
  const variants = {
    default: "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40",
    primary: "bg-gradient-to-r from-purple-600 to-purple-500 border-transparent text-white hover:shadow-uv-md",
    green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40",
  };

  return (
    <a
      href={href}
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel={href.startsWith("tel:") ? undefined : "noopener noreferrer"}
      className={cn(
        "flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
        "border font-semibold text-sm",
        "transition-all duration-300",
        variants[variant]
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </a>
  );
}

export function MobileNav({ isOpen, onClose, navLinks }: MobileNavProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-void-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className={cn(
              "fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden",
              "bg-void-dark border-l border-purple-500/20",
              "flex flex-col overflow-hidden"
            )}
          >
            <GridPattern />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative flex items-center justify-between p-4 border-b border-purple-500/10"
            >
              <Logo size="sm" />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
                aria-label="Закрыть меню"
              >
                <X className="w-6 h-6 text-white/80" />
              </button>
            </motion.div>

            {/* Navigation Links */}
            <nav className="relative flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <MobileNavLink
                    key={link.href}
                    {...link}
                    index={index}
                    onClose={onClose}
                  />
                ))}
              </div>

              {/* Quick CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 space-y-3"
              >
                <p className="text-xs font-mono text-purple-500/50 uppercase tracking-wider mb-3">
                  Связаться с нами
                </p>

                {/* Primary CTA - Telegram */}
                <QuickCTAButton
                  href={TG_URL}
                  icon={TelegramIcon}
                  label="Написать в Telegram"
                  variant="primary"
                />

                {/* Secondary CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <QuickCTAButton
                    href={WA_URL}
                    icon={WhatsAppIcon}
                    label="WhatsApp"
                    variant="green"
                  />
                  <QuickCTAButton
                    href={`tel:${PHONE.replace(/\D/g, '')}`}
                    icon={Phone}
                    label="Позвонить"
                    variant="default"
                  />
                </div>
              </motion.div>
            </nav>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative p-4 border-t border-purple-500/10 bg-void-black/50"
            >
              {/* Work hours */}
              <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10 mb-3">
                <p className="text-xs font-mono text-purple-500/60 uppercase tracking-wider mb-1">
                  Режим работы
                </p>
                <p className="text-sm text-white/80 font-medium">
                  Ежедневно с 11:00 до 21:00
                </p>
              </div>

              {/* Phone number */}
              <a
                href={`tel:${PHONE.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-purple-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{PHONE_DISPLAY}</span>
              </a>
            </motion.div>

            {/* Decorative edge glow */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-fuchsia-500/30 to-purple-500/50" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;

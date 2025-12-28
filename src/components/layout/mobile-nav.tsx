"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

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
              stroke="#8B5CF6"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Glowing orbs */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-60 h-60 bg-neon-magenta/10 rounded-full blur-3xl" />
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
        onClick={onClose}
        className={cn(
          "group flex items-center justify-between py-4 px-2",
          "border-b border-neon-purple/10",
          "transition-all duration-300",
          "hover:bg-neon-purple/5 hover:px-4"
        )}
      >
        <span className="font-display text-xl font-semibold text-white/90 uppercase tracking-wider group-hover:text-neon-purple transition-colors">
          {label}
        </span>
        <ChevronRight className="w-5 h-5 text-neon-purple/50 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}

// Contact info item
function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 py-2">
      <div className="p-2 rounded-lg bg-neon-purple/10">
        <Icon className="w-4 h-4 text-neon-purple" />
      </div>
      <div>
        <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-white/80 font-body">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
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
              "bg-void-dark border-l border-neon-purple/20",
              "flex flex-col overflow-hidden"
            )}
          >
            <GridPattern />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative flex items-center justify-between p-4 border-b border-neon-purple/10"
            >
              <div className="flex items-center gap-2">
                {/* Mini Logo */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4L36 34H4L20 4Z"
                    stroke="url(#mobileLogoGradient)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M14 24L20 12L26 24"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="20" cy="28" r="2" fill="#06B6D4" />
                  <defs>
                    <linearGradient
                      id="mobileLogoGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-display text-lg font-bold text-white tracking-wider">
                  VA-PC
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neon-purple/10 transition-colors"
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

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Link
                  href="/configurator"
                  onClick={onClose}
                  className={cn(
                    "block w-full py-4 px-6",
                    "bg-gradient-to-r from-neon-purple to-neon-purple-dark",
                    "text-center font-display font-bold text-white uppercase tracking-wider",
                    "rounded-xl",
                    "shadow-neon-purple-sm hover:shadow-neon-purple",
                    "transition-all duration-300 hover:scale-[1.02]"
                  )}
                >
                  Собрать ПК
                </Link>
              </motion.div>
            </nav>

            {/* Footer with contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative p-4 border-t border-neon-purple/10 bg-void-black/50"
            >
              <p className="text-xs font-mono text-neon-magenta/50 uppercase tracking-wider mb-3">
                Контакты
              </p>
              <div className="space-y-1">
                <ContactItem
                  icon={Phone}
                  label="Телефон"
                  value="+7 (495) 123-45-67"
                  href="tel:+74951234567"
                />
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value="info@va-pc.ru"
                  href="mailto:info@va-pc.ru"
                />
                <ContactItem
                  icon={MapPin}
                  label="Адрес"
                  value="Москва, ул. Примерная, 123"
                />
              </div>

              {/* Social links */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-neon-purple/10">
                {["VK", "TG", "WA"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className={cn(
                      "w-10 h-10 flex items-center justify-center",
                      "rounded-lg border border-neon-purple/20",
                      "text-xs font-mono font-bold text-white/60",
                      "hover:bg-neon-purple/10 hover:border-neon-purple/40 hover:text-neon-purple",
                      "transition-all duration-300"
                    )}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Decorative edge glow */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-neon-purple/50 via-neon-magenta/30 to-neon-purple/50" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileNav;

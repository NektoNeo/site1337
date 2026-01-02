"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Logo } from "@/components/ui/Logo";

// Navigation configuration
const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/configurator", label: "Конфигуратор" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

// Navigation Link with magnetic hover effect
function NavLink({ href, label, isActive }: { href: string; label: string; isActive?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        ref={ref}
        href={href}
        className={cn(
          "relative px-4 py-2 font-inter text-sm font-semibold uppercase tracking-wider transition-all duration-300 block",
          "hover:text-neon-purple",
          isActive ? "text-neon-purple" : "text-white/80"
        )}
      >
        <span className="relative z-10">{label}</span>

        {/* Glow background on hover */}
        <motion.span
          className="absolute inset-0 rounded-lg bg-neon-purple/0 -z-10"
          whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
          transition={{ duration: 0.2 }}
        />

        {/* Animated underline */}
        <motion.span
          className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-neon-purple via-neon-purple to-neon-purple"
          initial={{ width: isActive ? "80%" : "0%", x: "-50%" }}
          whileHover={{ width: "80%", x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Corner accents on hover */}
        <motion.span
          className="absolute top-0 left-0 w-2 h-2 border-l border-t border-neon-purple/0 rounded-tl"
          whileHover={{ borderColor: "rgba(139, 92, 246, 0.5)" }}
        />
        <motion.span
          className="absolute top-0 right-0 w-2 h-2 border-r border-t border-neon-purple/0 rounded-tr"
          whileHover={{ borderColor: "rgba(255, 30, 142, 0.5)" }}
        />
        <motion.span
          className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-neon-cyan/0 rounded-bl"
          whileHover={{ borderColor: "rgba(6, 182, 212, 0.5)" }}
        />
        <motion.span
          className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-neon-purple/0 rounded-br"
          whileHover={{ borderColor: "rgba(139, 92, 246, 0.5)" }}
        />
      </Link>
    </motion.div>
  );
}

// Cart Button with glowing badge
function CartButton({ itemCount = 0 }: { itemCount?: number }) {
  return (
    <button
      className="relative p-2 rounded-lg transition-all duration-300 hover:bg-neon-purple/10 group"
      aria-label={`Корзина: ${itemCount} товаров`}
    >
      <ShoppingCart className="w-6 h-6 text-white/80 group-hover:text-neon-purple transition-colors duration-300" />
      
      {/* Animated Badge */}
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5",
            "flex items-center justify-center",
            "bg-gradient-to-r from-neon-purple to-neon-cyan",
            "text-[11px] font-bold text-white rounded-full",
            "badge-pulse"
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </motion.span>
      )}
    </button>
  );
}

// Search Button
function SearchButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-neon-purple/10 group"
      aria-label="Поиск"
    >
      <Search className="w-6 h-6 text-white/80 group-hover:text-neon-cyan transition-colors duration-300" />
    </button>
  );
}

// Search Modal
function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
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
            className="fixed inset-0 bg-void-black/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="glass-card p-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-purple" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск игровых ПК, комплектующих..."
                  autoFocus
                  className={cn(
                    "w-full pl-12 pr-12 py-4 bg-transparent",
                    "text-white placeholder:text-white/40",
                    "font-body text-lg",
                    "border-none outline-none",
                    "focus:ring-0"
                  )}
                />
                <button
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              {/* Quick Links */}
              <div className="px-4 py-3 border-t border-glass-border">
                <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
                  Популярные запросы
                </p>
                <div className="flex flex-wrap gap-2">
                  {["RTX 4090", "Gaming PC", "Workstation", "Streaming"].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 text-sm font-display text-neon-cyan/80 border border-neon-cyan/20 rounded-full hover:bg-neon-cyan/10 hover:border-neon-cyan/40 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Main Header Component
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemCount] = useState(3); // Demo cart count
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll-based header shrink effect
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(10, 10, 15, 0.7)", "rgba(10, 10, 15, 0.95)"]
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0.3, 0.8]);
  const blurAmount = useTransform(scrollY, [0, 100], [12, 20]);

  // Track scroll position for RGB border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        style={{
          height: headerHeight,
          backgroundColor: headerBg,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "backdrop-blur-xl",
          "transition-all duration-500"
        )}
      >
        {/* RGB Animated border on scroll */}
        <motion.div
          className="absolute inset-0 rounded-none pointer-events-none"
          style={{
            background: isScrolled
              ? "linear-gradient(90deg, transparent, rgba(139,92,246,0.1) 20%, rgba(6,182,212,0.1) 80%, transparent)"
              : "transparent",
          }}
          animate={{
            opacity: isScrolled ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Top edge glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />

        <div className="container mx-auto h-full px-4 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Primary CTA - Messenger (desktop only) */}
              <a
                href="https://t.me/vapc_support?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%9F%D0%9A"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-purple text-white text-sm font-semibold transition-all duration-300 hover:shadow-neon-purple hover:scale-105"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Написать
              </a>
              
              {/* Search Button */}
              <SearchButton onClick={() => setIsSearchOpen(true)} />

              {/* Cart Button */}
              <CartButton itemCount={cartItemCount} />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-all duration-300 hover:bg-neon-purple/10"
                aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMobileMenuOpen}
              >
                <motion.div
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  className="w-6 h-6 flex flex-col justify-center items-center"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    className="w-5 h-0.5 bg-white block mb-1.5 origin-center transition-colors"
                    style={{ marginBottom: isMobileMenuOpen ? 0 : 6 }}
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    className="w-5 h-0.5 bg-white block mb-1.5"
                    style={{ marginBottom: isMobileMenuOpen ? 0 : 6 }}
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    className="w-5 h-0.5 bg-white block origin-center"
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Animated RGB bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden"
          style={{ opacity: borderOpacity }}
        >
          <motion.div
            className="h-full w-[200%]"
            style={{
              background: "linear-gradient(90deg, transparent, #8B5CF6, #8B5CF6, #EC4899, #8B5CF6, transparent)",
            }}
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Glow effect beneath header */}
        <motion.div
          className="absolute -bottom-8 left-0 right-0 h-8 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(139,92,246,0.1), transparent)",
            opacity: isScrolled ? 1 : 0,
          }}
          animate={{
            opacity: isScrolled ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.header>
      
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
      />
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Header;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

// Navigation configuration
const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/configurator", label: "Конфигуратор" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

// VA-PC Logo Component with animated glow
function VAPCLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)}>
      {/* Triangular VA Mark */}
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]"
        >
          {/* Outer triangle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Main triangle */}
          <path
            d="M20 4L36 34H4L20 4Z"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          {/* Inner V shape */}
          <path
            d="M14 24L20 12L26 24"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300 group-hover:stroke-[#06B6D4]"
          />
          {/* Accent dot */}
          <circle
            cx="20"
            cy="28"
            r="2"
            fill="#06B6D4"
            className="transition-all duration-300 group-hover:fill-[#8B5CF6]"
          />
        </svg>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-neon-purple/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <span className="font-display text-2xl font-bold tracking-wider text-white group-hover:text-glow-purple transition-all duration-300">
          VA-PC
        </span>
        <span className="text-[10px] font-mono text-neon-cyan/70 tracking-[0.3em] uppercase">
          Gaming Systems
        </span>
      </div>
    </Link>
  );
}

// Navigation Link with scan-line effect
function NavLink({ href, label, isActive }: { href: string; label: string; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-2 font-display text-sm font-semibold uppercase tracking-wider transition-colors duration-300",
        "hover:text-neon-purple",
        isActive ? "text-neon-purple" : "text-white/80"
      )}
    >
      <span className="relative z-10">{label}</span>
      {/* Scan line effect */}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-300 group-hover:w-full hover:w-full" 
        style={{ width: isActive ? '100%' : undefined }}
      />
      {/* Hover underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </Link>
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
      className="p-2 rounded-lg transition-all duration-300 hover:bg-neon-cyan/10 group"
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
  
  // Scroll-based header shrink effect
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 64]);
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(17, 17, 24, 0.6)", "rgba(17, 17, 24, 0.95)"]
  );

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
          backgroundColor: headerBg 
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "backdrop-blur-xl",
          "border-b border-glass-border",
          "transition-[border-color] duration-300"
        )}
      >
        <div className="container mx-auto h-full px-4 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <VAPCLogo />
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
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
        
        {/* Decorative bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
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

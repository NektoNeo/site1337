'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton } from '../ui/GlowButton';

const navLinks = [
  { href: '#catalog', label: 'Каталог' },
  { href: '#configurator', label: 'Конфигуратор' },
  { href: '#about', label: 'О нас' },
  { href: '#contacts', label: 'Контакты' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${isScrolled 
            ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/5' 
            : 'py-5 bg-transparent'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              className="relative z-10 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center">
                  <span className="font-inter font-black text-white text-lg">V</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 blur-lg opacity-50" />
              </div>
              <div className="font-inter font-bold text-xl">
                <span className="text-white">VA</span>
                <span className="text-gradient-purple">-PC</span>
              </div>
            </motion.a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>
            
            {/* CTA Button */}
            <div className="hidden md:block">
              <GlowButton variant="primary" size="sm" href="https://t.me/vapc_manager">
                Связаться
              </GlowButton>
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                className="w-6 h-0.5 bg-white rounded-full"
                animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-white rounded-full"
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-white rounded-full"
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-[#0a0a0f] border-l border-white/10 p-8 pt-24"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-2xl font-inter font-semibold text-white/80 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-white/10"
                >
                  <GlowButton 
                    variant="primary" 
                    size="lg" 
                    href="https://t.me/vapc_manager"
                    className="w-full"
                  >
                    Связаться с нами
                  </GlowButton>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

// Footer navigation configuration
const footerNav = {
  catalog: {
    title: "Каталог",
    links: [
      { href: "/catalog/gaming", label: "Gaming PC" },
      { href: "/catalog/workstation", label: "Workstation" },
      { href: "/catalog/streaming", label: "Streaming" },
      { href: "/catalog/budget", label: "Бюджетные ПК" },
      { href: "/configurator", label: "Конфигуратор" },
    ],
  },
  info: {
    title: "Информация",
    links: [
      { href: "/about", label: "О компании" },
      { href: "/delivery", label: "Доставка" },
      { href: "/warranty", label: "Гарантия" },
      { href: "/payment", label: "Оплата" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  contacts: {
    title: "Контакты",
    items: [
      {
        icon: Phone,
        label: "Telegram",
        value: "@VAPC_Manager_bot",
        href: "https://t.me/VAPC_Manager_bot",
      },
      {
        icon: Mail,
        label: "Email",
        value: "info@va-pc.ru",
        href: "mailto:info@va-pc.ru",
      },
      {
        icon: MapPin,
        label: "Адрес",
        value: "г. Москва, 1-й Митинский переулок, 25",
        href: "https://yandex.ru/maps/-/CHuZmP~h",
      },
    ],
  },
};

// Social media links with custom icons
const socialLinks = [
  {
    name: "VK",
    href: "https://vk.com/vapcbuild",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.577 4 8.123c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.847 2.455 2.27 4.607 2.86 4.607.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/vapcbuild",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@vapcbuild",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "Дзен",
    href: "https://dzen.ru/vapcbuild",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.5c-4.142 0-7.5-3.358-7.5-7.5S7.858 4.5 12 4.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5z"/>
      </svg>
    ),
  },
];

// Animated footer section
function FooterSection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="font-inter text-lg font-bold text-white uppercase tracking-wider mb-4 relative">
        {title}
        <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
      </h3>
      {children}
    </motion.div>
  );
}

// Footer link component
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "text-white/60 hover:text-purple-400 transition-colors duration-300",
          "text-sm font-body",
          "flex items-center gap-1 group"
        )}
      >
        <span className="w-0 group-hover:w-2 h-px bg-purple-500 transition-all duration-300" />
        {label}
      </Link>
    </li>
  );
}

// Contact item component
function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-3 group"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <div>
        <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-white/80 group-hover:text-purple-400 transition-colors">
          {value}
        </p>
      </div>
      {href.startsWith("http") && (
        <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-purple-400/50 transition-colors ml-auto mt-1" />
      )}
    </a>
  );
}

// VA-PC Footer Logo - uses the unified Logo component
function FooterLogo() {
  return (
    <div className="mb-4">
      <Logo size="lg" linkTo="/" />
    </div>
  );
}

// Main Footer Component
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-void-dark to-void-black overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 circuit-bg opacity-50" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-lines" />
      
      {/* Decorative glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
      
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <FooterLogo />
            <p className="text-white/60 text-sm font-body leading-relaxed mb-6">
              Собираем мощные игровые ПК для геймеров, стримеров и профессионалов. 
              Качество, производительность, надежность.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center",
                    "rounded-lg border border-purple-500/20",
                    "text-white/60",
                    "hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-400",
                    "transition-all duration-300"
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Catalog Column */}
          <FooterSection title={footerNav.catalog.title} delay={0.1}>
            <ul className="space-y-3">
              {footerNav.catalog.links.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </FooterSection>

          {/* Info Column */}
          <FooterSection title={footerNav.info.title} delay={0.2}>
            <ul className="space-y-3">
              {footerNav.info.links.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </FooterSection>

          {/* Contacts Column */}
          <FooterSection title={footerNav.contacts.title} delay={0.3}>
            <div className="space-y-4">
              {footerNav.contacts.items.map((item) => (
                <ContactItem key={item.label} {...item} />
              ))}
            </div>
            
            {/* Work hours */}
            <div className="mt-6 p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
              <p className="text-xs font-mono text-purple-500/60 uppercase tracking-wider mb-1">
                Режим работы
              </p>
              <p className="text-sm text-white/80">
                ЕЖЕДНЕВНО С 11:00 ДО 21:00
              </p>
              <p className="text-sm text-white/60">
                Доставка по всей России
              </p>
            </div>
          </FooterSection>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-purple-500/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-white/40 font-mono">
              &copy; {currentYear} VA-PC. Все права защищены.
            </p>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { href: "/files/policy.pdf", label: "Политика конфиденциальности" },
                { href: "/files/offerta.pdf", label: "Публичная оферта" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 hover:text-purple-400 transition-colors font-mono"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Payment methods hint */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30 font-mono">Оплата:</span>
              <div className="flex gap-1">
                {["VISA", "MC", "MIR"].map((card) => (
                  <span
                    key={card}
                    className="px-2 py-1 text-[10px] font-mono text-white/40 border border-white/10 rounded"
                  >
                    {card}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

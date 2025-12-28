'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';

// Telegram deeplink with pre-filled message
const TELEGRAM_LINK = 'https://t.me/vapc_support?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82!%20%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%9F%D0%9A';

/**
 * CTA buttons - Messenger (primary) + Catalog (secondary)
 * Main conversion goal: start a conversation
 */
export const CTAButtons = memo(function CTAButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.7 }}
      className="flex flex-col sm:flex-row gap-4 mb-16"
    >
      {/* Primary CTA - Messenger */}
      <MagneticButton
        href={TELEGRAM_LINK}
        variant="primary"
        size="lg"
        magneticStrength={0.4}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Telegram icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        Написать нам
      </MagneticButton>

      {/* Secondary CTA - Catalog */}
      <MagneticButton
        href="/catalog"
        variant="secondary"
        size="lg"
        magneticStrength={0.3}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Смотреть каталог
      </MagneticButton>
    </motion.div>
  );
});

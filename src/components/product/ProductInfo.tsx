'use client';

import { motion } from 'framer-motion';
import { ProductDetail, ProductBadge, ProductFeature } from '@/types/product';

interface ProductInfoProps {
  product: ProductDetail;
  onOrder: () => void;
  onAddToCart: () => void;
}

// Icon components for spec badges
const SpecIcons = {
  cpu: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  ),
  gpu: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="17" cy="12" r="2" />
      <path d="M5 6V4M9 6V4M19 6V4" />
    </svg>
  ),
  ram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <path d="M6 8V6M10 8V6M14 8V6M18 8V6" />
      <path d="M6 16v2M10 16v2M14 16v2M18 16v2" />
    </svg>
  ),
  storage: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  cooling: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    </svg>
  ),
  psu: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
};

function SpecBadge({ badge }: { badge: ProductBadge }) {
  const icon = badge.icon ? SpecIcons[badge.icon] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 hover:border-magenta-400/40 transition-colors">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-magenta-400">{icon}</span>}
          <span className="text-xs text-gray-400 uppercase tracking-wider">{badge.label}</span>
        </div>
        <p className="text-white font-semibold text-sm">{badge.value}</p>
      </div>
    </motion.div>
  );
}

function FeatureItem({ feature, index }: { feature: ProductFeature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3"
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        feature.included
          ? 'bg-gradient-to-br from-green-400 to-emerald-500'
          : 'bg-gray-700'
      }`}>
        {feature.included ? (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
        {feature.text}
      </span>
    </motion.div>
  );
}

export function ProductInfo({ product, onOrder, onAddToCart }: ProductInfoProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-orbitron text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-magenta-200 bg-clip-text text-transparent">
            {product.name}
          </span>
        </h1>
      </motion.div>

      {/* Price Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-baseline gap-4 flex-wrap"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-bold text-white">
            {formatPrice(product.price)}
          </span>
          <span className="text-xl text-gray-400">{product.currency}</span>
        </div>

        {hasDiscount && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.originalPrice!)} {product.currency}
            </span>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-sm font-bold"
            >
              -{discountPercent}%
            </motion.span>
          </>
        )}
      </motion.div>

      {/* Short Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-gray-400 text-lg leading-relaxed"
      >
        {product.shortDescription}
      </motion.p>

      {/* Spec Badges Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        {product.badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.05 }}
          >
            <SpecBadge badge={badge} />
          </motion.div>
        ))}
      </motion.div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-5"
      >
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Included
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.features.map((feature, index) => (
            <FeatureItem key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Stock Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2"
      >
        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
        <span className={`text-sm ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
          {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
        </span>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="flex flex-col sm:flex-row gap-4 pt-2"
      >
        {/* Primary CTA - Order Button */}
        <button
          onClick={onOrder}
          disabled={!product.inStock}
          className="group relative flex-1 py-4 px-8 rounded-xl font-orbitron font-bold text-lg text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-magenta-500 transition-all duration-300" />

          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-magenta-500 blur-xl opacity-50 group-hover:opacity-75 animate-pulse-glow" />

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Button content */}
          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="uppercase tracking-wider">Заказать</span>
          </span>
        </button>

        {/* Secondary - Add to Cart */}
        <button
          onClick={onAddToCart}
          disabled={!product.inStock}
          className="group relative py-4 px-6 rounded-xl font-semibold text-white border-2 border-purple-500/50 hover:border-magenta-400 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add to Cart</span>
          </span>
        </button>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-800"
      >
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="w-5 h-5 text-magenta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>2 Year Warranty</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="w-5 h-5 text-magenta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="w-5 h-5 text-magenta-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>30-Day Returns</span>
        </div>
      </motion.div>
    </div>
  );
}

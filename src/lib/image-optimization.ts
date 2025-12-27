/**
 * Image Optimization Utilities
 * 
 * Performance-focused image handling for Next.js e-commerce platform.
 * Provides blur placeholders, responsive sizing, and lazy loading helpers.
 */

import type { ImageLoaderProps, ImageProps } from 'next/image';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default blur placeholder for images before loading
 * A 10x10 neutral gray placeholder encoded as base64 data URL
 */
export const DEFAULT_BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWEyZSIvPjwvc3ZnPg==';

/**
 * Product image sizes for responsive srcset
 */
export const PRODUCT_IMAGE_SIZES = {
  // Product card in grid
  card: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    width: 400,
    height: 400,
  },
  // Product detail hero image
  detail: {
    sizes: '(max-width: 768px) 100vw, 50vw',
    width: 800,
    height: 800,
  },
  // Thumbnail in gallery
  thumbnail: {
    sizes: '80px',
    width: 80,
    height: 80,
  },
  // Cart item image
  cart: {
    sizes: '100px',
    width: 100,
    height: 100,
  },
  // Hero banner
  hero: {
    sizes: '100vw',
    width: 1920,
    height: 1080,
  },
  // Category banner
  category: {
    sizes: '(max-width: 768px) 100vw, 50vw',
    width: 600,
    height: 400,
  },
  // Configurator component preview
  configurator: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 200px',
    width: 200,
    height: 200,
  },
} as const;

export type ImageSizePreset = keyof typeof PRODUCT_IMAGE_SIZES;

// ============================================================================
// IMAGE LOADER
// ============================================================================

/**
 * Custom image loader for VK API images
 * VK images don't support on-the-fly resizing, so we just return the original
 */
export function vkImageLoader({ src, width, quality }: ImageLoaderProps): string {
  // VK images typically come in fixed sizes, just return the original
  // Next.js will still optimize format and compression
  if (src.includes('userapi.com') || src.includes('vk.com')) {
    return src;
  }
  
  // For our own CDN, we can add width/quality params
  if (src.includes('cdn.va-pc.ru')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', (quality || 75).toString());
    return url.toString();
  }

  return src;
}

// ============================================================================
// BLUR PLACEHOLDER GENERATION
// ============================================================================

/**
 * Generate a simple SVG blur placeholder with dominant color
 * Used for instant display while image loads
 */
export function generateBlurSvg(
  width: number = 10,
  height: number = 10,
  color: string = '#1a1a2e'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Generate blur placeholder with gradient (for product images)
 */
export function generateGradientBlur(
  fromColor: string = '#1a1a2e',
  toColor: string = '#0f0f1a'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${fromColor}"/>
          <stop offset="100%" style="stop-color:${toColor}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// ============================================================================
// IMAGE PROPS HELPERS
// ============================================================================

/**
 * Get optimized image props for a given preset
 * Returns Next.js Image component props for optimal loading
 */
export function getImageProps(
  src: string,
  alt: string,
  preset: ImageSizePreset = 'card',
  options: {
    priority?: boolean;
    blurColor?: string;
    className?: string;
  } = {}
): Partial<ImageProps> {
  const sizeConfig = PRODUCT_IMAGE_SIZES[preset];
  const { priority = false, blurColor, className } = options;

  return {
    src,
    alt,
    width: sizeConfig.width,
    height: sizeConfig.height,
    sizes: sizeConfig.sizes,
    priority,
    placeholder: 'blur' as const,
    blurDataURL: blurColor 
      ? generateBlurSvg(10, 10, blurColor) 
      : DEFAULT_BLUR_DATA_URL,
    className,
    loading: priority ? 'eager' : 'lazy',
    quality: 85,
  };
}

/**
 * Get image props for product card
 */
export function getProductCardImageProps(
  src: string,
  productName: string,
  options: { priority?: boolean; className?: string } = {}
): Partial<ImageProps> {
  return getImageProps(src, productName, 'card', {
    ...options,
    blurColor: '#1a1a2e',
  });
}

/**
 * Get image props for product detail page
 */
export function getProductDetailImageProps(
  src: string,
  productName: string,
  options: { priority?: boolean; className?: string } = {}
): Partial<ImageProps> {
  return getImageProps(src, productName, 'detail', {
    ...options,
    priority: true, // Detail images should load first
    blurColor: '#1a1a2e',
  });
}

/**
 * Get image props for hero section
 */
export function getHeroImageProps(
  src: string,
  alt: string,
  className?: string
): Partial<ImageProps> {
  return {
    ...getImageProps(src, alt, 'hero', { priority: true, className }),
    fill: true,
    style: { objectFit: 'cover' },
  };
}

// ============================================================================
// SRCSET UTILITIES
// ============================================================================

/**
 * Generate srcset string for responsive images
 * Useful for custom image implementations outside of next/image
 */
export function generateSrcSet(
  baseSrc: string,
  widths: number[] = [640, 750, 828, 1080, 1200]
): string {
  // For VK images, we can't resize on the fly
  if (baseSrc.includes('userapi.com') || baseSrc.includes('vk.com')) {
    return baseSrc;
  }

  return widths
    .map((w) => {
      const url = new URL(baseSrc);
      url.searchParams.set('w', w.toString());
      return `${url.toString()} ${w}w`;
    })
    .join(', ');
}

// ============================================================================
// IMAGE PRELOADING
// ============================================================================

/**
 * Preload critical images for faster LCP
 * Call this in page components for above-the-fold images
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): void {
  srcs.forEach((src) => preloadImage(src));
}

// ============================================================================
// IMAGE VALIDATION
// ============================================================================

/**
 * Check if image URL is valid and from allowed domains
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'images.unsplash.com',
      'userapi.com',
      'vk.com',
      'cdn.va-pc.ru',
    ];

    return allowedHosts.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

/**
 * Get fallback image URL if original is invalid
 */
export function getImageWithFallback(
  src: string | undefined | null,
  fallback: string = '/images/placeholder-product.png'
): string {
  if (!src) return fallback;
  if (!isValidImageUrl(src)) return fallback;
  return src;
}

// ============================================================================
// ASPECT RATIO HELPERS
// ============================================================================

/**
 * Calculate dimensions while maintaining aspect ratio
 */
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;
  let width = maxWidth;
  let height = maxWidth / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Common aspect ratios for product images
 */
export const ASPECT_RATIOS = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
  wide: 16 / 9,
  ultrawide: 21 / 9,
} as const;

// ============================================================================
// SHIMMER EFFECT
// ============================================================================

/**
 * Generate shimmer placeholder for skeleton loading
 * Creates animated loading effect
 */
export function generateShimmerSvg(
  width: number,
  height: number,
  backgroundColor: string = '#1a1a2e',
  shimmerColor: string = '#2a2a3e'
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${backgroundColor}">
            <animate attributeName="offset" values="-2;1" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" style="stop-color:${shimmerColor}">
            <animate attributeName="offset" values="-1;2" dur="2s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:${backgroundColor}">
            <animate attributeName="offset" values="0;3" dur="2s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

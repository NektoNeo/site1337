'use client';

/**
 * Optimized Image Component
 * 
 * Enhanced next/image wrapper with:
 * - Automatic blur placeholders
 * - Responsive sizing presets
 * - Error handling with fallback
 * - Hover prefetching
 * - Performance monitoring
 */

import Image, { ImageProps } from 'next/image';
import { useState, useCallback, memo, useEffect } from 'react';
import { 
  DEFAULT_BLUR_DATA_URL, 
  PRODUCT_IMAGE_SIZES, 
  ImageSizePreset,
  getImageWithFallback,
  generateBlurSvg,
} from '@/lib/image-optimization';
import { useUIMonitor } from '@/hooks/useUIMonitor';

// ============================================================================
// TYPES
// ============================================================================

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /** Image source URL */
  src: string | null | undefined;
  /** Alt text for accessibility */
  alt: string;
  /** Size preset for responsive images */
  preset?: ImageSizePreset;
  /** Fallback image URL */
  fallbackSrc?: string;
  /** Custom blur color for placeholder */
  blurColor?: string;
  /** Aspect ratio (for fill mode) */
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  /** Enable hover prefetch (for related images) */
  prefetchOnHover?: boolean;
  /** Custom wrapper className */
  wrapperClassName?: string;
  /** Show loading skeleton */
  showSkeleton?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ASPECT_RATIO_CLASSES = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-video',
} as const;

const DEFAULT_FALLBACK = '/images/placeholder-product.svg';

// ============================================================================
// COMPONENT
// ============================================================================

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  preset,
  fallbackSrc = DEFAULT_FALLBACK,
  blurColor = '#1a1a2e',
  aspectRatio,
  prefetchOnHover = false,
  wrapperClassName = '',
  showSkeleton = true,
  className = '',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI monitoring
  const { trackImageLoadStart, trackImageLoadSuccess, trackImageLoadError } = useUIMonitor(true);

  // Get validated image source
  const imageSrc = error ? fallbackSrc : getImageWithFallback(src, fallbackSrc);

  // Get size configuration from preset
  const sizeConfig = preset ? PRODUCT_IMAGE_SIZES[preset] : null;

  // Track image load start
  useEffect(() => {
    if (imageSrc && !error) {
      trackImageLoadStart(imageSrc);
    }
  }, [imageSrc, error, trackImageLoadStart]);

  // Handle image load error
  const handleError = useCallback(() => {
    if (!error) {
      setError(true);
      console.warn(`Image failed to load: ${src}`);
      // #region agent log
      trackImageLoadError(imageSrc, alt, 'OptimizedImage');
      // #endregion agent log
    }
  }, [error, src, imageSrc, alt, trackImageLoadError]);

  // Handle image load complete
  const handleLoadComplete = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    const img = e.currentTarget;
    // #region agent log
    trackImageLoadSuccess(
      imageSrc,
      alt,
      'OptimizedImage'
    );
    // #endregion agent log
  }, [imageSrc, alt, trackImageLoadSuccess]);

  // Prefetch related images on hover
  const handleMouseEnter = useCallback(() => {
    if (prefetchOnHover && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = imageSrc;
      document.head.appendChild(link);
    }
  }, [prefetchOnHover, imageSrc]);

  // Build image props - ensure src and alt are always strings
  const validSrc = imageSrc || fallbackSrc || DEFAULT_FALLBACK;

  const imageProps: Partial<ImageProps> & { src: string; alt: string } = {
    ...props,
    src: validSrc,
    alt,
    className: `${className} ${isLoading && showSkeleton ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurSvg(10, 10, blurColor),
    onError: handleError,
    onLoad: handleLoadComplete,
    priority,
    quality: 85,
  };

  // Add preset sizes if specified
  if (sizeConfig && !props.fill) {
    imageProps.width = props.width || sizeConfig.width;
    imageProps.height = props.height || sizeConfig.height;
    imageProps.sizes = props.sizes || sizeConfig.sizes;
  }

  // Render with aspect ratio wrapper if needed
  if (aspectRatio || props.fill) {
    const aspectClass = aspectRatio ? ASPECT_RATIO_CLASSES[aspectRatio] : '';
    
    return (
      <div 
        className={`relative overflow-hidden ${aspectClass} ${wrapperClassName}`}
        onMouseEnter={prefetchOnHover ? handleMouseEnter : undefined}
      >
        {/* Loading skeleton */}
        {isLoading && showSkeleton && (
          <div className="absolute inset-0 animate-pulse bg-white/5" />
        )}
        <Image
          {...imageProps}
          fill={props.fill !== false}
          style={{ objectFit: 'cover', ...props.style }}
        />
      </div>
    );
  }

  // Render standard image
  return (
    <div 
      className={`relative ${wrapperClassName}`}
      onMouseEnter={prefetchOnHover ? handleMouseEnter : undefined}
    >
      {isLoading && showSkeleton && (
        <div 
          className="absolute inset-0 animate-pulse bg-white/5 rounded"
          style={{ 
            width: imageProps.width as number, 
            height: imageProps.height as number 
          }}
        />
      )}
      <Image {...imageProps} />
    </div>
  );
});

// ============================================================================
// SPECIALIZED VARIANTS
// ============================================================================

/**
 * Product Card Image - optimized for grid display
 */
export const ProductCardImage = memo(function ProductCardImage({
  src,
  productName,
  className = '',
  priority = false,
}: {
  src: string | null | undefined;
  productName: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={productName}
      preset="card"
      aspectRatio="square"
      className={`object-cover ${className}`}
      prefetchOnHover
      priority={priority}
    />
  );
});

/**
 * Product Detail Image - optimized for product pages
 */
export const ProductDetailImage = memo(function ProductDetailImage({
  src,
  productName,
  className = '',
}: {
  src: string | null | undefined;
  productName: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={productName}
      preset="detail"
      aspectRatio="square"
      className={`object-contain ${className}`}
      priority
    />
  );
});

/**
 * Thumbnail Image - small preview images
 */
export const ThumbnailImage = memo(function ThumbnailImage({
  src,
  alt,
  isActive = false,
  onClick,
}: {
  src: string | null | undefined;
  alt: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
        isActive ? 'border-purple-500' : 'border-white/10 hover:border-white/30'
      }`}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        preset="thumbnail"
        fill
        showSkeleton={false}
      />
    </button>
  );
});

/**
 * Hero Banner Image - full-width hero sections
 */
export const HeroBannerImage = memo(function HeroBannerImage({
  src,
  alt,
  className = '',
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      preset="hero"
      fill
      priority
      className={`object-cover ${className}`}
      showSkeleton={false}
    />
  );
});

/**
 * Cart Item Image - small images in cart
 */
export const CartItemImage = memo(function CartItemImage({
  src,
  productName,
}: {
  src: string | null | undefined;
  productName: string;
}) {
  return (
    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white/5">
      <OptimizedImage
        src={src}
        alt={productName}
        preset="cart"
        fill
        showSkeleton={false}
      />
    </div>
  );
});

export default OptimizedImage;

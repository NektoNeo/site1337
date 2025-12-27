'use client';

/**
 * Lazy Loading Component Utilities
 * 
 * Dynamic imports with loading states for code splitting.
 * Reduces initial bundle size by loading heavy components on demand.
 */

import dynamic from 'next/dynamic';
import { Suspense, ReactNode, ComponentType } from 'react';

// ============================================================================
// LOADING SKELETONS
// ============================================================================

/**
 * Generic loading skeleton
 */
export function LoadingSkeleton({ 
  className = '',
  height = 'h-32'
}: { 
  className?: string;
  height?: string;
}) {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-lg ${height} ${className}`}
      aria-label="Loading..."
    />
  );
}

/**
 * Product card loading skeleton
 */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse p-4 rounded-lg bg-white/5 space-y-4">
      <div className="aspect-square bg-white/10 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
      <div className="h-6 bg-white/10 rounded w-1/3" />
    </div>
  );
}

/**
 * Configurator loading skeleton
 */
export function ConfiguratorSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
      {/* Left panel skeleton */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-3">
        <div className="h-10 bg-white/10 rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg" />
        ))}
      </div>
      {/* Center visualization skeleton */}
      <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center">
        <div className="w-full aspect-square max-w-md bg-white/5 rounded-lg" />
      </div>
      {/* Right panel skeleton */}
      <div className="lg:col-span-3 space-y-4">
        <div className="h-8 bg-white/10 rounded w-1/2" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 bg-white/5 rounded" />
          ))}
        </div>
        <div className="h-12 bg-purple-500/20 rounded-lg mt-4" />
      </div>
    </div>
  );
}

/**
 * Filter sidebar loading skeleton
 */
export function FilterSidebarSkeleton() {
  return (
    <div className="animate-pulse w-64 p-4 space-y-6 bg-white/5 rounded-lg">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-6 bg-white/5 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Modal loading skeleton
 */
export function ModalSkeleton() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-8 bg-white/10 rounded w-1/3" />
      <div className="h-64 bg-white/5 rounded-lg" />
      <div className="flex gap-4 justify-end">
        <div className="h-10 bg-white/10 rounded w-24" />
        <div className="h-10 bg-purple-500/20 rounded w-24" />
      </div>
    </div>
  );
}

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

/**
 * Lazy load the PC Configurator Visualization
 * This is a heavy component with Framer Motion animations
 */
export const LazyPCVisualization = dynamic(
  () => import('@/components/configurator/PCVisualization').then(mod => ({ default: mod.PCVisualization })),
  {
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse w-72 h-96 bg-white/5 rounded-lg" />
      </div>
    ),
    ssr: false, // Client-only due to heavy animations
  }
);

/**
 * Lazy load the Component Modal
 */
export const LazyComponentModal = dynamic(
  () => import('@/components/configurator/ComponentModal').then(mod => ({ default: mod.ComponentModal })),
  {
    loading: () => <ModalSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy load the Filter Sidebar (for mobile)
 */
export const LazyFilterSidebar = dynamic(
  () => import('@/components/catalog/FilterSidebar').then(mod => ({ default: mod.FilterSidebar })),
  {
    loading: () => <FilterSidebarSkeleton />,
    ssr: true,
  }
);

/**
 * Lazy load Product Image Gallery
 */
export const LazyProductImageGallery = dynamic(
  () => import('@/components/product/ProductImageGallery').then(mod => ({ default: mod.ProductImageGallery })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="aspect-square bg-white/5 rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-20 h-20 bg-white/5 rounded" />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Lazy load Related Products section
 */
export const LazyRelatedProducts = dynamic(
  () => import('@/components/product/RelatedProducts').then(mod => ({ default: mod.RelatedProducts })),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-8 bg-white/10 rounded w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    ),
    ssr: true,
  }
);

/**
 * Lazy load Animated Background (heavy CSS animations)
 */
export const LazyAnimatedBackground = dynamic(
  () => import('@/components/ui/AnimatedBackground').then(mod => ({ default: mod.AnimatedBackground })),
  {
    loading: () => null,
    ssr: false,
  }
);

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Wrapper for lazy components with error boundary
 */
export function LazyWrapper({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <LoadingSkeleton />}>
      {children}
    </Suspense>
  );
}

/**
 * Create a lazy component with custom loading
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  LoadingComponent?: ComponentType
): ComponentType<P> {
  return dynamic(importFn, {
    loading: LoadingComponent ? () => <LoadingComponent /> : () => <LoadingSkeleton />,
    ssr: false,
  });
}

// ============================================================================
// INTERSECTION OBSERVER LAZY LOADING
// ============================================================================

import { useEffect, useRef, useState } from 'react';

/**
 * Hook for lazy loading components when they enter viewport
 */
export function useIntersectionLazyLoad(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
}

/**
 * Component that lazily renders children when in viewport
 */
export function LazyOnViewport({
  children,
  fallback = <LoadingSkeleton />,
  className = '',
  rootMargin = '100px',
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const { ref, hasIntersected } = useIntersectionLazyLoad({ rootMargin });

  return (
    <div ref={ref} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
}

// ============================================================================
// PREFETCH UTILITIES
// ============================================================================

/**
 * Prefetch a page when link is hovered
 * Use with next/link onMouseEnter
 */
export function usePrefetchOnHover(href: string) {
  const prefetched = useRef(false);

  return () => {
    if (prefetched.current) return;
    
    // Next.js will handle the actual prefetching
    // This just prevents multiple prefetch calls
    prefetched.current = true;
    
    // For external resources, we can use link preload
    if (href.startsWith('http')) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  };
}

/**
 * Prefetch an image when element is hovered
 */
export function usePrefetchImageOnHover(src: string) {
  const prefetched = useRef(false);

  return () => {
    if (prefetched.current || !src) return;
    prefetched.current = true;

    const img = new Image();
    img.src = src;
  };
}

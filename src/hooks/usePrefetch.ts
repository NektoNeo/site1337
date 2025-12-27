'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  prefetchProduct,
  prefetchProducts,
  preloadProductImages,
  createPrefetchObserver,
} from '@/lib/prefetch';
import { Product } from '@/types/product';

// ============================================
// PREFETCH HOOKS FOR PERFORMANCE
// ============================================
// Usage:
// 1. usePrefetchOnHover - prefetch on mouse enter
// 2. usePrefetchOnVisible - prefetch when element enters viewport
// 3. usePrefetchNextPage - prefetch next page of products
// ============================================

// Prefetch product data when hovering over link
export function usePrefetchOnHover(slug: string) {
  const hasPrefetched = useRef(false);

  const onMouseEnter = useCallback(() => {
    if (!hasPrefetched.current) {
      hasPrefetched.current = true;
      prefetchProduct(slug);
    }
  }, [slug]);

  return { onMouseEnter };
}

// Prefetch when element becomes visible
export function usePrefetchOnVisible<T extends HTMLElement>(
  id: string,
  prefetch: (id: string) => void
) {
  const ref = useRef<T>(null);
  const hasPrefetched = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = createPrefetchObserver((observedId) => {
      if (observedId === id && !hasPrefetched.current) {
        hasPrefetched.current = true;
        prefetch(id);
      }
    });

    if (!observer) return;

    element.setAttribute('data-prefetch-id', id);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [id, prefetch]);

  return ref;
}

// Prefetch next page of products
export function usePrefetchNextPage(
  currentPage: number,
  totalPages: number,
  productsPerPage: number = 9
) {
  const hasPrefetched = useRef<Set<number>>(new Set());

  useEffect(() => {
    const nextPage = currentPage + 1;

    if (nextPage <= totalPages && !hasPrefetched.current.has(nextPage)) {
      hasPrefetched.current.add(nextPage);
      prefetchProducts(nextPage, productsPerPage);
    }
  }, [currentPage, totalPages, productsPerPage]);
}

// Preload images for visible products
export function usePreloadImages(products: Product[], limit: number = 3) {
  useEffect(() => {
    preloadProductImages(products, limit);
  }, [products, limit]);
}

// Combined prefetch hook for product cards
export function useProductPrefetch(product: Product, index: number) {
  const { onMouseEnter } = usePrefetchOnHover(product.slug);

  // Preload first 3 product images
  useEffect(() => {
    if (index < 3 && product.image) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = product.image;
      link.fetchPriority = index === 0 ? 'high' : 'low';

      const existing = document.head.querySelector(`link[href="${product.image}"]`);
      if (!existing) {
        document.head.appendChild(link);
      }
    }
  }, [product.image, index]);

  return { onMouseEnter };
}

// Intersection observer for lazy loading
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting);
      },
      {
        rootMargin: '100px',
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, options]);

  return ref;
}

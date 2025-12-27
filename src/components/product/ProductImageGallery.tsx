'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '@/types/product';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const selectedImage = images[selectedIndex];

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    },
    [handlePrevious, handleNext]
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image Container with RGB Border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative group"
        >
          {/* RGB Animated Border */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-conic from-purple-500 via-cyan-400 via-pink-500 to-purple-500 opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500 animate-rgb-spin" />
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-conic from-purple-500 via-cyan-400 via-pink-500 to-purple-500 opacity-50 animate-rgb-spin" />

          {/* Main Image */}
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <motion.img
              key={selectedImage.id}
              src={selectedImage.url}
              alt={selectedImage.alt || productName}
              className="w-full h-full object-contain p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: isZoomed ? 1.15 : 1,
              }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.4, ease: 'easeOut' }
              }}
            />

            {/* Zoom Indicator */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span className="text-xs text-gray-300 font-medium">Click to expand</span>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-500/20 hover:border-purple-400"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-500/20 hover:border-purple-400"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Thumbnail Carousel */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          >
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === selectedIndex
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-105'
                    : 'opacity-60 hover:opacity-100 hover:ring-1 hover:ring-cyan-400/50'
                }`}
              >
                <img
                  src={image.url}
                  alt={`${productName} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === selectedIndex && (
                  <div className="absolute inset-0 bg-purple-500/10" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Lightbox Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* RGB Glow behind image */}
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-cyan-400/20 to-purple-500/20 blur-3xl" />

              <img
                src={selectedImage.url}
                alt={selectedImage.alt || productName}
                className="relative max-w-full max-h-[85vh] object-contain rounded-lg"
              />

              {/* Image Counter */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white/80 text-sm font-medium">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-purple-500/30 hover:border-purple-400 transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-purple-500/30 hover:border-purple-400 transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-xl">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
                    index === selectedIndex
                      ? 'ring-2 ring-cyan-400 scale-110'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Loader2, AlertCircle, ArrowUp } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ProductImageGallery,
  ProductInfo,
  SpecificationsTable,
  RelatedProducts,
} from '@/components/product';
import SpecsSummaryCard from '@/components/product/SpecsSummaryCard';
import FPSMeter from '@/components/product/FPSMeter';
import { useVKProduct } from '@/hooks/use-vk-product';
import { Button } from '@/components/ui/button';

// Background effects removed for cleaner layout

// Loading skeleton
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-black relative">
      <div className="relative z-10">
        {/* Breadcrumb skeleton */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-4 bg-white/5 rounded" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-4 bg-white/5 rounded" />
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Product content skeleton */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image gallery skeleton */}
            <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />

            {/* Product info skeleton */}
            <div className="space-y-6">
              <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" />
              <div className="h-12 w-1/2 bg-white/10 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="h-14 bg-purple-600/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-4"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 mx-auto">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-inter font-bold text-white mb-2">
          Товар не найден
        </h1>
        <p className="text-white/50 mb-6 max-w-md mx-auto">
          {error.message || 'Не удалось загрузить информацию о товаре. Попробуйте позже.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/catalog">
            <Button variant="outline">
              В каталог
            </Button>
          </Link>
          <Button variant="default" onClick={onRetry}>
            Повторить
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Breadcrumb component using shadcn/ui
function ProductBreadcrumb({ productName }: { productName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Breadcrumb>
        <BreadcrumbList className="text-white/50">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-white/50 hover:text-white">
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-white/30" />
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-white/50 hover:text-white">
              <Link href="/catalog">Каталог</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-white/30" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-purple-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {productName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
}

// Back to top button
function BackToTopButton() {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-600 hover:to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/25 z-50 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Наверх"
    >
      <ArrowUp className="w-5 h-5 text-white" />
    </motion.button>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Fetch product data
  const { product, relatedProducts, isLoading, error, refetch } = useVKProduct({
    slug,
    enabled: Boolean(slug),
  });

  // Loading state
  if (isLoading) {
    return <ProductSkeleton />;
  }

  // Error state
  if (error || !product) {
    return (
      <ErrorState
        error={error || new Error('Товар не найден')}
        onRetry={refetch}
      />
    );
  }

  const handleOrder = () => {
    // Open Telegram bot or contact form
    window.open('https://t.me/VAPC_Manager_bot', '_blank');
  };

  const handleAddToCart = () => {
    // Add to cart logic (implement cart context later)
    console.log('Added to cart:', product.id);
  };

  return (
    <div className="min-h-screen bg-black relative">

      {/* Main Content */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <ProductBreadcrumb productName={product.name} />
        </div>

        {/* Product Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Image Gallery */}
            <motion.div
              className="lg:sticky lg:top-28 lg:self-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
            </motion.div>

            {/* Right Column - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProductInfo
                product={product}
                onOrder={handleOrder}
                onAddToCart={handleAddToCart}
              />

              {/* Concise Specs Summary */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-6">
                  <SpecsSummaryCard specs={product.specifications as any} />
                </div>
              )}

              {/* FPS Meter */}
              <div className="mt-6">
                <FPSMeter
                  gpuLabel={(product.specifications as any)?.find?.((s: any) =>
                    typeof s?.name === 'string' && s.name.toLowerCase().includes('видеокарта')
                  )?.value || product?.badges?.find?.((b: any) => typeof b === 'string' && /rtx|radeon/i.test(b)) || ''}
                />
              </div>
            </motion.div>
          </div>

          {/* Detailed specifications removed in favor of concise summary */}

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <RelatedProducts products={relatedProducts} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}

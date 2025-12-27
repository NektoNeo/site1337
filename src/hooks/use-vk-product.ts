'use client';

/**
 * VK Product Hook
 * Fetches a single product from VK API by slug
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VKProduct } from '@/types/vk-product';
import {
  ProductDetail,
  ProductImage,
  ProductBadge,
  ProductFeature,
  ProductSpecCategory,
  RelatedProduct,
} from '@/types/product';
import { CatalogProductSpecs, PlatformBadge, toCatalogProduct } from '@/types/catalog';

/**
 * API Base URL
 */
const API_BASE = '/api/products';

/**
 * Query keys
 */
export const productQueryKeys = {
  all: ['product'] as const,
  bySlug: (slug: string) => [...productQueryKeys.all, 'slug', slug] as const,
  byId: (id: string) => [...productQueryKeys.all, 'id', id] as const,
  related: (slug: string) => [...productQueryKeys.all, 'related', slug] as const,
};

/**
 * Fetch product by slug
 */
async function fetchProductBySlug(slug: string): Promise<{ product: VKProduct; related: VKProduct[] }> {
  const response = await fetch(`${API_BASE}/${slug}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Товар не найден');
    }
    const error = await response.json().catch(() => ({ message: 'Failed to fetch product' }));
    throw new Error(error.message || 'Failed to fetch product');
  }

  return response.json();
}

/**
 * Extract specs from VK product description
 */
function extractSpecs(description: string): CatalogProductSpecs {
  const normalizedDesc = description.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');

  const patterns = {
    cpu: [
      /(?:Процессор|CPU|ЦП)[:\s]*([^\n,;]+)/gi,
      /Intel\s+Core\s+i[3579]-?\d{4,5}[A-Z]*/gi,
      /AMD\s+Ryzen\s+[3579]\s+\d{4}[A-Z]*/gi,
      /Ryzen\s+[3579]\s+\d{4}[A-Z]*/gi,
      /i[3579]-?\d{4,5}[A-Z]*/gi,
    ],
    gpu: [
      /(?:Видеокарта|GPU|Графика)[:\s]*([^\n,;]+)/gi,
      /GeForce\s+RTX\s+\d{4}(?:\s+Ti)?(?:\s+SUPER)?/gi,
      /RTX\s+\d{4}(?:\s+Ti)?(?:\s+SUPER)?/gi,
      /Radeon\s+RX\s+\d{4}(?:\s+XT)?/gi,
    ],
    ram: [
      /(?:Память|RAM|ОЗУ)[:\s]*([^\n,;]+)/gi,
      /(\d{1,3})\s*(?:GB|ГБ)\s+DDR[45]/gi,
      /DDR[45]\s+(\d{1,3})\s*(?:GB|ГБ)/gi,
    ],
    ssd: [
      /(?:SSD|Накопитель|Диск)[:\s]*([^\n,;]+)/gi,
      /SSD\s+(?:NVMe\s+)?(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
      /(\d+)\s*(?:GB|TB|ГБ|ТБ)\s+(?:SSD|NVMe)/gi,
    ],
    motherboard: [
      /(?:Материнская плата|Мат\.?\s*плата|MB)[:\s]*([^\n,;]+)/gi,
    ],
    psu: [
      /(?:Блок питания|БП|PSU)[:\s]*([^\n,;]+)/gi,
      /(\d{3,4})\s*(?:W|Вт)/gi,
    ],
    cooling: [
      /(?:Охлаждение|Кулер|Cooling)[:\s]*([^\n,;]+)/gi,
    ],
    case: [
      /(?:Корпус|Case)[:\s]*([^\n,;]+)/gi,
    ],
  };

  const extractFirst = (patternList: RegExp[]): string | null => {
    for (const pattern of patternList) {
      const match = normalizedDesc.match(pattern);
      if (match) {
        // Return the captured group if exists, otherwise the full match
        return (match[1] || match[0]).trim();
      }
    }
    return null;
  };

  return {
    cpu: extractFirst(patterns.cpu),
    gpu: extractFirst(patterns.gpu),
    ram: extractFirst(patterns.ram),
    ssd: extractFirst(patterns.ssd),
    motherboard: extractFirst(patterns.motherboard),
    psu: extractFirst(patterns.psu),
    cooling: extractFirst(patterns.cooling),
    case: extractFirst(patterns.case),
  };
}

/**
 * Get platform badge from specs
 */
function getPlatformBadge(specs: CatalogProductSpecs): PlatformBadge {
  const cpu = (specs.cpu || '').toLowerCase();
  const gpu = (specs.gpu || '').toLowerCase();

  if (cpu.includes('ryzen') || cpu.includes('amd')) return 'AMD';
  if (cpu.includes('intel') || cpu.includes('core i')) return 'Intel';
  if (gpu.includes('radeon') || gpu.includes('rx ')) return 'AMD';
  if (gpu.includes('geforce') || gpu.includes('rtx') || gpu.includes('nvidia')) return 'NVIDIA';

  return null;
}

/**
 * Transform VK product to ProductDetail type
 */
export function vkProductToDetail(product: VKProduct): ProductDetail {
  const specs = extractSpecs(product.description);
  const platform = getPlatformBadge(specs);

  // Transform images
  const images: ProductImage[] = product.images.map((img, index) => ({
    id: `img-${index}`,
    url: img.url || img.thumbnail || '',
    alt: product.title,
    isMain: index === 0,
  }));

  // Create badges from specs
  const badges: ProductBadge[] = [];
  if (specs.cpu) {
    badges.push({ id: 'cpu', label: 'Процессор', value: specs.cpu, icon: 'cpu' });
  }
  if (specs.gpu) {
    badges.push({ id: 'gpu', label: 'Видеокарта', value: specs.gpu, icon: 'gpu' });
  }
  if (specs.ram) {
    badges.push({ id: 'ram', label: 'Память', value: specs.ram, icon: 'ram' });
  }
  if (specs.ssd) {
    badges.push({ id: 'storage', label: 'Накопитель', value: specs.ssd, icon: 'storage' });
  }
  if (specs.cooling) {
    badges.push({ id: 'cooling', label: 'Охлаждение', value: specs.cooling, icon: 'cooling' });
  }
  if (specs.psu) {
    badges.push({ id: 'psu', label: 'Питание', value: specs.psu, icon: 'psu' });
  }

  // Create features
  const features: ProductFeature[] = [
    { id: 'warranty', text: 'Гарантия 2 года', included: true },
    { id: 'windows', text: 'Windows 11 Pro', included: true },
    { id: 'drivers', text: 'Все драйверы установлены', included: true },
    { id: 'tested', text: 'Тестирование под нагрузкой', included: true },
    { id: 'support', text: 'Техподдержка', included: true },
    { id: 'delivery', text: 'Доставка по России', included: true },
  ];

  // Create specifications
  const specifications: ProductSpecCategory[] = [];

  if (specs.cpu) {
    specifications.push({
      category: 'Процессор',
      specs: [
        { label: 'Модель', value: specs.cpu },
      ],
    });
  }

  if (specs.gpu) {
    specifications.push({
      category: 'Видеокарта',
      specs: [
        { label: 'Модель', value: specs.gpu },
      ],
    });
  }

  if (specs.ram) {
    specifications.push({
      category: 'Оперативная память',
      specs: [
        { label: 'Объем', value: specs.ram },
      ],
    });
  }

  if (specs.ssd) {
    specifications.push({
      category: 'Накопитель',
      specs: [
        { label: 'SSD', value: specs.ssd },
      ],
    });
  }

  if (specs.motherboard) {
    specifications.push({
      category: 'Материнская плата',
      specs: [
        { label: 'Модель', value: specs.motherboard },
      ],
    });
  }

  if (specs.psu) {
    specifications.push({
      category: 'Блок питания',
      specs: [
        { label: 'Мощность', value: specs.psu },
      ],
    });
  }

  if (specs.cooling) {
    specifications.push({
      category: 'Охлаждение',
      specs: [
        { label: 'Тип', value: specs.cooling },
      ],
    });
  }

  if (specs.case) {
    specifications.push({
      category: 'Корпус',
      specs: [
        { label: 'Модель', value: specs.case },
      ],
    });
  }

  // Add platform info if detected
  if (platform) {
    specifications.push({
      category: 'Платформа',
      specs: [
        { label: 'Производитель', value: platform },
      ],
    });
  }

  return {
    id: String(product.id),
    slug: product.slug,
    name: product.title,
    shortDescription: product.description.slice(0, 200) + (product.description.length > 200 ? '...' : ''),
    fullDescription: product.description,
    price: product.price.amount,
    originalPrice: product.price.originalAmount || undefined,
    currency: 'RUB',
    inStock: product.availability === 'in_stock',
    images,
    badges,
    features,
    specifications,
  };
}

/**
 * Transform VK products to related products
 */
export function vkProductsToRelated(products: VKProduct[]): RelatedProduct[] {
  return products.map((product) => {
    const catalogProduct = toCatalogProduct(product);
    const badges: string[] = [];

    if (catalogProduct.specs?.gpu) badges.push(catalogProduct.specs.gpu);
    if (catalogProduct.specs?.cpu) badges.push(catalogProduct.specs.cpu);
    if (catalogProduct.specs?.ram) badges.push(catalogProduct.specs.ram);

    return {
      id: String(product.id),
      slug: product.slug,
      name: product.title,
      price: product.price.amount,
      originalPrice: product.price.originalAmount || undefined,
      imageUrl: product.images[0]?.url || product.images[0]?.thumbnail || '/images/placeholder.png',
      badges: badges.slice(0, 3),
    };
  });
}

/**
 * Hook options
 */
export interface UseVKProductOptions {
  /** Product slug */
  slug: string;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Stale time in ms (default: 5 minutes) */
  staleTime?: number;
}

/**
 * Hook return type
 */
export interface UseVKProductReturn {
  /** Product detail */
  product: ProductDetail | null;
  /** Related products */
  relatedProducts: RelatedProduct[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching (background refresh) */
  isFetching: boolean;
  /** Refetch */
  refetch: () => void;
}

/**
 * Hook for fetching a single VK product by slug
 */
export function useVKProduct(options: UseVKProductOptions): UseVKProductReturn {
  const { slug, enabled = true, staleTime = 5 * 60 * 1000 } = options;

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: productQueryKeys.bySlug(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: enabled && Boolean(slug),
    staleTime,
  });

  const product = useMemo<ProductDetail | null>(() => {
    if (!data?.product) return null;
    return vkProductToDetail(data.product);
  }, [data]);

  const relatedProducts = useMemo<RelatedProduct[]>(() => {
    if (!data?.related) return [];
    return vkProductsToRelated(data.related);
  }, [data]);

  return {
    product,
    relatedProducts,
    isLoading,
    error: error as Error | null,
    isFetching,
    refetch,
  };
}

export default useVKProduct;

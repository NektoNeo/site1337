/**
 * VK to Catalog Adapter
 * Transforms VK Market products to catalog display format with parsed specs
 */

import { VKProduct, VKProductImage } from '@/types/vk-product';
import {
  CatalogProduct,
  CatalogProductSpecs,
  PlatformBadge,
  CatalogCategory,
  toCatalogProduct,
} from '@/types/catalog';
import { VKMarketAlbum } from '@/types/vk';

// ============================================
// SPEC EXTRACTION PATTERNS
// ============================================

/**
 * CPU extraction patterns (Intel and AMD)
 */
const CPU_PATTERNS = [
  // Intel patterns
  /Intel\s+Core\s+i[3579]-?\d{4,5}[A-Z]*/gi,
  /Core\s+i[3579]-?\d{4,5}[A-Z]*/gi,
  /i[3579]-?\d{4,5}[A-Z]*/gi,
  // AMD patterns
  /AMD\s+Ryzen\s+[3579]\s+\d{4}[A-Z]*/gi,
  /Ryzen\s+[3579]\s+\d{4}[A-Z]*/gi,
  /Ryzen\s+[3579]\s+PRO\s+\d{4}[A-Z]*/gi,
  // Threadripper
  /AMD\s+Threadripper\s+\d{4}[A-Z]*/gi,
  /Threadripper\s+\d{4}[A-Z]*/gi,
  // Generic
  /CPU[:\s]+([^\n,]+)/i,
  /Процессор[:\s]+([^\n,]+)/i,
];

/**
 * GPU extraction patterns (NVIDIA and AMD)
 */
const GPU_PATTERNS = [
  // NVIDIA RTX 40 series
  /GeForce\s+RTX\s+40[6789]0(?:\s+Ti)?(?:\s+SUPER)?/gi,
  /RTX\s+40[6789]0(?:\s+Ti)?(?:\s+SUPER)?/gi,
  // NVIDIA RTX 30 series
  /GeForce\s+RTX\s+30[6789]0(?:\s+Ti)?/gi,
  /RTX\s+30[6789]0(?:\s+Ti)?/gi,
  // AMD RX 7000 series
  /Radeon\s+RX\s+7[689]00(?:\s+XT)?(?:\s+XTX)?/gi,
  /RX\s+7[689]00(?:\s+XT)?(?:\s+XTX)?/gi,
  // AMD RX 6000 series
  /Radeon\s+RX\s+6[789]00(?:\s+XT)?/gi,
  /RX\s+6[789]00(?:\s+XT)?/gi,
  // Generic
  /GPU[:\s]+([^\n,]+)/i,
  /Видеокарта[:\s]+([^\n,]+)/i,
];

/**
 * RAM extraction patterns
 */
const RAM_PATTERNS = [
  // With DDR specification
  /(\d{1,3})\s*(?:GB|ГБ)\s+DDR[45]/gi,
  /DDR[45]\s+(\d{1,3})\s*(?:GB|ГБ)/gi,
  // Without DDR specification
  /RAM[:\s]+(\d{1,3})\s*(?:GB|ГБ)/gi,
  /ОЗУ[:\s]+(\d{1,3})\s*(?:GB|ГБ)/gi,
  /Оперативная\s+память[:\s]+(\d{1,3})\s*(?:GB|ГБ)/gi,
  // Just size with GB/ГБ
  /(\d{1,3})\s*(?:GB|ГБ)\s+(?:RAM|ОЗУ)/gi,
];

/**
 * SSD extraction patterns
 */
const SSD_PATTERNS = [
  // NVMe SSD
  /SSD\s+NVMe\s+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  /NVMe\s+SSD\s+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  /NVMe\s+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  // M.2 SSD
  /M\.2\s+SSD\s+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  /M\.2\s+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  // Generic SSD
  /SSD[:\s]+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  /Накопитель[:\s]+(\d+)\s*(?:GB|TB|ГБ|ТБ)/gi,
  /(\d+)\s*(?:GB|TB|ГБ|ТБ)\s+SSD/gi,
];

/**
 * Motherboard extraction patterns
 */
const MOTHERBOARD_PATTERNS = [
  /(?:Материнская\s+плата|Motherboard)[:\s]+([^\n,]+)/i,
  /(?:MB|М\.П\.)[:\s]+([^\n,]+)/i,
  /(ASUS|MSI|Gigabyte|ASRock)\s+[A-Z]\d{3}[^\n,]*/gi,
];

/**
 * PSU extraction patterns
 */
const PSU_PATTERNS = [
  /(?:БП|PSU|Блок\s+питания)[:\s]+(\d+)\s*(?:W|Вт)/gi,
  /(\d+)\s*(?:W|Вт)\s+(?:БП|PSU)/gi,
];

/**
 * Cooling extraction patterns
 */
const COOLING_PATTERNS = [
  /(?:Охлаждение|Cooling|Кулер)[:\s]+([^\n,]+)/i,
  /(?:СВО|AIO|Water\s+Cooling)[:\s]+([^\n,]+)/i,
];

// ============================================
// EXTRACTION FUNCTIONS
// ============================================

/**
 * Extract first match from text using patterns
 */
function extractFirstMatch(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // If pattern has a capture group, return that, otherwise return full match
      return match[1]?.trim() || match[0].trim();
    }
  }
  return null;
}

/**
 * Format RAM size (normalize to GB format)
 */
function formatRamSize(value: string | null): string | null {
  if (!value) return null;

  const sizeMatch = value.match(/(\d{1,3})/);
  if (sizeMatch) {
    return `${sizeMatch[1]} GB`;
  }
  return value;
}

/**
 * Format SSD size (normalize format)
 */
function formatSsdSize(value: string | null): string | null {
  if (!value) return null;

  const match = value.match(/(\d+)\s*(GB|TB|ГБ|ТБ)/i);
  if (match) {
    const size = parseInt(match[1]);
    const unit = match[2].toUpperCase();

    // Convert ГБ/ТБ to GB/TB
    if (unit === 'ГБ') return `${size} GB`;
    if (unit === 'ТБ') return `${size} TB`;

    return `${size} ${unit}`;
  }
  return value;
}

/**
 * Extract specifications from product description
 */
export function extractSpecs(description: string): CatalogProductSpecs {
  const normalizedDesc = description
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ');

  return {
    cpu: extractFirstMatch(normalizedDesc, CPU_PATTERNS),
    gpu: extractFirstMatch(normalizedDesc, GPU_PATTERNS),
    ram: formatRamSize(extractFirstMatch(normalizedDesc, RAM_PATTERNS)),
    ssd: formatSsdSize(extractFirstMatch(normalizedDesc, SSD_PATTERNS)),
    motherboard: extractFirstMatch(normalizedDesc, MOTHERBOARD_PATTERNS),
    psu: extractFirstMatch(normalizedDesc, PSU_PATTERNS),
    cooling: extractFirstMatch(normalizedDesc, COOLING_PATTERNS),
  };
}

/**
 * Determine platform badge from specs
 */
export function getPlatformBadge(specs: CatalogProductSpecs): PlatformBadge {
  const cpu = specs.cpu?.toLowerCase() || '';
  const gpu = specs.gpu?.toLowerCase() || '';

  // Check CPU platform first
  if (cpu.includes('ryzen') || cpu.includes('amd') || cpu.includes('threadripper')) {
    return 'AMD';
  }
  if (cpu.includes('intel') || cpu.includes('core i')) {
    return 'Intel';
  }

  // Check GPU as fallback
  if (gpu.includes('radeon') || gpu.includes('rx ')) {
    return 'AMD';
  }
  if (gpu.includes('geforce') || gpu.includes('rtx') || gpu.includes('nvidia')) {
    return 'NVIDIA';
  }

  return null;
}

/**
 * Extract badges from title and description
 */
export function extractBadges(title: string, description: string, hasDiscount: boolean): string[] {
  const badges: string[] = [];
  const text = `${title} ${description}`.toLowerCase();

  // Check for discount badge
  if (hasDiscount) {
    badges.push('SALE');
  }

  // Check for TOP/HIT badge
  if (text.includes('хит') || text.includes('топ') || text.includes('популярн')) {
    badges.push('TOP');
  }

  // Check for NEW badge
  if (text.includes('новинк') || text.includes('new')) {
    badges.push('NEW');
  }

  // Check for PRO/PREMIUM badge
  if (text.includes('premium') || text.includes('премиум') || text.includes('pro ')) {
    badges.push('PRO');
  }

  return badges;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string, id: string): string {
  const slugified = title
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => {
      const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      const en = ['a','b','v','g','d','e','yo','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','shch','','y','','e','yu','ya'];
      const index = ru.indexOf(char.toLowerCase());
      return index >= 0 ? en[index] : char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);

  return `${slugified}-${id}`;
}

// ============================================
// MAIN TRANSFORM FUNCTION
// ============================================

/**
 * Enhance VKProduct with parsed specs and additional fields for VKProductCard
 * Uses the existing toCatalogProduct function and adds extra fields
 */
export function enhanceVKProduct(vkProduct: VKProduct): CatalogProduct {
  // Use the existing transformer first
  const catalogProduct = toCatalogProduct(vkProduct);

  // Extract specs from description
  const specs = extractSpecs(vkProduct.description);

  // Determine platform badge
  const platformBadge = getPlatformBadge(specs);

  // Extract additional badges
  const hasDiscount = vkProduct.price.hasDiscount;
  const badges = extractBadges(vkProduct.title, vkProduct.description, hasDiscount);

  // Add NEW badge if product is new
  if (catalogProduct.isNew && !badges.includes('NEW')) {
    badges.unshift('NEW');
  }

  // Generate slug if not present
  const slug = vkProduct.slug || generateSlug(vkProduct.title, vkProduct.id);

  // Determine stock status
  const inStock = vkProduct.availability === 'in_stock';

  // Return enhanced product
  return {
    ...catalogProduct,
    specs,
    platformBadge,
    badges,
    formattedPrice: catalogProduct.displayPrice,
    formattedOriginalPrice: catalogProduct.displayOriginalPrice,
    hasDiscount,
    inStock,
    productUrl: `/product/${slug}`,
    categoryName: vkProduct.category.name,
  };
}

/**
 * Transform multiple VK products with enhancement
 */
export function enhanceVKProducts(vkProducts: VKProduct[]): CatalogProduct[] {
  return vkProducts.map(enhanceVKProduct);
}

/**
 * Transform VK album to catalog category
 */
export function transformVKAlbum(album: VKMarketAlbum): CatalogCategory {
  return {
    id: String(album.id),
    name: album.title,
    slug: album.title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-+|-+$/g, ''),
    description: undefined,
    imageUrl: album.photo?.sizes?.find(s => s.type === 'x')?.url,
    productCount: album.count,
    isMain: album.is_main || false,
  };
}

/**
 * Transform multiple VK albums to catalog categories
 */
export function transformVKAlbums(albums: VKMarketAlbum[]): CatalogCategory[] {
  return albums
    .filter(album => !album.is_hidden)
    .map(transformVKAlbum);
}

// Legacy exports for backwards compatibility
export const transformVKProduct = enhanceVKProduct;
export const transformVKProducts = enhanceVKProducts;

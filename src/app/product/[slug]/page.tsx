'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ProductImageGallery,
  ProductInfo,
  SpecificationsTable,
  RelatedProducts,
} from '@/components/product';
import { ProductDetail, RelatedProduct } from '@/types/product';

// Mock data for demonstration - in production this would come from API/database
const mockProduct: ProductDetail = {
  id: 'vapc-phantom-x1',
  slug: 'phantom-x1-gaming-pc',
  name: 'VA-PC Phantom X1',
  shortDescription:
    'Ultimate gaming powerhouse built for competitive esports and AAA gaming. Featuring cutting-edge Intel 13th Gen processor and NVIDIA RTX 4070 Ti for uncompromising performance.',
  price: 189990,
  originalPrice: 219990,
  currency: 'RUB',
  inStock: true,
  images: [
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
      alt: 'VA-PC Phantom X1 Front View',
      isMain: true,
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
      alt: 'VA-PC Phantom X1 RGB Lighting',
    },
    {
      id: 'img-3',
      url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
      alt: 'VA-PC Phantom X1 Side Panel',
    },
    {
      id: 'img-4',
      url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',
      alt: 'VA-PC Phantom X1 Interior',
    },
  ],
  badges: [
    { id: 'cpu', label: 'Processor', value: 'Intel Core i5-13400F', icon: 'cpu' },
    { id: 'gpu', label: 'Graphics', value: 'RTX 4070 Ti 12GB', icon: 'gpu' },
    { id: 'ram', label: 'Memory', value: '32GB DDR5-5600', icon: 'ram' },
    { id: 'storage', label: 'Storage', value: '1TB NVMe SSD', icon: 'storage' },
    { id: 'cooling', label: 'Cooling', value: 'Tower Air Cooler', icon: 'cooling' },
    { id: 'psu', label: 'Power', value: '750W 80+ Gold', icon: 'psu' },
  ],
  features: [
    { id: 'warranty', text: '2 Years Warranty', included: true },
    { id: 'windows', text: 'Windows 11 Pro', included: true },
    { id: 'drivers', text: 'All Drivers Installed', included: true },
    { id: 'office', text: 'Microsoft Office 365', included: true },
    { id: 'rgb', text: 'RGB Lighting Software', included: true },
    { id: 'support', text: 'Lifetime Tech Support', included: true },
  ],
  specifications: [
    {
      category: 'Processor',
      specs: [
        { label: 'Model', value: 'Intel Core i5-13400F' },
        { label: 'Cores / Threads', value: '10 Cores / 16 Threads' },
        { label: 'Base Clock', value: '2.5 GHz' },
        { label: 'Boost Clock', value: 'Up to 4.6 GHz' },
        { label: 'Cache', value: '20MB Intel Smart Cache' },
        { label: 'TDP', value: '65W' },
      ],
    },
    {
      category: 'Graphics Card',
      specs: [
        { label: 'Model', value: 'NVIDIA GeForce RTX 4070 Ti' },
        { label: 'VRAM', value: '12GB GDDR6X' },
        { label: 'Memory Bus', value: '192-bit' },
        { label: 'CUDA Cores', value: '7680' },
        { label: 'Ray Tracing Cores', value: '3rd Generation' },
        { label: 'DLSS', value: 'DLSS 3.0 Support' },
      ],
    },
    {
      category: 'Memory',
      specs: [
        { label: 'Capacity', value: '32GB (2x16GB)' },
        { label: 'Type', value: 'DDR5' },
        { label: 'Speed', value: '5600 MHz' },
        { label: 'Latency', value: 'CL36' },
        { label: 'XMP Profile', value: 'Intel XMP 3.0' },
      ],
    },
    {
      category: 'Storage',
      specs: [
        { label: 'Primary Drive', value: '1TB NVMe M.2 SSD' },
        { label: 'Interface', value: 'PCIe 4.0 x4' },
        { label: 'Read Speed', value: 'Up to 7,000 MB/s' },
        { label: 'Write Speed', value: 'Up to 5,300 MB/s' },
        { label: 'Additional Slots', value: '2x M.2, 4x SATA' },
      ],
    },
    {
      category: 'Motherboard',
      specs: [
        { label: 'Chipset', value: 'Intel B760' },
        { label: 'Form Factor', value: 'ATX' },
        { label: 'RAM Slots', value: '4x DDR5' },
        { label: 'Max Memory', value: '128GB' },
        { label: 'PCIe Slots', value: '1x PCIe 5.0 x16, 2x PCIe 4.0 x1' },
        { label: 'Networking', value: '2.5GbE LAN, WiFi 6' },
      ],
    },
    {
      category: 'Power Supply',
      specs: [
        { label: 'Wattage', value: '750W' },
        { label: 'Efficiency', value: '80+ Gold' },
        { label: 'Modularity', value: 'Fully Modular' },
        { label: 'Fan Size', value: '120mm' },
        { label: 'Protection', value: 'OVP, UVP, SCP, OPP, OTP' },
      ],
    },
    {
      category: 'Case',
      specs: [
        { label: 'Model', value: 'VA-PC Custom Phantom' },
        { label: 'Type', value: 'Mid-Tower ATX' },
        { label: 'Side Panel', value: 'Tempered Glass' },
        { label: 'Included Fans', value: '4x 120mm ARGB' },
        { label: 'Front I/O', value: 'USB 3.2, USB-C, Audio' },
        { label: 'Dimensions', value: '450 x 210 x 480mm' },
      ],
    },
    {
      category: 'Included Software',
      specs: [
        { label: 'Operating System', value: 'Windows 11 Pro (Licensed)' },
        { label: 'Drivers', value: 'All Latest Drivers Pre-installed' },
        { label: 'RGB Control', value: 'Unified RGB Software' },
        { label: 'Monitoring', value: 'Hardware Monitor Suite' },
        { label: 'Security', value: 'Windows Defender Configured' },
      ],
    },
  ],
};

const mockRelatedProducts: RelatedProduct[] = [
  {
    id: 'vapc-storm-s1',
    slug: 'storm-s1-gaming-pc',
    name: 'VA-PC Storm S1',
    price: 149990,
    originalPrice: 169990,
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80',
    badges: ['RTX 4060 Ti', 'i5-13400F', '16GB DDR5'],
  },
  {
    id: 'vapc-titan-t1',
    slug: 'titan-t1-gaming-pc',
    name: 'VA-PC Titan T1',
    price: 289990,
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80',
    badges: ['RTX 4080', 'i7-13700K', '64GB DDR5'],
  },
  {
    id: 'vapc-nova-n1',
    slug: 'nova-n1-gaming-pc',
    name: 'VA-PC Nova N1',
    price: 99990,
    originalPrice: 119990,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80',
    badges: ['RTX 4060', 'i5-12400F', '16GB DDR4'],
  },
  {
    id: 'vapc-apex-a1',
    slug: 'apex-a1-gaming-pc',
    name: 'VA-PC Apex A1',
    price: 449990,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80',
    badges: ['RTX 4090', 'i9-13900K', '128GB DDR5'],
  },
  {
    id: 'vapc-volt-v1',
    slug: 'volt-v1-gaming-pc',
    name: 'VA-PC Volt V1',
    price: 129990,
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80',
    badges: ['RTX 4060', 'Ryzen 5 7600', '32GB DDR5'],
  },
];

// Background effects component
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Purple glow top-left */}
      <motion.div 
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Cyan glow bottom-right */}
      <motion.div 
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px]"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // In production, fetch product by slug
  const product = mockProduct;
  const relatedProducts = mockRelatedProducts;

  const handleOrder = () => {
    // Handle order action
    console.log('Order clicked for:', product.id);
  };

  const handleAddToCart = () => {
    // Handle add to cart
    console.log('Added to cart:', product.id);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Ambient Background Effects */}
      <BackgroundEffects />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-6">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm"
          >
            <Link href="/" className="text-white/50 hover:text-white transition-colors">
              Главная
            </Link>
            <span className="text-white/30">/</span>
            <Link href="/catalog" className="text-white/50 hover:text-white transition-colors">
              Каталог
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-purple-400 font-medium">{product.name}</span>
          </motion.nav>
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
            </motion.div>
          </div>

          {/* Specifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SpecificationsTable specifications={product.specifications} />
          </motion.div>

          {/* Related Products */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <RelatedProducts products={relatedProducts} />
          </motion.div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/25 z-50 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}

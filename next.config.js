/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    // Remote image patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // VK API images
      {
        protocol: 'https',
        hostname: '**.userapi.com',
      },
      {
        protocol: 'https',
        hostname: 'sun*.userapi.com',
      },
      {
        protocol: 'https',
        hostname: 'pp.userapi.com',
      },
      {
        protocol: 'https',
        hostname: 'vk.com',
      },
      {
        protocol: 'https',
        hostname: '**.vk.com',
      },
      // CDN images
      {
        protocol: 'https',
        hostname: 'cdn.va-pc.ru',
      },
    ],
    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for next/image
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Minimum cache TTL for optimized images (30 days for better caching)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Note: placeholder is configured per-image in next/image component, not globally
    // Allow remote image optimization
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports for tree-shaking
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'motion/react',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
    // Turbopack is enabled via --turbopack flag at runtime, not in config
  },

  // Modular imports for better tree-shaking of lucide-react icons
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Enable gzip/brotli compression
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Strict mode for React
  reactStrictMode: true,

  // Powered by header removal
  poweredByHeader: false,

  // Configure headers for caching
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API caching with stale-while-revalidate
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

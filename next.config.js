/** @type {import('next').NextConfig} */

// Bundle analyzer configuration (optional dependency)
let withBundleAnalyzer = (config) => config;
try {
  if (process.env.ANALYZE === 'true') {
    withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
  }
} catch (e) {
  // Bundle analyzer not installed - skip
}

const nextConfig = {
  // ============================================
  // OUTPUT MODE: Standalone for Docker/Container
  // ============================================
  // Creates a minimal standalone build with only necessary files
  // Reduces Docker image size by ~70% compared to full node_modules
  output: 'standalone',

  // ============================================
  // IMAGE OPTIMIZATION
  // ============================================
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
    // Minimum cache TTL for optimized images (30 days)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Allow remote image optimization
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    // Optimized package imports for tree-shaking
    // Reduces bundle size by only importing used modules
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
      '@tanstack/react-query',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'embla-carousel-react',
      'firebase',
    ],

    // Partial Prerendering (Next.js 14+)
    // Combines static and dynamic rendering for faster initial load
    // ppr: true, // Enable when ready for production testing
  },

  // ============================================
  // MODULAR IMPORTS FOR TREE-SHAKING
  // ============================================
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // ============================================
  // COMPILER OPTIMIZATIONS
  // ============================================
  compiler: {
    // Remove console.log in production (keep error and warn)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ============================================
  // PERFORMANCE SETTINGS
  // ============================================
  // Enable gzip/brotli compression
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Strict mode for React
  reactStrictMode: true,

  // Powered by header removal (security)
  poweredByHeader: false,

  // ============================================
  // WEBPACK OPTIMIZATIONS
  // ============================================
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        // Split chunks for better caching
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 20,
            },
            // Framework chunk (React, Next.js)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              chunks: 'all',
              enforce: true,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            // UI components chunk
            ui: {
              name: 'ui',
              test: /[\\/]components[\\/]/,
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }

    // Tree-shaking is handled by Next.js automatically in production
    // Don't override usedExports as it conflicts with cacheUnaffected

    return config;
  },

  // ============================================
  // HTTP HEADERS (Caching & Security)
  // ============================================
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Cache static assets aggressively (1 year)
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
        // Cache Next.js static files
        source: '/_next/static/:path*',
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

module.exports = withBundleAnalyzer(nextConfig);

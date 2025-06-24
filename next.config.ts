// next.config.ts - Упрощенная версия без SVG loader
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/shared/config/i18n/i18n.ts',
);

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Оптимизация изображений
  images: {
    domains: ['2.ugdr97aqcjm.xvest3.ru'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 год
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Экспериментальные функции для производительности
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'framer-motion',
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
    optimisticClientCache: true,
    scrollRestoration: true,
  },

  // Webpack оптимизации
  webpack: (config, { isServer }) => {
    // Оптимизация для Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Оптимизация bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Three.js отдельно из-за размера
          three: {
            name: 'three',
            chunks: 'all',
            test: /node_modules\/(three|@react-three|@react-spring)/,
            priority: 30,
          },
          // UI библиотеки
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /node_modules\/(@radix-ui|lucide-react|react-icons)/,
            priority: 25,
          },
          // Общие компоненты
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },

  // Заголовки для кэширования и безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/image',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Перенаправления API (существующие)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://2.ugdr97aqcjm.xvest3.ru/api/:path*',
      },
    ];
  },

  // Компрессия
  compress: true,

  // Настройки для статических файлов
  trailingSlash: false,

  // ESLint конфигурация
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript конфигурация
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);

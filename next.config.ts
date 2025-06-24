// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/shared/config/i18n/i18n.ts',
);

const nextConfig: NextConfig = {
  output: 'standalone', // Для Docker
  reactStrictMode: true,

  // Временно отключаем строгие проверки для сборки
  eslint: {
    ignoreDuringBuilds: false, // Включаем ESLint но с warning'ами
  },
  typescript: {
    ignoreBuildErrors: false, // Строгая проверка TypeScript
  },

  // Оптимизация изображений
  images: {
    domains: ['2.ugdr97aqcjm.xvest3.ru'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 год
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Компрессия
  compress: true,

  // Экспериментальные функции
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
    ],
    // serverComponentsExternalPackages: ['sharp'], // Для Sharp в Docker
  },

  // Webpack оптимизации
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для 3D библиотек
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      };
    }

    // Игнорируем критические warnings для сборки
    config.stats = {
      warnings: false,
    };

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://2.ugdr97aqcjm.xvest3.ru/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/shared/config/i18n/i18n.ts',
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['2.ugdr97aqcjm.xvest3.ru'],
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

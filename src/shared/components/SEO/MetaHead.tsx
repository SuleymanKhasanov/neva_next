// src/shared/components/SEO/MetaHead.tsx
import { Metadata } from 'next';

interface MetaHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  siteName?: string;
}

export function generateMetadata({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url,
  type = 'website',
  locale = 'ru',
  siteName = 'East Telecom',
}: MetaHeadProps): Metadata {
  // Для продуктов используем 'website' вместо 'product'
  const ogType = type === 'product' ? 'website' : type;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.split(',').map((k) => k.trim()),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
      languages: {
        ru: url ? `${url}?lang=ru` : undefined,
        uz: url ? `${url}?lang=uz` : undefined,
        en: url ? `${url}?lang=en` : undefined,
        kr: url ? `${url}?lang=kr` : undefined,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: ogType, // Теперь только 'website' или 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: `@${siteName}`,
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    category: type === 'product' ? 'technology' : undefined,
  };

  // Добавляем специфичные для продукта мета-теги через other
  if (type === 'product') {
    metadata.other = {
      'product:brand': siteName,
      'product:availability': 'in stock',
      'product:condition': 'new',
      'product:price:currency': 'UZS',
    };
  }

  return metadata;
}

// Хук для использования в компонентах
export function useMetaHead(props: MetaHeadProps) {
  return generateMetadata(props);
}

// Базовые мета-теги для сайта
export const siteMetadata: Metadata = {
  metadataBase: new URL('https://easttelecom.uz'),
  title: {
    template: '%s | East Telecom',
    default: 'East Telecom - Телекоммуникационное оборудование',
  },
  description:
    'East Telecom - ведущий поставщик телекоммуникационного оборудования в Узбекистане',
  applicationName: 'East Telecom',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'телекоммуникации',
    'оборудование',
    'Узбекистан',
    'East Telecom',
    'Neva',
    'X-Solution',
  ],
  authors: [{ name: 'East Telecom' }],
  creator: 'East Telecom',
  publisher: 'East Telecom',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_UZ',
    url: 'https://easttelecom.uz',
    siteName: 'East Telecom',
    title: 'East Telecom - Телекоммуникационное оборудование',
    description:
      'Ведущий поставщик телекоммуникационного оборудования в Узбекистане',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'East Telecom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'East Telecom',
    description:
      'Ведущий поставщик телекоммуникационного оборудования в Узбекистане',
    creator: '@easttelecom',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export default generateMetadata;

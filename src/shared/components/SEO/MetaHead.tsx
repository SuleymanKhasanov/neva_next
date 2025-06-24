// src/shared/components/SEO/MetaHead.tsx
import { Metadata } from 'next';
import { Product, Category } from '@/shared/model/types';

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  products?: Product[];
  categories?: Category[];
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/images/og-default.jpg',
  url = '',
  type = 'website',
  locale = 'ru',
}: SEOData): Metadata {
  const siteName = 'East Telecom';
  const fullTitle = title.includes(siteName)
    ? title
    : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'East Telecom' }],
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
    openGraph: {
      title: fullTitle,
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
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@easttelecom',
    },
    alternates: {
      canonical: url,
      languages: {
        ru: `/ru${url}`,
        en: `/en${url}`,
        uz: `/uz${url}`,
        kr: `/kr${url}`,
      },
    },
    other: {
      'format-detection': 'telephone=no',
    },
  };
}

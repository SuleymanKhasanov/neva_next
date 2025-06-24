// src/shared/components/SEO/StructuredData.tsx
import { Product, Category } from '@/shared/model/types';

interface StructuredDataProps {
  data: any;
}

export const StructuredData = ({ data }: StructuredDataProps) => {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
};

// Функция для генерации схемы организации
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'East Telecom',
    url: 'https://easttelecom.uz',
    logo: 'https://easttelecom.uz/logo.png',
    description:
      'Ведущий поставщик телекоммуникационного оборудования в Узбекистане',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UZ',
      addressLocality: 'Tashkent',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+998781500000',
      contactType: 'sales',
    },
    sameAs: [
      'https://t.me/easttelecom',
      'https://instagram.com/easttelecom',
    ],
  };
};

// Функция для генерации схемы каталога продуктов
export const generateProductCatalogSchema = (
  products: Product[],
  categories: Category[],
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'East Telecom Product Catalog',
    description: 'Каталог телекоммуникационного оборудования',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image?.[0],
        brand: {
          '@type': 'Brand',
          name: 'East Telecom',
        },
        category: product.category,
        url: `https://easttelecom.uz/product/${product.slug}`,
      },
    })),
  };
};

// Функция для генерации хлебных крошек
export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>,
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

// Функция для генерации схемы продукта
export const generateProductSchema = (product: Product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'East Telecom',
    },
    category: product.category,
    url: `https://easttelecom.uz/product/${product.slug}`,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'UZS',
      seller: {
        '@type': 'Organization',
        name: 'East Telecom',
      },
    },
  };
};

export default StructuredData;

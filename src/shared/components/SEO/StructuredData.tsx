// src/shared/components/SEO/StructuredData.tsx
interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

// Генератор структурированных данных для организации
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'East Telecom',
    url: 'https://easttelecom.uz',
    logo: 'https://easttelecom.uz/images/logo.png',
    description:
      'Ведущий поставщик IT оборудования и решений в Узбекистане',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UZ',
      addressLocality: 'Ташкент',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+998-78-150-00-00',
      contactType: 'customer service',
      availableLanguage: ['Russian', 'Uzbek', 'English'],
    },
    sameAs: [
      'https://t.me/easttelecom',
      'https://instagram.com/easttelecom',
    ],
  };
}

// Генератор для каталога продуктов
export function generateProductCatalogSchema(
  products: Product[],
  categories: Category[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Каталог IT оборудования East Telecom',
    description:
      'Полный каталог серверного оборудования, сетевых решений и IT продуктов',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        category: product.category,
        image: product.image?.[0]
          ? `/api/image?url=${encodeURIComponent(
              product.image[0],
            )}&w=800&h=600&f=webp`
          : undefined,
        brand: {
          '@type': 'Brand',
          name: 'East Telecom',
        },
        offers: {
          '@type': 'AggregateOffer',
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      },
    })),
  };
}

// Генератор хлебных крошек
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

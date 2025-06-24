// src/shared/components/SEO/StructuredData.tsx
import { Product } from '@/shared/model/types';

interface StructuredDataProps {
  type: 'product' | 'organization' | 'website' | 'breadcrumb';
  data: Product | Organization | Website | BreadcrumbData;
}

interface Organization {
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

interface Website {
  name: string;
  url: string;
  description: string;
}

interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
  }>;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateStructuredData = () => {
    switch (type) {
      case 'product':
        const product = data as Product;
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
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'UZS',
          },
        };

      case 'organization':
        const org = data as Organization;
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: org.name,
          url: org.url,
          logo: org.logo,
          sameAs: org.sameAs,
        };

      case 'website':
        const website = data as Website;
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: website.name,
          url: website.url,
          description: website.description,
        };

      case 'breadcrumb':
        const breadcrumb = data as BreadcrumbData;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumb.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
};

export default StructuredData;

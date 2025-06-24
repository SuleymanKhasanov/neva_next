import { Category, Product } from '@/shared/model/types';
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateProductCatalogSchema,
  StructuredData,
} from './StructuredData';

// src/shared/components/SEO/SchemaWrapper.tsx
interface SchemaWrapperProps {
  products?: Product[];
  categories?: Category[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  children: React.ReactNode;
}

export function SchemaWrapper({
  products,
  categories,
  breadcrumbs,
  children,
}: SchemaWrapperProps) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <StructuredData data={organizationSchema} />

      {products && categories && (
        <StructuredData
          data={generateProductCatalogSchema(products, categories)}
        />
      )}

      {breadcrumbs && (
        <StructuredData
          data={generateBreadcrumbSchema(breadcrumbs)}
        />
      )}

      {children}
    </>
  );
}

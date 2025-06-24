// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { fetchCategories, fetchProducts } from '@/shared/lib/api';
import { locales } from '@/shared/config/i18n/i18n';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://easttelecom.uz';
  const now = new Date();

  // Статические страницы
  const staticPages = ['', '/contacts'];

  // Генерируем URL для всех локалей
  const staticUrls = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: now,
      changeFrequency:
        page === '' ? ('daily' as const) : ('weekly' as const),
      priority: page === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${page}`]),
        ),
      },
    })),
  );

  // Динамические страницы для каждой локали
  const dynamicUrls = [];

  for (const locale of locales) {
    try {
      // Получаем категории и продукты
      const [categories, productData] = await Promise.all([
        fetchCategories(locale),
        fetchProducts(locale),
      ]);

      const products = productData.flatMap(
        (category) => category.products,
      );

      // URL категорий
      const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/${locale}/category/${category.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${baseUrl}/${l}/category/${category.slug}`,
            ]),
          ),
        },
      }));

      // URL продуктов
      const productUrls = products.map((product) => ({
        url: `${baseUrl}/${locale}/product/${product.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              `${baseUrl}/${l}/product/${product.slug}`,
            ]),
          ),
        },
      }));

      dynamicUrls.push(...categoryUrls, ...productUrls);
    } catch (error) {
      console.error(
        `Error generating sitemap for locale ${locale}:`,
        error,
      );
    }
  }

  return [...staticUrls, ...dynamicUrls];
}

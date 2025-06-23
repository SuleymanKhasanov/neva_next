import { HomePage } from '@/pages/home';
import { fetchCategories, fetchProducts } from '@/shared/lib/api';
import { Category, Product } from '@/shared/model/types';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const [productData, categoryData] = await Promise.all([
      fetchProducts(locale || 'en'),
      fetchCategories(locale || 'en'),
    ]);
    products = productData.flatMap((category) => category.products);
    categories = categoryData;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return <HomePage products={products} categories={categories} />;
}

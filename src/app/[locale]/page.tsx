import HomePage from '@/pages/home/page';
import { fetchProducts } from '@/shared/lib/api';

interface Product {
  id: number;
  name: string;
  category_id: string;
  category: string;
  slug: string;
  description: string;
  image: string[];
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Получаем данные на сервере
  let products: Product[] = [];
  try {
    const data = await fetchProducts(locale || 'en');
    products = data.flatMap((category) => category.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  return <HomePage products={products} />;
}

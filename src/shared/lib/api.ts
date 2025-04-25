interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  error: string | null;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string[];
  count: number;
  subcategories: Subcategory[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string[];
  count: number;
  subcategories: Subcategory[];
}

interface Product {
  id: number;
  name: string;
  category_id: string;
  category: string;
  slug: string;
  description: string;
  image: string[];
}

interface ProductCategory {
  id: number;
  name: string;
  description: string;
  image: string[];
  products: Product[];
}

const API_BASE_URL = 'https://2.ugdr97aqcjm.xvest3.ru/api';

export const fetchData = async <T>(
  endpoint: string,
  locale: string,
): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Accept-Language': locale,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result: ApiResponse<T> = await response.json();
    if (!result.status) {
      throw new Error(result.message || 'API request failed');
    }
    return result.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Функция для получения списка категорий
export const fetchCategories = async (
  locale: string,
): Promise<Category[]> => {
  return fetchData<Category[]>('/category-list', locale);
};

// Функция для получения списка продуктов
export const fetchProducts = async (
  locale: string,
): Promise<ProductCategory[]> => {
  return fetchData<ProductCategory[]>('/product-list', locale);
};

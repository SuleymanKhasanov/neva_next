// src/shared/lib/api.ts
import {
  ApiResponse,
  Category,
  ProductCategory,
  Product,
} from '@/shared/model/types';

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
      cache: 'force-cache',
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

export const fetchCategories = async (
  locale: string,
): Promise<Category[]> => {
  return fetchData<Category[]>('/category-list', locale);
};

export const fetchProducts = async (
  locale: string,
): Promise<ProductCategory[]> => {
  return fetchData<ProductCategory[]>('/product-list', locale);
};

// Исправленная функция поиска - GET запрос с query в URL
export const searchProducts = async (
  query: string,
  locale: string,
): Promise<Product[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    // Кодируем query для безопасности URL
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await fetch(
      `${API_BASE_URL}/product/search/${encodedQuery}`,
      {
        method: 'GET',
        headers: {
          'Accept-Language': locale,
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result: ApiResponse<Product[]> = await response.json();

    if (!result.status) {
      throw new Error(result.message || 'Search failed');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

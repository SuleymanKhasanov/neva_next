export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  error: string | null;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string[];
  count: number;
  subcategories: Subcategory[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string[];
  count: number;
  subcategories: Subcategory[];
}

export interface Product {
  id: number;
  name: string;
  category_id: string;
  category: string;
  slug: string;
  description: string;
  image: string[];
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  image: string[];
  products: Product[];
}

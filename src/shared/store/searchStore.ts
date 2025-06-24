import { create } from 'zustand';
import { Product } from '@/shared/model/types';
import { searchProducts as apiSearchProducts } from '@/shared/lib/api';

interface SearchStore {
  searchQuery: string;
  searchResults: Product[];
  isLoading: boolean;
  error: string | null;

  setQuery: (query: string) => void;
  clearSearch: () => void;
  searchProducts: (query: string, locale: string) => Promise<void>;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  error: null,

  setQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      error: null,
    });
  },

  searchProducts: async (query: string, locale: string) => {
    if (!query.trim()) {
      get().clearSearch();
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const results = await apiSearchProducts(query.trim(), locale);
      set({
        searchResults: results,
        isLoading: false,
      });
    } catch (error) {
      console.error('Search error:', error);
      set({
        searchResults: [],
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Ошибка поиска',
      });
    }
  },
}));

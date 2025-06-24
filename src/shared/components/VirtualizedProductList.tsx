// src/shared/components/VirtualizedProductList.tsx
import { useMemo, useState, useEffect } from 'react';
import { Product } from '@/shared/model/types';
import { ProductCard } from '@/features/ProductCard';

interface VirtualizedProductListProps {
  products: Product[];
  itemsPerPage?: number;
  searchQuery?: string;
}

interface VirtualizedItem {
  index: number;
  product: Product;
}

const VirtualizedProductList = ({
  products,
  itemsPerPage = 20,
  searchQuery = '',
}: VirtualizedProductListProps) => {
  const [visibleItems, setVisibleItems] = useState<VirtualizedItem[]>(
    [],
  );
  const [page, setPage] = useState(0);

  // Фильтрация продуктов по поисковому запросу
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  // Виртуализация - показываем только видимые элементы
  const virtualizedItems = useMemo(() => {
    const startIndex = page * itemsPerPage;
    const endIndex = Math.min(
      startIndex + itemsPerPage,
      filteredProducts.length,
    );

    return filteredProducts
      .slice(startIndex, endIndex)
      .map((product, index) => ({
        index: startIndex + index,
        product,
      }));
  }, [filteredProducts, page, itemsPerPage]);

  // Обновляем видимые элементы
  useEffect(() => {
    setVisibleItems(virtualizedItems);
  }, [virtualizedItems]);

  // Сброс страницы при изменении поискового запроса
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const hasNextPage =
    (page + 1) * itemsPerPage < filteredProducts.length;
  const hasPrevPage = page > 0;

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          {searchQuery
            ? 'Продукты не найдены'
            : 'Нет доступных продуктов'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Список продуктов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleItems.map(({ product }) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Пагинация */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={!hasPrevPage}
            className="px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Предыдущая
          </button>

          <span className="text-sm text-muted-foreground">
            Страница {page + 1} из{' '}
            {Math.ceil(filteredProducts.length / itemsPerPage)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualizedProductList;

import { FixedSizeList as List } from 'react-window';
import { useMemo } from 'react';
import { Product } from '@/shared/model/types';
import { ProductCardWithSuspense } from './LazyComponents';

interface VirtualizedProductListProps {
  products: Product[];
  itemHeight: number;
  containerHeight: number;
}

export function VirtualizedProductList({
  products,
  itemHeight = 400,
  containerHeight = 600,
}: VirtualizedProductListProps) {
  const itemData = useMemo(() => ({ products }), [products]);

  const Item = ({ index, style, data }: any) => (
    <div style={style}>
      <ProductCardWithSuspense product={data.products[index]} />
    </div>
  );

  return (
    <List
      height={containerHeight}
      itemCount={products.length}
      itemSize={itemHeight}
      itemData={itemData}
      overscanCount={2} // Предзагружаем 2 элемента сверху и снизу
    >
      {Item}
    </List>
  );
}

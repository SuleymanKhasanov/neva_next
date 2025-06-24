// src/shared/components/LazyComponents.tsx
import { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';

// Правильная типизация для lazy компонентов
export const LazyLanyard = lazy(
  () => import('@/widgets/Lanyard/Lanyard'),
);

export const LazyAccordionMenu = lazy(
  () =>
    import('@/features/AccordionMenu/ui/InteractiveAccordionMenu'),
);

export const LazyProductCard = lazy(
  () => import('@/features/ProductCard/ui/ProductCard'),
);

// Типы для пропсов
interface AccordionMenuProps {
  isMenuOpen: boolean;
  categories: any[]; // Замените на правильный тип Category[]
}

interface ProductCardProps {
  product: any; // Замените на правильный тип Product
}

// Компоненты-обертки с Suspense
export function LanyardWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      }
    >
      <LazyLanyard />
    </Suspense>
  );
}

export function AccordionMenuWithSuspense(props: AccordionMenuProps) {
  return (
    <Suspense
      fallback={
        <div className="h-32 w-full">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      }
    >
      <LazyAccordionMenu {...props} />
    </Suspense>
  );
}

export function ProductCardWithSuspense(props: ProductCardProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96">
          <Skeleton className="w-full h-64 mb-4 rounded-lg" />
          <Skeleton className="w-3/4 h-4 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      }
    >
      <LazyProductCard {...props} />
    </Suspense>
  );
}

// src/components/VirtualizedProductList.tsx
import {
  FixedSizeList as List,
  ListChildComponentProps,
} from 'react-window';
import { useMemo } from 'react';
import { Product } from '@/shared/model/types';

interface VirtualizedProductListProps {
  products: Product[];
  itemHeight?: number;
  containerHeight?: number;
}

interface ItemData {
  products: Product[];
}

export function VirtualizedProductList({
  products,
  itemHeight = 400,
  containerHeight = 600,
}: VirtualizedProductListProps) {
  const itemData = useMemo(
    (): ItemData => ({ products }),
    [products],
  );

  const Item = ({
    index,
    style,
    data,
  }: ListChildComponentProps<ItemData>) => (
    <div style={style}>
      <ProductCardWithSuspense product={data.products[index]} />
    </div>
  );

  return (
    <List<ItemData>
      height={containerHeight}
      itemCount={products.length}
      itemSize={itemHeight}
      itemData={itemData}
      overscanCount={2}
    >
      {Item}
    </List>
  );
}

// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

type UseIntersectionObserverReturn = [
  RefObject<HTMLDivElement>,
  boolean,
];

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverProps = {}): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        if (isElementIntersecting && !hasTriggered) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(isElementIntersecting);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [elementRef, isIntersecting];
}

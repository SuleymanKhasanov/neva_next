// src/shared/components/LazyComponents.tsx
import { lazy, Suspense, ReactNode } from 'react';

// Определяем типы для компонентов
interface LazyComponentProps {
  [key: string]: unknown;
}

// Ленивые компоненты
const LazyLanyard = lazy(() => import('@/widgets/Lanyard/Lanyard'));
const LazyBand = lazy(() => import('@/entities/Band/ui/Band'));

// Wrapper компоненты с Suspense
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const LazyWrapper = ({
  children,
  fallback = <div>Loading...</div>,
}: LazyWrapperProps) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

// Экспортируемые ленивые компоненты
export const LanyardLazy = (props: LazyComponentProps) => (
  <LazyWrapper>
    <LazyLanyard {...props} />
  </LazyWrapper>
);

export const BandLazy = (props: LazyComponentProps) => (
  <LazyWrapper>
    <LazyBand {...props} />
  </LazyWrapper>
);

export default LazyWrapper;

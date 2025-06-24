// src/shared/lib/imageUtils.tsx
interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Создает URL для оптимизированного изображения
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: OptimizeImageOptions = {},
): string => {
  const { width = 800, height = 600, quality = 80 } = options;

  // Если изображение уже локальное или оптимизированное, возвращаем как есть
  if (
    originalUrl.startsWith('/') ||
    originalUrl.includes('/api/image')
  ) {
    return originalUrl;
  }

  const params = new URLSearchParams({
    url: originalUrl,
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
  });

  return `/api/image?${params.toString()}`;
};

/**
 * Предзагружает изображения для кэширования
 */
export const preloadImages = async (
  urls: string[],
): Promise<void> => {
  try {
    await fetch('/api/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });
  } catch (error) {
    console.warn('Failed to preload images:', error);
  }
};

/**
 * Хук для оптимизированных изображений
 */
export const useOptimizedImages = () => {
  const optimizeImage = (
    url: string,
    options?: OptimizeImageOptions,
  ) => {
    return getOptimizedImageUrl(url, options);
  };

  const optimizeImages = (
    urls: string[],
    options?: OptimizeImageOptions,
  ) => {
    return urls.map((url) => optimizeImage(url, options));
  };

  return {
    optimizeImage,
    optimizeImages,
    preloadImages,
  };
};

/**
 * Компонент OptimizedImage для замены стандартного Image
 */
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string; // Делаем alt обязательным
  fallbackSrc?: string;
  optimizeOptions?: OptimizeImageOptions;
}

export const OptimizedImage = ({
  src,
  alt,
  fallbackSrc,
  optimizeOptions = {},
  ...props
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(
    getOptimizedImageUrl(src, optimizeOptions),
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      // Fallback к оригинальному изображению
      setImgSrc(src);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          ...props.style,
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'inherit',
          }}
        >
          <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        </div>
      )}
    </div>
  );
};

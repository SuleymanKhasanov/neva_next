// src/shared/components/SimpleOptimizedImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface SimpleOptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  enableWebP?: boolean;
}

export const SimpleOptimizedImage = ({
  src,
  targetWidth = 800,
  targetHeight = 600,
  quality = 80,
  enableWebP = true,
  alt, // Явно извлекаем alt для ESLint
  ...imageProps
}: SimpleOptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const mounted = useRef(true);

  // Создание URL через API
  const createOptimizedUrl = (originalUrl: string) => {
    if (
      originalUrl.startsWith('/') ||
      originalUrl.startsWith('data:')
    ) {
      return originalUrl;
    }

    const params = new URLSearchParams({
      url: originalUrl,
      w: targetWidth.toString(),
      h: targetHeight.toString(),
      q: quality.toString(),
    });

    return `/api/image?${params.toString()}`;
  };

  // Оптимизация изображения через Canvas
  const optimizeWithCanvas = async (
    imageUrl: string,
  ): Promise<string> => {
    if (!enableWebP || typeof window === 'undefined') {
      return imageUrl;
    }

    try {
      setIsOptimizing(true);

      // Проверяем поддержку WebP
      const canvas = document.createElement('canvas');
      const supportsWebP =
        canvas.toDataURL('image/webp').indexOf('data:image/webp') ===
        0;

      if (!supportsWebP) {
        return imageUrl;
      }

      // Загружаем изображение
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch');

      const blob = await response.blob();

      // Создаем изображение
      const img = new window.Image();
      img.crossOrigin = 'anonymous';

      return new Promise((resolve) => {
        img.onload = () => {
          try {
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(imageUrl);
              return;
            }

            // Вычисляем размеры с сохранением пропорций
            const aspectRatio = img.width / img.height;
            let newWidth = targetWidth;
            let newHeight = targetHeight;

            if (targetWidth / targetHeight > aspectRatio) {
              newWidth = Math.round(targetHeight * aspectRatio);
            } else {
              newHeight = Math.round(targetWidth / aspectRatio);
            }

            // Устанавливаем размеры и рисуем
            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Конвертируем в WebP
            const webpDataUrl = canvas.toDataURL(
              'image/webp',
              quality / 100,
            );
            resolve(webpDataUrl);
          } catch {
            // Если ошибка при обработке, возвращаем оригинальный URL
            resolve(imageUrl);
          }
        };

        img.onerror = () => resolve(imageUrl);
        img.src = URL.createObjectURL(blob);
      });
    } catch {
      // Если ошибка при загрузке, возвращаем оригинальный URL
      console.warn('Image optimization failed');
      return imageUrl;
    } finally {
      setIsOptimizing(false);
    }
  };

  // Эффект оптимизации
  useEffect(() => {
    if (!mounted.current) return;

    const processImage = async () => {
      try {
        setIsLoading(true);

        // Создаем URL через API
        const apiUrl = createOptimizedUrl(src);

        // Оптимизируем через Canvas если включено
        if (enableWebP && !src.startsWith('data:')) {
          const optimizedSrc = await optimizeWithCanvas(apiUrl);
          if (mounted.current) {
            setImageSrc(optimizedSrc);
          }
        } else {
          setImageSrc(apiUrl);
        }
      } catch {
        // Если ошибка при обработке, используем оригинальный src
        console.error('Image processing failed');
        setImageSrc(src);
      }
    };

    processImage();

    return () => {
      mounted.current = false;
    };
  }, [src, targetWidth, targetHeight, quality, enableWebP]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setImageSrc(src); // Fallback к оригиналу
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Image
        {...imageProps}
        src={imageSrc}
        alt={alt || ''} // Явно указываем alt с fallback
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...imageProps.style,
          opacity: isLoading || isOptimizing ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Простой индикатор загрузки */}
      {(isLoading || isOptimizing) && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '24px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            zIndex: 1,
          }}
          role="status"
          aria-label="Загрузка изображения"
        />
      )}

      {/* CSS для анимации */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

// Хук для предзагрузки
export const useImagePreloader = () => {
  const preloadImages = async (urls: string[]) => {
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/api/image?url=${encodeURIComponent(url)}`;
      document.head.appendChild(link);
    });
  };

  return { preloadImages };
};

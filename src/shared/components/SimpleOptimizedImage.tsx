// src/shared/components/SimpleOptimizedImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

interface SimpleOptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
}

export const SimpleOptimizedImage = ({
  src,
  alt,
  targetWidth = 800,
  targetHeight = 600,
  quality = 80,
  ...imageProps
}: SimpleOptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);

  // Создание URL через API
  const createOptimizedUrl = useCallback(
    (originalUrl: string) => {
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
    },
    [targetWidth, targetHeight, quality],
  );

  // Эффект оптимизации
  useEffect(() => {
    if (!mounted.current) return;

    const processImage = async () => {
      try {
        setIsLoading(true);

        // Просто используем API URL без клиентской оптимизации
        const apiUrl = createOptimizedUrl(src);
        setImageSrc(apiUrl);
      } catch {
        setImageSrc(src);
      }
    };

    processImage();

    return () => {
      mounted.current = false;
    };
  }, [src, createOptimizedUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setImageSrc(src);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Image
        {...imageProps}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...imageProps.style,
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Простой индикатор загрузки без анимации */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            border: '2px solid #ddd',
            borderTop: '2px solid #666',
            borderRadius: '50%',
            zIndex: 1,
          }}
          className="animate-spin"
        />
      )}
    </div>
  );
};

// Простой хук для предзагрузки
export const useImagePreloader = () => {
  const preloadImages = (urls: string[]) => {
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/api/image?url=${encodeURIComponent(url)}`;
      document.head.appendChild(link);
    });
  };

  return { preloadImages };
};

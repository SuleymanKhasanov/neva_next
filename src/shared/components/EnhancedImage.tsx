// src/shared/components/EnhancedImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useCallback } from 'react';

interface EnhancedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  fallbackSrc?: string;
}

export const EnhancedImage = ({
  src,
  alt,
  targetWidth = 800,
  targetHeight = 600,
  quality = 80,
  fallbackSrc,
  ...imageProps
}: EnhancedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Создание оптимизированного URL
  const createOptimizedUrl = useCallback(
    (originalUrl: string) => {
      if (
        originalUrl.startsWith('/') ||
        originalUrl.startsWith('data:') ||
        originalUrl.includes('/api/image')
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

  // Обработка изменения src
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    const optimizedUrl = createOptimizedUrl(src);
    setImageSrc(optimizedUrl);
  }, [src, createOptimizedUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else if (imageSrc !== src) {
      // Пробуем оригинальный URL
      setImageSrc(src);
    }
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

      {/* Индикатор загрузки */}
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

      {/* Индикатор ошибки */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 0, 0, 0.1)',
            padding: '8px',
            borderRadius: '4px',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: '12px', color: '#666' }}>
            Ошибка загрузки
          </span>
        </div>
      )}
    </div>
  );
};

export default EnhancedImage;

// src/shared/components/EnhancedImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface EnhancedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  priority?: boolean;
  lazy?: boolean;
  formats?: ('avif' | 'webp' | 'jpeg')[];
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const EnhancedImage = ({
  src,
  targetWidth = 800,
  targetHeight = 600,
  quality = 80,
  priority = false,
  lazy = true,
  formats = ['avif', 'webp', 'jpeg'],
  alt,
  placeholder = 'blur',
  blurDataURL,
  ...imageProps
}: EnhancedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazy || priority);

  // Создание оптимизированных URL для разных форматов
  const createOptimizedUrl = (
    originalUrl: string,
    format: string = 'webp',
  ) => {
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
      f: format,
    });

    return `/api/image?${params.toString()}`;
  };

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Начинаем загрузку за 100px до появления
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Выбор лучшего формата на основе поддержки браузера
  useEffect(() => {
    if (!isInView) return;

    const getBestFormat = async () => {
      // Проверяем поддержку AVIF
      if (formats.includes('avif')) {
        try {
          const avifSupported = await checkFormatSupport('avif');
          if (avifSupported) {
            setImageSrc(createOptimizedUrl(src, 'avif'));
            return;
          }
        } catch {}
      }

      // Проверяем поддержку WebP
      if (formats.includes('webp')) {
        try {
          const webpSupported = await checkFormatSupport('webp');
          if (webpSupported) {
            setImageSrc(createOptimizedUrl(src, 'webp'));
            return;
          }
        } catch {}
      }

      // Fallback к JPEG
      setImageSrc(createOptimizedUrl(src, 'jpeg'));
    };

    getBestFormat();
  }, [src, isInView, formats, targetWidth, targetHeight, quality]);

  // Проверка поддержки формата браузером
  const checkFormatSupport = (format: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width === 1 && img.height === 1);
      img.onerror = () => resolve(false);

      const testImages = {
        webp: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
      };

      img.src = testImages[format as keyof typeof testImages] || '';
    });
  };

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    // Fallback к оригинальному изображению
    setImageSrc(src);
  };

  // Генерация placeholder blur
  const defaultBlurDataURL =
    blurDataURL ||
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  if (!isInView) {
    return (
      <div
        ref={imgRef}
        style={{
          width: imageProps.width || targetWidth,
          height: imageProps.height || targetHeight,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'inherit',
        }}
        className={imageProps.className}
      >
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {imageSrc && (
        <Image
          {...imageProps}
          ref={imgRef}
          src={imageSrc}
          alt={alt || ''}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={
            placeholder === 'blur' ? defaultBlurDataURL : undefined
          }
          quality={75} // Next.js будет использовать наш API
          style={{
            ...imageProps.style,
            opacity: isLoading ? 0.7 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Индикатор загрузки */}
      {isLoading && !error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Индикатор ошибки */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '12px',
          }}
        >
          Ошибка загрузки
        </div>
      )}
    </div>
  );
};

// Хук для массовой предзагрузки изображений
export const useImagePreloader = () => {
  const preloadImages = async (
    urls: string[],
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    },
  ) => {
    const {
      width = 400,
      height = 300,
      quality = 60,
      format = 'webp',
    } = options || {};

    const preloadPromises = urls.map((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = `/api/image?url=${encodeURIComponent(
        url,
      )}&w=${width}&h=${height}&q=${quality}&f=${format}`;
      document.head.appendChild(link);

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Не блокируем на ошибках
        img.src = link.href;
      });
    });

    await Promise.allSettled(preloadPromises);
  };

  return { preloadImages };
};

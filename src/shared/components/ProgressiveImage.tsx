import { useState, useEffect } from 'react';
import { EnhancedImage } from '@/shared/components/EnhancedImage';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height,
  className,
  priority = false,
}: ProgressiveImageProps) {
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);
  const [elementRef, isInView] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Генерируем low-quality версию если не предоставлена
  const lowQualityUrl =
    lowQualitySrc ||
    `/api/image?url=${encodeURIComponent(src)}&w=${Math.floor(
      width / 4,
    )}&h=${Math.floor(height / 4)}&q=20&f=webp`;

  const highQualityUrl = `/api/image?url=${encodeURIComponent(
    src,
  )}&w=${width}&h=${height}&q=80&f=webp`;

  useEffect(() => {
    if (isInView || priority) {
      // Предзагружаем high-quality версию
      const img = new Image();
      img.onload = () => setHighQualityLoaded(true);
      img.src = highQualityUrl;
    }
  }, [isInView, priority, highQualityUrl]);

  return (
    <div ref={elementRef} className={className}>
      {!highQualityLoaded && (isInView || priority) && (
        <EnhancedImage
          src={lowQualityUrl}
          alt={alt}
          width={width}
          height={height}
          style={{
            filter: 'blur(5px)',
            transition: 'filter 0.3s ease',
          }}
          priority={priority}
        />
      )}

      {(highQualityLoaded || priority) && (
        <EnhancedImage
          src={highQualityUrl}
          alt={alt}
          width={width}
          height={height}
          style={{
            opacity: highQualityLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          priority={priority}
        />
      )}
    </div>
  );
}

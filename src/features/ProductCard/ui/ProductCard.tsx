// src/features/ProductCard/ui/ProductCard.tsx
'use client';

import { Card, CardContent, CardDescription } from '@/shared/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/shared/ui/drawer';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';
import { LuPhone } from 'react-icons/lu';
import {
  SimpleOptimizedImage,
  useImagePreloader,
} from '@/shared/components/SimpleOptimizedImage';
import styles from './ProductCard.module.css';

interface Product {
  id: number;
  name: string;
  category_id: string;
  category: string;
  slug: string;
  description: string | null;
  image: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const { preloadImages } = useImagePreloader();

  // Предзагружаем изображения
  useEffect(() => {
    if (product.image && product.image.length > 0) {
      preloadImages(product.image);
    }
  }, [product.image, preloadImages]);

  // Функция для обрезки текста
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 3D эффект при наведении
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const tiltX = (centerY - mouseY) / centerY;
    const tiltY = (mouseX - centerX) / centerX;

    const maxTilt = 5;
    setTilt({
      x: Math.max(-maxTilt, Math.min(maxTilt, tiltX * maxTilt)),
      y: Math.max(-maxTilt, Math.min(maxTilt, tiltY * maxTilt)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const t = useTranslations('card');

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  // Навигация по изображениям
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.image.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.image.length - 1 : prev - 1,
    );
  };

  return (
    <>
      <Card className={styles.card} ref={cardRef}>
        <CardContent className={styles.cardContent}>
          <div
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <SimpleOptimizedImage
              src={product.image[0]}
              alt={product.name}
              width={300}
              height={250}
              className={styles.productImage}
              targetWidth={400}
              targetHeight={300}
              quality={85}
              enableWebP={true}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>

          <div className={styles.productInfo}>
            <p className={styles.productTag}>#{product.slug}</p>
            <h3 className={styles.productName}>{product.name}</h3>
            <CardDescription className={styles.productDescription}>
              {truncateText(product.description, 80)}
            </CardDescription>
          </div>

          <div className={styles.moreBtnWrapper}>
            <Button
              onClick={handleButtonClick}
              className={styles.moreButton}
            >
              {t(TranslationKeys.CardButton)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drawer с изображениями */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className={styles.drawerContent}>
          <div className={styles.grabber} />
          <div className={styles.drawerContainer}>
            <div className={styles.drawerBody}>
              <div className={styles.drawerImageWrapper}>
                <DrawerTitle className={styles.drawerTitle}>
                  {product.name}
                </DrawerTitle>

                <div style={{ position: 'relative' }}>
                  <SimpleOptimizedImage
                    src={product.image[currentImageIndex]}
                    alt={`${product.name} - изображение ${
                      currentImageIndex + 1
                    }`}
                    width={400}
                    height={300}
                    className={styles.drawerImage}
                    targetWidth={600}
                    targetHeight={400}
                    quality={90}
                    enableWebP={true}
                    priority={true}
                  />

                  {/* Навигация по изображениям */}
                  {product.image.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        →
                      </button>

                      {/* Индикаторы */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        {product.image.map((_, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setCurrentImageIndex(index)
                            }
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              border: 'none',
                              background:
                                index === currentImageIndex
                                  ? 'white'
                                  : 'rgba(255,255,255,0.5)',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.drawerDescription}>
                <DrawerDescription>#{product.slug}</DrawerDescription>
                <p>
                  {product.description ||
                    'Описание товара недоступно'}
                </p>
                <a href="tel:+998781500000">
                  <Button className={styles.callUsBtn}>
                    <LuPhone />
                    {t(TranslationKeys.CallUs)}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProductCard;

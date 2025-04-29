'use client';

import { Card, CardContent, CardDescription } from '@/shared/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from '@/shared/ui/drawer';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { useState, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';
import { LuPhone } from 'react-icons/lu';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Состояние для Drawer
  const cardRef = useRef<HTMLDivElement>(null);

  // Функция для обрезки текста
  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Обработчик движения мыши
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Вычисляем угол наклона в зависимости от положения мыши
    const tiltX = (centerY - mouseY) / centerY; // Наклон по оси X
    const tiltY = (mouseX - centerX) / centerX; // Наклон по оси Y

    // Ограничиваем угол наклона (например, ±5 градусов)
    const maxTilt = 5;
    setTilt({
      x: Math.max(-maxTilt, Math.min(maxTilt, tiltX * maxTilt)),
      y: Math.max(-maxTilt, Math.min(maxTilt, tiltY * maxTilt)),
    });
  };

  // Сбрасываем наклон при уходе мыши
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const t = useTranslations('card');

  // Открываем Drawer при клике на кнопку
  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Card className={styles.card} ref={cardRef}>
        <CardContent className={styles.cardContent}>
          <Image
            src={product.image[0]}
            alt={product.name}
            width={300}
            height={150}
            className={styles.productImage}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          />
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

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className={styles.drawerContent}>
          <div className={styles.drawerContainer}>
            <div className={styles.drawerBody}>
              <div className={styles.drawerImageWrapper}>
                <DrawerTitle className={styles.drawerTitle}>
                  {product.name}
                </DrawerTitle>
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  width={300}
                  height={150}
                  className={styles.drawerImage}
                />
              </div>
              <div className={styles.drawerDescription}>
                <DrawerDescription>#{product.slug}</DrawerDescription>
                <p>
                  {product.description || 'No description available'}
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

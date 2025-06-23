'use client';

import { useState } from 'react';
import { ContentBox } from '@/entities/ContentBox';
import { Header } from '@/widgets/Header';
import { InteractiveAccordionMenu } from '@/features/AccordionMenu'; // Используем новый компонент
import { ProductCard } from '@/features/ProductCard';
import { Product, Category } from '@/shared/model/types';
import { CategoryIcons } from '../assets/categoryIcons';
import { LuServer } from 'react-icons/lu';
import styles from './HomePage.module.css';

import FloatingContactButton from '@/features/FloatingContactButton/ui/FloatingContactButton';

interface HomePageProps {
  products: Product[];
  categories: Category[];
}

export default function HomePage({
  products,
  categories,
}: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const groupedProducts = products.reduce((acc, product) => {
    const categoryId = product.category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        products: [],
        categoryName: product.category,
      };
    }
    acc[categoryId].products.push(product);
    return acc;
  }, {} as Record<string, { products: Product[]; categoryName: string }>);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <InteractiveAccordionMenu
        isMenuOpen={isMenuOpen}
        categories={categories}
      />
      <ContentBox>
        <div className={styles.sections}>
          {Object.entries(groupedProducts).map(
            ([
              categoryId,
              { products: categoryProducts, categoryName },
            ]) => (
              <div key={categoryId} className={styles.section}>
                <div className={styles.sectionHeader}>
                  {CategoryIcons[categoryId] ? (
                    <span className={styles.sectionIcon}>
                      {CategoryIcons[categoryId]}
                    </span>
                  ) : (
                    <LuServer className={styles.sectionIcon} />
                  )}
                  <h2 className={styles.sectionTitle}>
                    {categoryName}
                  </h2>
                </div>
                <div className={styles.productList}>
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </ContentBox>
      <div className={styles.bottomGlessBar}>
        <FloatingContactButton />
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { fetchCategories } from '@/shared/lib/api';
import styles from './AccordionMenu.module.css';
import Image from 'next/image';
import purpleLiquid from '@/shared/assets/gif/purple-liquid.gif';
import blueLiquid from '@/shared/assets/gif/blue-liquid.gif';
import { LuArrowRight, LuArrowLeft } from 'react-icons/lu';
import { Button } from '@/shared/ui/button';
import { useLocale } from 'next-intl';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string[];
  count: number;
  subcategories: Subcategory[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string[];
  count: number;
  subcategories: Subcategory[];
}

interface AccordionMenuProps {
  isMenuOpen: boolean;
}

const AccordionMenu = ({ isMenuOpen }: AccordionMenuProps) => {
  const locale = useLocale(); // Получаем текущий язык
  const [nevaCategories, setNevaCategories] = useState<Category[]>(
    [],
  );
  const [xSolutionCategories, setXSolutionCategories] = useState<
    Category[]
  >([]);
  const [activeSection, setActiveSection] = useState<
    'Neva' | 'X-Solution'
  >('Neva');

  // Запрос к API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(locale); // Передаём текущий язык
        const neva =
          data.find((category) => category.name === 'Neva')
            ?.subcategories || [];
        const xSolution =
          data.find((category) => category.name === 'X-Solution')
            ?.subcategories || [];
        setNevaCategories(neva);
        setXSolutionCategories(xSolution);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [locale]); // Зависимость от locale, чтобы обновлять данные при смене языка

  // Функция для переключения секции
  const toggleSection = () => {
    setActiveSection(
      activeSection === 'Neva' ? 'X-Solution' : 'Neva',
    );
  };
  return (
    <div
      className={`${styles.accordionContainer} ${
        isMenuOpen ? styles.open : styles.closed
      }`}
    >
      <div
        className={`${styles.section} ${
          activeSection === 'Neva' ? styles.active : styles.hidden
        }`}
      >
        <div className={styles.menuTitleWrapper}>
          <div className={styles.sectionTitleWrapper}>
            <h2>Neva</h2>
            <Image
              src={purpleLiquid}
              alt=""
              className={styles.purpleLiquid}
            />
          </div>
          <Button
            className={styles.toggleButton}
            onClick={toggleSection}
            variant="secondary"
          >
            X-Solution <LuArrowRight className={styles.toggleIcon} />
          </Button>
        </div>

        <Accordion
          type="single"
          collapsible
          className={styles.accordion}
        >
          {nevaCategories.map((category) => (
            <AccordionItem
              key={category.id}
              value={`neva-${category.id}`}
            >
              <AccordionTrigger>{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className={styles.subcategoryColumn}>
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className={styles.subcategory}
                    >
                      <h4>{subcategory.name}</h4>
                      {subcategory.subcategories.length > 0 && (
                        <ul>
                          {subcategory.subcategories.map(
                            (subSubcategory) => (
                              <li key={subSubcategory.id}>
                                {subSubcategory.name.split(',')}
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div
        className={`${styles.section} ${
          activeSection === 'X-Solution'
            ? styles.active
            : styles.hidden
        }`}
      >
        <div className={styles.menuTitleWrapper}>
          <div className={styles.sectionTitleWrapper}>
            <h2>X-Solution</h2>
            <Image
              src={blueLiquid}
              alt=""
              className={styles.purpleLiquid}
            />
          </div>
          <Button
            className={styles.toggleButton}
            onClick={toggleSection}
            variant="secondary"
          >
            <LuArrowLeft className={styles.toggleIcon} />
            Neva
          </Button>
        </div>
        <Accordion
          type="single"
          collapsible
          className={styles.accordion}
        >
          {xSolutionCategories.map((category) => (
            <AccordionItem
              key={category.id}
              value={`x-solution-${category.id}`}
            >
              <AccordionTrigger>{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className={styles.subcategoryColumn}>
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className={styles.subcategory}
                    >
                      <h4>{subcategory.name}</h4>
                      {subcategory.subcategories.length > 0 && (
                        <ul>
                          {subcategory.subcategories.map(
                            (subSubcategory) => (
                              <li key={subSubcategory.id}>
                                {subSubcategory.name}
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default AccordionMenu;

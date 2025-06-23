import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { Category } from '@/shared/model/types';
import purpleLiquid from '@/shared/assets/gif/purple-liquid.gif';
import blueLiquid from '@/shared/assets/gif/blue-liquid.gif';
import { LuArrowRight, LuArrowLeft } from 'react-icons/lu';
import styles from './AccordionMenu.module.css';

interface AccordionMenuProps {
  isMenuOpen: boolean;
  categories: Category[] | null | undefined;
  activeSection?: 'Neva' | 'X-Solution';
  toggleSection?: () => void;
}

export default function AccordionMenu({
  isMenuOpen = false,
  categories,
  activeSection = 'Neva',
  toggleSection = () => {},
}: AccordionMenuProps) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  const nevaCategories =
    safeCategories.find((category) => category.name === 'Neva')
      ?.subcategories || [];
  const xSolutionCategories =
    safeCategories.find((category) => category.name === 'X-Solution')
      ?.subcategories || [];

  console.log(nevaCategories);
  console.log(xSolutionCategories);

  return (
    <div
      className={`${styles.accordionContainer} ${
        isMenuOpen ? styles.open : styles.closed
      }`}
    >
      <div
        className={`${styles.section} ${styles.nevaSection} ${
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
            variant="secondary"
            onClick={toggleSection}
          >
            X-Solution <LuArrowRight className={styles.toggleIcon} />
          </Button>
        </div>
        <Accordion
          type="single"
          collapsible
          className={styles.accordion}
        >
          {nevaCategories.length > 0 ? (
            nevaCategories.map((category) => (
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
            ))
          ) : (
            <p>No Neva categories available</p>
          )}
        </Accordion>
      </div>
      <div
        className={`${styles.section} ${styles.xSolutionSection} ${
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
            variant="secondary"
            onClick={toggleSection}
          >
            <LuArrowLeft className={styles.toggleIcon} /> Neva
          </Button>
        </div>
        <Accordion
          type="single"
          collapsible
          className={styles.accordion}
        >
          {xSolutionCategories.length > 0 ? (
            xSolutionCategories.map((category) => (
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
            ))
          ) : (
            <p>No X-Solution categories available</p>
          )}
        </Accordion>
      </div>
    </div>
  );
}

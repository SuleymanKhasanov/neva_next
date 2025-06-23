'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ContentBox } from '@/entities/ContentBox';
import { Header } from '@/widgets/Header';
import Lanyard from '@/widgets/Lanyard/Lanyard';
import { InteractiveAccordionMenu } from '@/features/AccordionMenu';
import { Category } from '@/shared/model/types';
import { fetchCategories } from '@/shared/lib/api';

interface ContactsProps {
  categories?: Category[];
  locale?: string;
}

const Contacts = ({
  categories: initialCategories = [],
  locale: initialLocale = 'ru',
}: ContactsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] =
    useState<Category[]>(initialCategories);
  const currentLocale = useLocale() || initialLocale;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('Loading categories for locale:', currentLocale);
        const data = await fetchCategories(currentLocale);
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [currentLocale]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <InteractiveAccordionMenu
        isMenuOpen={isMenuOpen}
        categories={categories}
      />
      <ContentBox>
        <Lanyard />
      </ContentBox>
    </>
  );
};

export default Contacts;

export async function getStaticProps({ locale }: { locale: string }) {
  try {
    const categories = await fetchCategories(locale);
    return {
      props: {
        categories,
        locale,
      },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
        locale,
      },
    };
  }
}

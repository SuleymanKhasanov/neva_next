'use client';

import { useState } from 'react';
import { ContentBox } from '@/entities/ContentBox';
import { Header } from '@/widgets/Header';
import { AccordionMenu } from '@/features/AccordionMenu';
import { ProductCard } from '@/features/ProductCard';
import styles from './HomePage.module.css';
import {
  LuLaptop,
  LuMonitor,
  LuServer,
  LuPrinter,
  LuMouse,
  LuPenTool,
  LuArmchair,
  LuHardDrive,
  LuVideo,
  LuPackage,
  LuShield,
  LuFolder,
  LuFile,
  LuPen,
  LuScissors,
  LuTerminal,
  LuLayers2,
  LuPaperclip,
} from 'react-icons/lu';
import { ContactWithUsBtn } from '@/features/ContactWithUsBtn';

interface Product {
  id: number;
  name: string;
  category_id: string;
  category: string;
  slug: string;
  description: string | null;
  image: string[];
}

interface HomePageProps {
  products: Product[];
}

// Маппинг category_id на иконки
const categoryIcons: Record<string, React.ReactNode> = {
  '12': <LuServer className={styles.sectionIcon} />, // Servers
  '14': <LuMonitor className={styles.sectionIcon} />, // Monoblocks, Monitors, Laptops
  '15': <LuServer className={styles.sectionIcon} />, // Servers
  '16': <LuHardDrive className={styles.sectionIcon} />, // Data storage system
  '17': <LuVideo className={styles.sectionIcon} />, // CCTV
  '18': <LuPackage className={styles.sectionIcon} />, // Accessories
  '19': <LuServer className={styles.sectionIcon} />, // Servers
  '20': <LuHardDrive className={styles.sectionIcon} />, // Data storage system
  '21': <LuServer className={styles.sectionIcon} />, // HCI
  '22': <LuShield className={styles.sectionIcon} />, // Servers, Firewall, Switch
  '23': <LuHardDrive className={styles.sectionIcon} />, // Data storage system
  '24': <LuShield className={styles.sectionIcon} />, // Firewall
  '25': <LuTerminal className={styles.sectionIcon} />, // Software
  '26': <LuTerminal className={styles.sectionIcon} />, // Software
  '36': <LuLaptop className={styles.sectionIcon} />, // Asus, Lenovo, Acer, HP
  '37': <LuLaptop className={styles.sectionIcon} />, // Acer, HP, Lenovo, Dell
  '38': <LuLaptop className={styles.sectionIcon} />, // Asus, Huawei, Lenovo
  '39': <LuLaptop className={styles.sectionIcon} />, // Lenovo, HP
  '40': <LuPrinter className={styles.sectionIcon} />, // Hp, Canon, Epson
  '41': <LuMouse className={styles.sectionIcon} />, // Rapoo, Genius
  '42': <LuLayers2 className={styles.sectionIcon} />, // Paper napkins
  '43': <LuLayers2 className={styles.sectionIcon} />, // Wet Wipes
  '44': <LuLayers2 className={styles.sectionIcon} />, // Universal Wipes
  '45': <LuLayers2 className={styles.sectionIcon} />, // Paper Towels
  '46': <LuLayers2 className={styles.sectionIcon} />, // Toilet Paper
  '47': <LuArmchair className={styles.sectionIcon} />, // Office Desks
  '48': <LuArmchair className={styles.sectionIcon} />, // Office Chairs
  '49': <LuArmchair className={styles.sectionIcon} />, // Office Cabinets
  '50': <LuArmchair className={styles.sectionIcon} />, // Office Pedestals
  '51': <LuFile className={styles.sectionIcon} />, // Organizers
  '52': <LuFile className={styles.sectionIcon} />, // Storage Trays
  '53': <LuFile className={styles.sectionIcon} />, // Planners
  '54': <LuPen className={styles.sectionIcon} />, // Staplers and Staples
  '55': <LuScissors className={styles.sectionIcon} />, // Utility Knives
  '56': <LuPaperclip className={styles.sectionIcon} />, // Paper Clips, Clamps
  '57': <LuFolder className={styles.sectionIcon} />, // Boards, Name Tags, Folders
  '58': <LuPenTool className={styles.sectionIcon} />, // Pens
  '59': <LuPenTool className={styles.sectionIcon} />, // Pencils, Markers
  '60': <LuFolder className={styles.sectionIcon} />, // Folders, File Sheets
};

export default function HomePage({ products }: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Группируем продукты по category_id
  const groupedProducts = products.reduce((acc, product) => {
    const categoryId = product.category_id; // Используем category_id без нормализации
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
      <AccordionMenu isMenuOpen={isMenuOpen} />
      <ContentBox>
        <div className={styles.sections}>
          {Object.entries(groupedProducts).map(
            ([
              categoryId,
              { products: categoryProducts, categoryName },
            ]) => (
              <div key={categoryId} className={styles.section}>
                <div className={styles.sectionHeader}>
                  {categoryIcons[categoryId] || (
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
      <div className={styles.contactWithUsBtn}>
        <ContactWithUsBtn />
      </div>
    </>
  );
}

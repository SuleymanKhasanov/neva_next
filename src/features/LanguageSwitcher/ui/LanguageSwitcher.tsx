'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from '@/entities/Loading/ui/LoadingContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleLanguageChange = (newLocale: string) => {
    setIsLoading(true);
    // Проверяем, существует ли pathname, иначе используем корневой маршрут
    const currentPath = pathname || '/';
    // Заменяем текущую локализацию на новую
    const newPath = currentPath.startsWith(`/${locale}`)
      ? currentPath.replace(`/${locale}`, `/${newLocale}`)
      : `/${newLocale}${currentPath === '/' ? '' : currentPath}`;
    router.push(newPath);
    setTimeout(() => setIsLoading(false), 500); // Задержка для имитации загрузки
  };

  return (
    <Select onValueChange={handleLanguageChange} value={locale}>
      <SelectTrigger className={styles.selectTrigger}>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className={styles.selectContent}>
        <SelectGroup>
          <SelectItem value="ru" className={styles.selectItem}>
            Ru
          </SelectItem>
          <SelectItem value="uz" className={styles.selectItem}>
            Uz
          </SelectItem>
          <SelectItem value="en" className={styles.selectItem}>
            En
          </SelectItem>
          <SelectItem value="kr" className={styles.selectItem}>
            Kr
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;

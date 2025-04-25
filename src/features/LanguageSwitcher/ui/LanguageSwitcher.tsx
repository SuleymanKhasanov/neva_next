'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
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
  const locale = useLocale(); // Получаем текущий язык
  const router = useRouter(); // Хук для навигации
  const { setIsLoading } = useLoading();

  const handleLanguageChange = (newLocale: string) => {
    setIsLoading(true);
    // Перенаправляем на тот же маршрут, но с новым locale
    router.push(`/${newLocale}`);
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

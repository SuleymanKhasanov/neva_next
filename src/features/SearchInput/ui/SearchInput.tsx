'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';
import { LuSearch } from 'react-icons/lu';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  className?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className }, ref) => {
    const t = useTranslations('header');
    const [isMac, setIsMac] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Определяем ОС пользователя
    useEffect(() => {
      const platform = navigator.platform || navigator.userAgent;
      setIsMac(platform.toLowerCase().includes('mac'));
    }, []);

    // Обработчики фокуса и потери фокуса
    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className={styles.searchContainer}>
        <Input
          type="search"
          placeholder={t(TranslationKeys.HeaderSearch)}
          ref={ref}
          className={`${styles.searchInput} ${className || ''}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div className={styles.iconsContainer}>
          {!isFocused && (
            <Badge className={styles.badge}>
              {isMac ? '⌘+K' : 'Ctrl+K'}
            </Badge>
          )}
          <LuSearch className={styles.searchIcon} />
        </div>
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;

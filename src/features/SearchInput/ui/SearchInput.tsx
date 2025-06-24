'use client';

import { useState, useEffect, forwardRef } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';
import { LuSearch } from 'react-icons/lu';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useSearchStore } from '@/shared/store/searchStore';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  className?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className }, ref) => {
    const t = useTranslations('header');
    const locale = useLocale();
    const [isMac, setIsMac] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // Store actions
    const { setQuery, clearSearch, searchProducts } =
      useSearchStore();

    // Debounce значение на 300ms
    const debouncedSearchValue = useDebounce(searchValue, 300);

    // Определяем ОС пользователя
    useEffect(() => {
      const platform = navigator.platform || navigator.userAgent;
      setIsMac(platform.toLowerCase().includes('mac'));
    }, []);

    // Выполняем поиск при изменении debounced значения
    useEffect(() => {
      setQuery(debouncedSearchValue);

      if (debouncedSearchValue.trim()) {
        searchProducts(debouncedSearchValue.trim(), locale);
      } else {
        clearSearch();
      }
    }, [
      debouncedSearchValue,
      locale,
      setQuery,
      searchProducts,
      clearSearch,
    ]);

    // Обработчики фокуса и потери фокуса
    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    };

    return (
      <div className={styles.searchContainer}>
        <Input
          type="search"
          placeholder={t(TranslationKeys.HeaderSearch)}
          ref={ref}
          value={searchValue}
          onChange={handleChange}
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

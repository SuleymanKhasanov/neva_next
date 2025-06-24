'use client';

import Image from 'next/image';
import lightLogoSrc from '@/shared/assets/icons/est-light-logo.svg';
import darkLogoSrc from '@/shared/assets/icons/est-dark-logo.svg';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/entities/Loading/ui/LoadingContext';
import { TranslationKeys } from '../config/i18n/translations';
import { useEffect, useState } from 'react';

const Logo = () => {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Устанавливаем mounted состояние
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateTheme = () => {
      const isDarkTheme =
        document.documentElement.classList.contains('dark');
      setIsDark(isDarkTheme);
    };

    // Первоначальная установка темы
    updateTheme();

    // Наблюдатель за изменениями класса
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [isMounted]);

  const handleLogoClick = () => {
    setIsLoading(true);
    router.push(`/${locale}`);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Возвращаем светлую тему по умолчанию до монтирования
  if (!isMounted) {
    return (
      <div>
        <button onClick={handleLogoClick} className="cursor-pointer">
          <Image
            src={lightLogoSrc}
            alt={t(TranslationKeys.HeaderLogo)}
            className="w-13 h-13"
            width={52}
            height={52}
            priority
          />
        </button>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      <button onClick={handleLogoClick} className="cursor-pointer">
        <Image
          src={isDark ? darkLogoSrc : lightLogoSrc}
          alt={t(TranslationKeys.HeaderLogo)}
          className="w-13 h-13"
          width={52}
          height={52}
          priority
        />
      </button>
    </div>
  );
};

export default Logo;

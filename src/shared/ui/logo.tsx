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

  useEffect(() => {
    const isDarkTheme =
      document.documentElement.classList.contains('dark');
    setIsDark(isDarkTheme);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const handleLogoClick = () => {
    setIsLoading(true);
    router.push(`/${locale}`);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div>
      <button onClick={handleLogoClick} className="cursor-pointer">
        <Image
          src={isDark ? darkLogoSrc : lightLogoSrc}
          alt={t(TranslationKeys.HeaderLogo)}
          className="w-13 h-13"
          width={52}
          height={52}
        />
      </button>
    </div>
  );
};

export default Logo;

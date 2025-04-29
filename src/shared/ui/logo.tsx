'use client';

import Image from 'next/image';
import lightLogoSrc from '@/shared/assets/icons/est-light-logo.svg';
import darkLogoSrc from '@/shared/assets/icons/est-dark-logo.svg';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '../config/i18n/translations';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Logo = () => {
  const t = useTranslations('header');
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

  return (
    <div>
      <Link href="/">
        <Image
          src={isDark ? darkLogoSrc : lightLogoSrc}
          alt={t(TranslationKeys.HeaderLogo)}
          className="w-13 h-13"
          width={52}
          height={52}
        />
      </Link>
    </div>
  );
};

export default Logo;

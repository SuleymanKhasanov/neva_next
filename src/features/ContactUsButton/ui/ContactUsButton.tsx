'use client';

import { Button } from '@/shared/ui/button';
import { LuPhone } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/entities/Loading/ui/LoadingContext';
import { useTranslations } from 'next-intl';
import styles from './ContactUsButton.module.css';
import { TranslationKeys } from '@/shared/config/i18n/translations';

export default function ContactUsButton() {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const t = useTranslations('contacts');

  const handleClick = () => {
    setIsLoading(true);
    const locale =
      typeof window !== 'undefined'
        ? window.location.pathname.split('/')[1] || 'en'
        : 'en';

    router.push(`/${locale}/contacts`);
    setIsLoading(false);
  };

  return (
    <Button
      className={styles.fluentSubButton}
      variant="outline"
      onClick={handleClick}
    >
      <LuPhone className={styles.buttonIcon} />
      {t(TranslationKeys.ContactsWithUs)}
    </Button>
  );
}

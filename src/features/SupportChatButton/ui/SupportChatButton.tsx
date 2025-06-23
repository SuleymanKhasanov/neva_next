'use client';

import { Button } from '@/shared/ui/button';
import { LuMessageSquare } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';

import styles from './SupportChatButton.module.css';

export default function SupportChatButton() {
  const t = useTranslations('contacts');
  return (
    <Button className={styles.fluentSubButton} variant="outline">
      <LuMessageSquare className={styles.buttonIcon} />
      {t(TranslationKeys.ChatWithSupport)}
    </Button>
  );
}

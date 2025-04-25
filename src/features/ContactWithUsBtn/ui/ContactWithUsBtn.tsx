'use client';
import { Button } from '@/shared/ui/button';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';
import style from './ContactWithUsBtn.module.css';

const ContactWithUsBtn = () => {
  const t = useTranslations('contacts');

  return (
    <Button className={style.contactButton}>
      {t(TranslationKeys.ContactsWithUs)}
    </Button>
  );
};

export default ContactWithUsBtn;

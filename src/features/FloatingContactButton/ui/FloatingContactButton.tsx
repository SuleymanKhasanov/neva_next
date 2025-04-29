// src/widgets/FloatingContactButton/ui/FloatingContactButton.tsx
'use client';

import { useState } from 'react';
import { ContactUsButton } from '@/features/ContactUsButton';
import { SupportChatButton } from '@/features/SupportChatButton';
import Image from 'next/image';
import styles from './FloatingContactButton.module.css';
import flowerIcon from '../assets/flower.svg';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const t = useTranslations('contacts');

  return (
    <div className={styles.buttonContainer}>
      <button
        className={styles.fluentButton}
        onClick={toggleOpen}
        aria-label="Контакты и чат"
      >
        <div
          className={`${styles.iconWrapper} ${
            isOpen ? styles.rotate : ''
          }`}
        >
          <Image
            src={flowerIcon}
            alt="Flower Icon"
            width={24}
            height={24}
            className={styles.icon}
          />
        </div>
        <span className={styles.buttonText}>
          {t(TranslationKeys.ContactsMenu)}
        </span>
      </button>
      <div
        className={`${styles.subButtons} ${
          isOpen ? styles.open : ''
        }`}
      >
        <div className={styles.subButtonWrapper}>
          <ContactUsButton />
        </div>
        <div className={styles.subButtonWrapper}>
          <SupportChatButton />
        </div>
      </div>
    </div>
  );
}

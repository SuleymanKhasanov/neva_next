'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { SearchInput } from '@/features/SearchInput';
import styles from './SearchDrawer.module.css';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDrawer = ({ isOpen, onClose }: SearchDrawerProps) => {
  const controls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Анимация для выезда сверху
  const variants = {
    open: { y: 0, opacity: 1 },
    closed: { y: '-100%', opacity: 0 },
  };

  // Управляем анимацией при изменении isOpen
  useEffect(() => {
    if (isOpen) {
      controls.start('open');
      // Фокусируемся на поле ввода при открытии
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      controls.start('closed');
    }
  }, [isOpen, controls]);

  // Закрытие по клику на пустое место
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className={styles.overlay}
      initial="closed"
      animate={controls}
      variants={variants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onClick={handleOverlayClick}
    >
      <motion.div className={styles.drawer}>
        <SearchInput ref={inputRef} />
      </motion.div>
    </motion.div>
  );
};

export default SearchDrawer;

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { LuMoon, LuSun } from 'react-icons/lu';
import styles from './ThemeToggleButton.module.css';

export default function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);

  // Инициализация темы
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Переключение темы
  const toggleTheme = () => {
    // Добавляем класс перехода
    document.body.classList.add('theme-transition');

    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }

    // Удаляем класс перехода после завершения анимации
    document.body.classList.remove('theme-transition');
  };

  return (
    <Button
      variant="outline"
      className={styles.themeToggleButton}
      onClick={toggleTheme}
    >
      {isDark ? (
        <LuSun className={styles.icon} />
      ) : (
        <LuMoon className={styles.icon} />
      )}
    </Button>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { LanguageSwitcher } from '@/features/LanguageSwitcher';
import { MenuBtn } from '@/features/MenuBtn';
import { SearchInput } from '@/features/SearchInput';
import { SearchDrawer } from '@/entities/SearchDrawer';
import Logo from '@/shared/ui/logo';
import { LuSearch } from 'react-icons/lu';
import styles from './Header.module.css';
import ThemeToggleButton from '@/features/ThemeToggleButton/ui/ThemeToggleButton';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Header({
  isMenuOpen,
  toggleMenu,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent;
    setIsMac(platform.toLowerCase().includes('mac'));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;
      if (isCtrlOrCmd && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        event.stopPropagation();
        if (window.innerWidth <= 768) {
          setIsSearchOpen(true);
        } else if (desktopInputRef.current) {
          desktopInputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, {
      capture: true,
    });
    return () =>
      window.removeEventListener('keydown', handleKeyDown, {
        capture: true,
      });
  }, [isMac]);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className={styles.container}>
      <nav className={styles.navigation}>
        <div className={styles.leftSection}>
          <MenuBtn isMenuOpen={isMenuOpen} onClick={toggleMenu} />
          <Logo />
        </div>
        <div className={styles.searchSection}>
          <SearchInput ref={desktopInputRef} />
          <SearchDrawer
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
        <div className={styles.rightSection}>
          <button
            className={styles.searchButton}
            onClick={toggleSearch}
          >
            <LuSearch className={styles.searchIcon} />
          </button>
          <div className={styles.actions}>
            <ThemeToggleButton />
          </div>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}

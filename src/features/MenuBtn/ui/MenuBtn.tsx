'use client';

import { useTranslations } from 'next-intl';
import { TranslationKeys } from '@/shared/config/i18n/translations';
import { Button } from '@/shared/ui/button';
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from '@/shared/ui/tooltip';
import { TbGridDots, TbX } from 'react-icons/tb';
import styles from './MenuBtn.module.css';

interface MenuBtnProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

const MenuBtn = ({ isMenuOpen, onClick }: MenuBtnProps) => {
  const t = useTranslations('header');
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={styles.btn}
            onClick={() => {
              onClick();
            }}
          >
            {isMenuOpen ? (
              <TbX className={styles.btnIcon} />
            ) : (
              <TbGridDots className={styles.btnIcon} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t(TranslationKeys.HeaderCatalog)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MenuBtn;

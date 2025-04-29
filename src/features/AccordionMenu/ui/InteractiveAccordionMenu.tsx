// src/features/AccordionMenu/ui/InteractiveAccordionMenu.tsx
'use client';

import { useState } from 'react';
import AccordionMenu from './AccordionMenu';
import { Category } from '@/shared/model/types';

interface InteractiveAccordionMenuProps {
  isMenuOpen: boolean;
  categories: Category[];
}

export default function InteractiveAccordionMenu({
  isMenuOpen,
  categories,
}: InteractiveAccordionMenuProps) {
  const [activeSection, setActiveSection] = useState<
    'Neva' | 'X-Solution'
  >('Neva');

  const toggleSection = () => {
    setActiveSection(
      activeSection === 'Neva' ? 'X-Solution' : 'Neva',
    );
  };

  return (
    <AccordionMenu
      isMenuOpen={isMenuOpen}
      categories={categories}
      activeSection={activeSection}
      toggleSection={toggleSection}
    />
  );
}

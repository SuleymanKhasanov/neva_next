'use client';
import { ContentBox } from '@/entities/ContentBox';

import { Header } from '@/widgets/Header';
import Lanyard from '@/widgets/Lanyard/Lanyard';
import { useState } from 'react';

const Contacts = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <ContentBox>
        <Lanyard />
      </ContentBox>
    </>
  );
};

export default Contacts;

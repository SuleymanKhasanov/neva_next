import Image from 'next/image';
import logoSrc from '@/shared/assets/icons/est-light-logo.svg';
import { useTranslations } from 'next-intl';
import { TranslationKeys } from '../config/i18n/translations';

const Logo = () => {
  const t = useTranslations('header');
  return (
    <div>
      <Image
        src={logoSrc}
        alt={t(TranslationKeys.HeaderLogo)}
        className="w-13 h-13"
      />
    </div>
  );
};

export default Logo;

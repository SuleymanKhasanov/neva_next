import { loadTranslations } from './loadTranslations';

export const locales = ['en', 'ru', 'uz', 'kr'] as const;
export type Locale = (typeof locales)[number];

export const localePrefix = 'always';

export async function getRequestConfig({
  locale,
}: {
  locale: string;
}) {
  const validLocale =
    locale && locales.includes(locale as Locale) ? locale : 'en';
  const messages = await loadTranslations(validLocale);
  return {
    locale: validLocale,
    messages,
  };
}

export default getRequestConfig;

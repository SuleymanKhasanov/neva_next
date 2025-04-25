import { Roboto } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import '@/shared/styles/global.css';
import { getRequestConfig } from '@/shared/config/i18n/i18n';
import { LoadingManager } from '@/entities/Loading';
import { LoadingProvider } from '@/entities/Loading/ui/LoadingContext';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-sans',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const { messages } = await getRequestConfig({ locale });

  return (
    <div className={roboto.className}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <LoadingProvider>
          <LoadingManager />
          {children}
        </LoadingProvider>
      </NextIntlClientProvider>
    </div>
  );
}

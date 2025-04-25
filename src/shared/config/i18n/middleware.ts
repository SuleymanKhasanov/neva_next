import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  const locale = locales.find(
    (loc: string) =>
      pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );

  const defaultLocale = 'en';
  if (!locale) {
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
        request.url,
      ),
    );
  }
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|login).*)'],
};

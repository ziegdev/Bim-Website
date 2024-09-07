import {
  NextMiddleware,
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';

import { defaultLocale, locales } from '@/lib/constants';

export type MiddlewareFactory = (
  middleware: NextMiddleware,
) => NextMiddleware;

export const withLocale: MiddlewareFactory = (next) => {
  return async (
    req: NextRequest,
    _next: NextFetchEvent,
  ) => {
    const country = req.geo?.country?.toLowerCase() || 'us';

    const _locale =
      req.headers
        .get('accept-language')
        ?.split(',')?.[0]
        .split('-')[0] || defaultLocale;

    const locale = (locales as unknown as string).includes(
      _locale,
    )
      ? _locale
      : defaultLocale;

    req.headers.set('x-country', country);
    req.headers.set('x-locale', locale);

    const { pathname } = req.nextUrl;
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) ||
        pathname === `/${locale}`,
    );

    if (pathnameHasLocale) return next(req, _next);

    // Redirect if there is no locale
    req.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(req.nextUrl, {
      headers: req.headers,
    });
  };
};

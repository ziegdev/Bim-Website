import { NextResponse } from 'next/server';
import type { MiddlewareFactory } from '@/middleware';
import { locales } from '@/lib/constants';
import { isCrowdfundingActive } from '@/lib/crowdfunding';

export const withCrowdfunding: MiddlewareFactory = (
  next,
) => {
  return async (request, event) => {
    const lang = locales.find(
      (locale) =>
        request.nextUrl.pathname ===
        `/${locale}/crowdfunding`,
    );

    // Run before streaming starts: always return a real HTTP redirect on expiry.
    if (lang && !isCrowdfundingActive()) {
      const destination = request.nextUrl.clone();
      destination.pathname = `/${lang}`;
      const response = NextResponse.redirect(
        destination,
        307,
      );
      response.headers.set(
        'Cache-Control',
        'private, no-store, max-age=0',
      );
      return response;
    }

    return next(request, event);
  };
};

import dynamic from 'next/dynamic';

import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { ReactNode } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { LanguageProvider } from '@/components/LanguageContext';
import { Languages } from '@/lib/types/languages';
import { CookieConsentDialog } from '@/components/CookieConsent';
import { cn } from '@/lib/utils';
import {
  GoogleAnalytics,
  GoogleTagManager,
} from '@next/third-parties/google';
import { siteConfig } from '@/lib/site';
// import {  GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = siteConfig.metadata;
export const viewport = siteConfig.viewport;

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: any;
  params: { lang: Languages };
}) {
  const dict = await getDictionary(lang);
  const shouldHideHeaderFooter =
    children?.metadata?.hideHeaderFooter ?? false;

  return (
    <html lang={lang}>
      <head>
        <link
          rel="icon"
          type="image/jpg"
          href="/favicon.png"
        />
      </head>
      <body
        className={cn(
          'flex min-h-screen flex-col',
          inter.className,
        )}
      >
        <LanguageProvider>
          {!shouldHideHeaderFooter && <Header />}
          {children}
          {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!}/> */}
          <Toaster />
          {!shouldHideHeaderFooter && <Footer />}
          <CookieConsentDialog />
        </LanguageProvider>
      </body>
      <GoogleTagManager gtmId="GTM-NMJ93GV3" />
      <GoogleAnalytics gaId="G-LB46B1GCHH" />
    </html>
  );
}

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'fr' },
    { lang: 'lb' },
    { lang: 'it' },
    { lang: 'es' },
    { lang: 'de' },
    // Add more languages as needed
  ];
}

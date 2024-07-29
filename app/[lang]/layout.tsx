import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(
  () => import('@/components/GoogleAnalytics'),
  { ssr: true },
);

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
// import {  GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BIM - The dating social media',
  description: 'Created by BIM',
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: ReactNode;
  params: { lang: Languages };
}) {
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <link
          rel="icon"
          type="image/jpg"
          href="/favico.png"
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          {children} 
          {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!}/> */}
          <GoogleAnalytics
            GA_MEASUREMENT_ID={
              process.env.NEXT_PUBLIC_GA_ID!
            }
          />
          <Toaster />
          <Footer />
          <CookieConsentDialog />
        </LanguageProvider>
      </body>
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

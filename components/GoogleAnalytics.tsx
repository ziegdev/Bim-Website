'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';
import { checkCookieConsent } from '../lib/cookieConsent';

declare global {
  interface Window {
    gtag: (
      command: string,
      id: string,
      config: object,
    ) => void;
  }
}

function GoogleAnalyticsInner({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  const [consentGiven, setConsentGiven] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setConsentGiven(checkCookieConsent('analytics'));
  }, []);

  useEffect(() => {
    if (consentGiven && typeof window.gtag === 'function') {
      const url = pathname + searchParams.toString();
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [
    pathname,
    searchParams,
    GA_MEASUREMENT_ID,
    consentGiven,
  ]);

  if (!consentGiven) return null;

  return (
    <>
      <Script
        id="google-analytics"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      >
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </Script>
    </>
  );
}

import { Suspense } from 'react';

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner
        GA_MEASUREMENT_ID={GA_MEASUREMENT_ID}
      />
    </Suspense>
  );
}

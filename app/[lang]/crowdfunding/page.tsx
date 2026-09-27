import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CrowdfundingContent from '@/components/crowdfunding/CrowdfundingContent';
import { locales, type LocalesType } from '@/lib/constants';
import {
  crowdfundingCampaign,
  isCrowdfundingActive,
} from '@/lib/crowdfunding';
import { getDictionary } from '@/lib/getDictionary';
import type { Dictionary } from '@/lib/types/dictionary';
import sharingImage from '@/public/images/banner.webp';

// The expiry must be checked after deployment, not frozen at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = { params: { lang: LocalesType } };

const openGraphLocales: Record<LocalesType, string> = {
  en: 'en_GB',
  fr: 'fr_FR',
  de: 'de_DE',
  es: 'es_ES',
  it: 'it_IT',
  lb: 'lb_LU',
};

function checkCampaign(lang: LocalesType) {
  if (!locales.includes(lang)) notFound();
  if (!isCrowdfundingActive()) redirect(`/${lang}`);
}

export async function generateMetadata({
  params: { lang },
}: PageProps): Promise<Metadata> {
  checkCampaign(lang);
  const { crowdfunding }: Dictionary =
    await getDictionary(lang);
  const { title, description, imageAlt } = crowdfunding.seo;
  const canonical = `${crowdfundingCampaign.siteUrl}/${lang}/crowdfunding`;
  const image = {
    url: `${crowdfundingCampaign.siteUrl}${sharingImage.src}`,
    width: sharingImage.width,
    height: sharingImage.height,
    alt: imageAlt,
  };

  return {
    // Bypass the inherited site template, which does not contain a %s slot.
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          locales.map((locale) => [
            locale,
            `${crowdfundingCampaign.siteUrl}/${locale}/crowdfunding`,
          ]),
        ),
        'x-default': `${crowdfundingCampaign.siteUrl}/en/crowdfunding`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'BIM Dating',
      title,
      description,
      url: canonical,
      locale: openGraphLocales[lang],
      alternateLocale: locales
        .filter((locale) => locale !== lang)
        .map((locale) => openGraphLocales[locale]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function CrowdfundingPage({
  params: { lang },
}: PageProps) {
  checkCampaign(lang);
  const { crowdfunding }: Dictionary =
    await getDictionary(lang);
  const closingDate = new Intl.DateTimeFormat(lang, {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date(crowdfundingCampaign.endsAt));

  return (
    <CrowdfundingContent
      lang={lang}
      content={crowdfunding}
      closingDate={closingDate}
    />
  );
}

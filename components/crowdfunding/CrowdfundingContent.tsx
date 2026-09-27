'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { sendGTMEvent } from '@next/third-parties/google';
import {
  ArrowDown,
  Heart,
  ShieldCheck,
  Video,
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ContentSection from '@/components/ContentSection';
import CustomButton from '@/components/CustomButton';
import { typographyVariants } from '@/components/TypographyConfig';
import { cn } from '@/lib/utils';
import { checkCookieConsent } from '@/lib/cookieConsent';
import {
  crowdfundingCampaign,
  isCrowdfundingActive,
} from '@/lib/crowdfunding';
import type { LocalesType } from '@/lib/constants';
import type { CrowdfundingDictionary } from '@/lib/types/dictionary';
import conceptImage from '@/public/images/about-us-our-concept-image.png';
import teamImage from '@/public/images/about-us-images.png';
import heroImage from '@/public/images/about-hero.png';
import heroMobileImage from '@/public/images/about-hero-mobile.png';

const heading = cn(
  typographyVariants({
    variant: 'Bim1',
    className:
      'text-3xl leading-tight text-[#4b0325] sm:text-4xl',
  }),
);
const subheading = cn(
  typographyVariants({
    variant: 'Bim1',
    className:
      'text-left text-xl leading-snug text-[#4b0325] sm:text-2xl',
  }),
);
const body =
  "font-['Bim4-Regular'] text-base leading-relaxed text-[#4b0325] sm:text-lg";
const textLink =
  'underline underline-offset-4 decoration-[#D10062] hover:text-[#D10062] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4';

export default function CrowdfundingContent({
  lang,
  content: c,
  closingDate,
}: {
  lang: LocalesType;
  content: CrowdfundingDictionary;
  closingDate: string;
}) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiry = () => {
      clearTimeout(timer);
      if (!isCrowdfundingActive()) {
        // Also retire tabs left open during the campaign and router-cache entries.
        window.location.replace(
          `/${lang}${window.location.search}`,
        );
        return;
      }
      timer = setTimeout(
        checkExpiry,
        Math.min(
          60_000,
          Date.parse(crowdfundingCampaign.endsAt) -
            Date.now(),
        ),
      );
    };
    checkExpiry();
    window.addEventListener('pageshow', checkExpiry);
    window.addEventListener('focus', checkExpiry);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pageshow', checkExpiry);
      window.removeEventListener('focus', checkExpiry);
    };
  }, [lang]);

  const trackUluleClick = (placement: string) => {
    try {
      if (checkCookieConsent('analytics')) {
        sendGTMEvent({
          event: 'crowdfunding_ulule_click',
          campaign: 'bim_dating_ulule',
          language: lang,
          placement,
          link_url: crowdfundingCampaign.url,
        });
      }
    } catch {
      // Storage/tracking restrictions must never prevent voluntary navigation.
    }
  };

  const cta = (
    placement: string,
    variant: 'primary' | 'tertiary' = 'primary',
  ) => (
    <CustomButton
      href={crowdfundingCampaign.url}
      variant={variant}
      text={c.hero.cta}
      className="w-full sm:w-auto sm:max-w-xl"
      onClick={() => trackUluleClick(placement)}
    />
  );

  return (
    <div className="min-w-0 overflow-x-clip bg-white [overflow-wrap:anywhere]">
      <div className="relative isolate bg-[#4b0325]">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={heroMobileImage.src}
          />
          <img
            src={heroImage.src}
            alt=""
            width={heroImage.width}
            height={heroImage.height}
            fetchPriority="high"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right"
          />
        </picture>
        <div className="absolute inset-0 -z-10 bg-[#4b0325]/35" />
        <HeroSection
          title={c.hero.title}
          description={c.hero.description}
          titleAs="h1"
          animate={false}
        >
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
            {cta('hero')}
            <p className="font-['Bim4-Regular'] text-sm leading-relaxed text-white">
              {c.hero.note}
            </p>
            <p className="font-['Bim4-Regular'] text-sm text-white/90">
              {c.hero.endLabel}{' '}
              <time dateTime={crowdfundingCampaign.endsAt}>
                {closingDate}
              </time>
            </p>
            <a
              href="#bim"
              className="inline-flex items-center gap-2 font-['Bim4-Regular'] text-white underline underline-offset-4"
            >
              {c.hero.learnMore}
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </HeroSection>
      </div>

      <div id="bim" className="scroll-mt-6">
        <ContentSection
          title={c.intro.title}
          description={c.intro.description}
          image={conceptImage.src}
          titleAs="h2"
          truncateDescription={false}
          animate={false}
        />
      </div>

      <section
        className="container py-16 sm:py-24"
        aria-labelledby="difference-title"
      >
        <h2 id="difference-title" className={heading}>
          {c.difference.title}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.difference.items.map((item, index) => {
            const Icon = [Video, Heart, ShieldCheck][
              index % 3
            ];
            return (
              <article
                key={item.title}
                className="min-w-0 rounded-l-3xl rounded-t-3xl bg-[#fbf1ef] p-6 sm:p-8"
              >
                <Icon
                  className="mb-5 h-8 w-8 text-[#D10062]"
                  aria-hidden="true"
                />
                <h3 className={subheading}>{item.title}</h3>
                <p className={cn(body, 'mt-4')}>
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="bg-[#fbf1ef] py-16 sm:py-24"
        aria-labelledby="experience-title"
      >
        <div className="container">
          <h2 id="experience-title" className={heading}>
            {c.experience.title}
          </h2>
          <p
            className={cn(
              body,
              'mx-auto mt-6 max-w-3xl text-center',
            )}
          >
            {c.experience.introduction}
          </p>
          <ol className="mt-10 grid gap-6 lg:grid-cols-3">
            {c.experience.items.map((item, index) => (
              <li
                key={item.title}
                className="min-w-0 rounded-l-3xl rounded-t-3xl bg-white p-6 shadow-sm sm:p-8"
              >
                <span
                  aria-hidden="true"
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 font-['Bim1'] text-xl text-[#4b0325]"
                >
                  {index + 1}
                </span>
                <h3 className={subheading}>{item.title}</h3>
                <p className={cn(body, 'mt-4')}>
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContentSection
        title={c.campaign.title}
        description={c.campaign.description}
        image={teamImage.src}
        reverse
        titleAs="h2"
        truncateDescription={false}
        animate={false}
      />

      <section
        className="container py-16 sm:py-24"
        aria-labelledby="funding-title"
      >
        <h2 id="funding-title" className={heading}>
          {c.funding.title}
        </h2>
        <p
          className={cn(
            body,
            'mx-auto mt-6 max-w-3xl text-center',
          )}
        >
          {c.funding.introduction}
        </p>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {c.funding.items.map((item) => (
            <article
              key={item.title}
              className="min-w-0 rounded-l-3xl rounded-t-3xl border border-[#D10062]/15 p-6 sm:p-8"
            >
              <h3 className={subheading}>{item.title}</h3>
              <p className={cn(body, 'mt-4')}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-xl text-center">
          {cta('funding', 'tertiary')}
        </div>
      </section>

      <section
        className="bg-[#fbf1ef] py-16 sm:py-24"
        aria-labelledby="status-title"
      >
        <div className="container max-w-4xl">
          <h2 id="status-title" className={heading}>
            {c.status.title}
          </h2>
          <p className={cn(body, 'mt-6')}>
            {c.status.description}
          </p>
          <div
            className={cn(
              body,
              'mt-6 flex flex-wrap gap-x-8 gap-y-4',
            )}
          >
            <a
              className={textLink}
              href="https://apps.apple.com/us/app/bim-dating/id6471999521"
            >
              {c.status.appStore}
            </a>
            <a
              className={textLink}
              href="https://play.google.com/store/apps/details?id=com.dazzlecommeet"
            >
              {c.status.googlePlay}
            </a>
          </div>
          <p className={cn(body, 'mt-6')}>
            {c.status.note}
          </p>
        </div>
      </section>

      <section
        className="container py-16 sm:py-24"
        aria-labelledby="trust-title"
      >
        <h2 id="trust-title" className={heading}>
          {c.trust.title}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {c.trust.items.map((item) => (
            <article key={item.title} className="min-w-0">
              <h3 className={subheading}>{item.title}</h3>
              <p className={cn(body, 'mt-4')}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
        <div
          className={cn(
            body,
            'mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4',
          )}
        >
          <Link
            href={`/${lang}/about`}
            className={textLink}
          >
            {c.trust.about}
          </Link>
          <Link
            href={`/${lang}/legal`}
            className={textLink}
          >
            {c.trust.legal}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className={textLink}
          >
            {c.trust.contact}
          </Link>
        </div>
      </section>

      <section
        className="bg-[#fbf1ef] py-16 sm:py-24"
        aria-labelledby="faq-title"
      >
        <div className="container max-w-4xl">
          <h2 id="faq-title" className={heading}>
            {c.faq.title}
          </h2>
          <div className="mt-10 space-y-4">
            {c.faq.items.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl bg-white p-6 open:shadow-sm"
              >
                <summary className="cursor-pointer list-outside pl-1 marker:text-[#D10062] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  <h3 className={cn(subheading, 'inline')}>
                    {item.question}
                  </h3>
                </summary>
                <p className={cn(body, 'mt-4')}>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[#4b0325] py-16 text-center sm:py-24"
        aria-labelledby="final-title"
      >
        <div className="container max-w-4xl">
          <h2
            id="final-title"
            className={cn(heading, 'text-white')}
          >
            {c.final.title}
          </h2>
          <p
            className={cn(
              body,
              'mx-auto my-8 max-w-2xl text-white',
            )}
          >
            {c.final.description}
          </p>
          {cta('final')}
          <p className="mx-auto mt-6 max-w-xl font-['Bim4-Regular'] text-sm leading-relaxed text-white/90">
            {c.final.note}
          </p>
        </div>
      </section>
    </div>
  );
}

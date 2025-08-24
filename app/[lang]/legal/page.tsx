'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import { Typography } from '@/components/Typography';
import pdfPNG from '../../../public/pdf.png';
import { LegalArticles } from '@/lib/bin/LegalData';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';
import Link from 'next/link';
import legalHero from '../../../public/images/legal-hero.png';
import legalHeroMobile from '../../../public/images/legal-hero-mobile.png';
import legalBg from '../../../public/images/legal-bg.png';
import legalBgMobile from '../../../public/images/legal-bg-mobile.png';

const data = [
  {
    title: 'General_terms_and_condtions',
    url: 'general_terms_and_conditions',
  },
  {
    title: 'Privacy_policy',
    url: 'privacy_policy',
  },
  {
    title: 'Ethical_charter',
    url: 'ethical_charter',
  },

  {
    title: 'Dating_safety_tips',
    url: 'dating_safety_tips',
  },
  {
    title: 'Dating_safety_tips',
    url: 'dating_safety_tips',
  },
  {
    title: 'Referral_policy',
    url: 'referral_policy',
  },
];
export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  const [windowWidth, setWindowWidth] = useState<
    number | null
  >(null);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  if (!dict) {
    return null;
  }
  return (
    <div className="min-h-screen">
      <HeroSection
        title={dict.legal.hero.title}
        description={dict.legal.hero.description}
        backgroundImage={legalHero.src}
        backgroundImageMobile={legalHeroMobile.src}
      />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-right"
          style={{
            backgroundImage: `url(${
              windowWidth !== null && windowWidth <= 768
                ? legalBgMobile.src
                : legalBg.src
            })`,
          }}
        />
        <div className="container relative z-10 mx-auto py-16 sm:py-24">
          <Typography
            variant="Bim4Regular"
            className="mb-8 text-justify text-base text-[#4b0325] sm:text-lg"
          >
            {dict.legal.legalNotice.title}
          </Typography>
          <Typography
            variant="Bim4Regular"
            className="text-justify text-base text-[#4b0325] sm:text-lg"
          >
            {dict.legal.legalNotice.description}
          </Typography>
        </div>
      </section>

      <div className="bg-[#F8ECEC] py-16">
        <div className="container mx-auto flex flex-col space-y-12 sm:space-y-16">
          {Array.isArray(LegalArticles) &&
            LegalArticles.map((legalArticle) => (
              <div key={legalArticle.id}>
                <Typography
                  variant="Bim1"
                  className="mb-3 text-justify text-base text-[#4B0325] sm:text-3xl"
                >
                  Article {legalArticle.id} -{' '}
                  {
                    dict.legal.articles[legalArticle.id - 1]
                      ?.title
                  }
                </Typography>
                <Typography
                  variant="Bim4Regular"
                  className="text-justify text-base text-[#4B0325] sm:text-lg"
                >
                  {
                    dict.legal.articles[legalArticle.id - 1]
                      ?.description
                  }
                </Typography>
              </div>
            ))}
          {/* pdf files section */}
          <div className="">
            {data.map((item) => (
              <div className="flex items-center gap-1 hover:cursor-pointer hover:underline">
                <Image
                  src={pdfPNG}
                  alt="pdf"
                  width={40}
                  height={40}
                  className="h-auto w-[30px] lg:w-[40px]"
                  loading="lazy"
                />
                <Typography
                  variant="Bim4Regular"
                  className="text-justify text-base text-[#4B0325] sm:text-lg"
                >
                  <Link
                    href={item?.url}
                    passHref
                    legacyBehavior
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.title}
                    </a>
                  </Link>
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

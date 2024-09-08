'use client';

import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';
import HeroSection from '@/components/HeroSection';
import aboutHeroImage from '../../../../public/images/about-hero.png';
import aboutHeroMobileImage from '../../../../public/images/about-hero-mobile.png';
import { toCamelCase } from '@/lib/utils';

export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  if (!dict) {
    return null;
  }

  if (params.articleId === 'about-us') {
    return (
      <div className="min-h-screen">
        <HeroSection
          title={dict.about.article.title}
          description={dict.about.article.subtitle}
          backgroundImage={aboutHeroImage.src}
          backgroundImageMobile={aboutHeroMobileImage.src}
        />
        <div className="container mt-8 justify-center text-center">
          <span className="font-bold text-pink">
            {dict.about.aboutUs.startingWord}
          </span>{' '}
          {dict.about.aboutUs.description}
        </div>
      </div>
    );
  }

  if (params.articleId === 'our-concept') {
    return (
      <div className="min-h-screen">
        <HeroSection
          title={dict.about.ourConceptDetails.title}
          description={
            dict.about.ourConceptDetails.subtitle
          }
          backgroundImage={aboutHeroImage.src}
          backgroundImageMobile={aboutHeroMobileImage.src}
        />
        <div className="container mt-8 justify-center text-center">
          {dict.about.ourConceptDetails.description}
        </div>
      </div>
    );
  }
}

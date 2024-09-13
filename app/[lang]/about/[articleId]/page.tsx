'use client';

import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';
import HeroSection from '@/components/HeroSection';
import aboutHeroImage from '../../../../public/images/about-hero.png';
import aboutHeroMobileImage from '../../../../public/images/about-hero-mobile.png';
import { Prose } from '@/components/Prose';

export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  if (!dict) {
    return null;
  }

  if (params.articleId === 'about-us') {
    return (
      <div className="min-h-screen pb-10">
        <HeroSection
          title={dict.about.article.title}
          description={dict.about.article.subtitle}
          backgroundImage={aboutHeroImage.src}
          backgroundImageMobile={aboutHeroMobileImage.src}
        />
        <Prose>{dict.about.aboutUs.description}</Prose>
      </div>
    );
  }

  if (params.articleId === 'our-concept') {
    return (
      <div className="min-h-screen pb-10">
        <HeroSection
          title={dict.about.ourConceptDetails.title}
          description={
            dict.about.ourConceptDetails.subtitle
          }
          backgroundImage={aboutHeroImage.src}
          backgroundImageMobile={aboutHeroMobileImage.src}
        />
        <Prose>
          {dict.about.ourConceptDetails.description}
        </Prose>
      </div>
    );
  }
}

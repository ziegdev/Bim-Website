'use client';

import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';
import HeroSection from '@/components/HeroSection';
import newsHero from '../../../../public/images/news-hero.png';
import newsHeroMobile from '../../../../public/images/news-hero-mobile.png';
export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  if (!dict) {
    return null;
  }

  if (params.newsId === 'lorem-ipsum') {
    return (
      <div className="min-h-screen">
        <HeroSection
          title={dict.news.article.title}
          description={dict.news.article.subtitle}
          backgroundImage={newsHero.src}
          backgroundImageMobile={newsHeroMobile.src}
        />
        <div className="mt-8 justify-center text-center">
          {dict.news.article.description}
        </div>
      </div>
    );
  }

  if (params.newsId === 'news-heading') {
    return (
      <div className="min-h-screen">
        <HeroSection
          title={dict.news.ourConceptDetails.title}
          description={dict.news.ourConceptDetails.subtitle}
          backgroundImage={newsHero.src}
          backgroundImageMobile={newsHeroMobile.src}
        />
        <div className="mt-8 justify-center text-center">
          {dict.news.ourConceptDetails.description}
        </div>
      </div>
    );
  }

  return null;
}

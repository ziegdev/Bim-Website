'use client';

import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';
import HeroSection from '@/components/HeroSection';
import newsHero from '../../../../public/images/news-hero.png';
import newsHeroMobile from '../../../../public/images/news-hero-mobile.png';
import { Prose } from '@/components/Prose';
export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  if (!dict) {
    return null;
  }

  if (params.newsId === 'lorem-ipsum') {
    return (
      <div className="min-h-screen pb-10">
        <HeroSection
          title={dict.news.article.title}
          description={dict.news.article.subtitle}
          backgroundImage={newsHero.src}
          backgroundImageMobile={newsHeroMobile.src}
        />
        <div className="container mt-8 max-w-4xl justify-center text-center">
          <span className="font-bold text-pink">
            {dict.news.section1.startingWord}
          </span>{' '}
          {dict.news.section1.description}
        </div>
      </div>
    );
  }

  if (params.newsId === 'news-heading') {
    return (
      <div className="min-h-screen pb-10">
        <HeroSection
          title={dict.news.section2.title}
          description={''}
          backgroundImage={newsHero.src}
          backgroundImageMobile={newsHeroMobile.src}
        />
        <Prose>{dict.news.section2.description}</Prose>
      </div>
    );
  }

  return null;
}

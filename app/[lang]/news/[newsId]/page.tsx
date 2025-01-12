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
          title={dict.news.section1.title}
          description={''}
          backgroundImage={newsHero.src}
          backgroundImageMobile={newsHeroMobile.src}
        />
        <Prose>{dict.news.section1.description}</Prose>
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

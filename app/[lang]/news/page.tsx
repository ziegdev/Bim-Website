'use client';
import { useParams, useRouter } from 'next/navigation';
import ContentSection from '@/components/ContentSection';
import HeroSection from '@/components/HeroSection';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';

import newsHero from '../../../public/images/news-hero.png';
import newsHeroMobile from '../../../public/images/news-hero-mobile.png';
import newsBg from '../../../public/images/news-bg.png';
import newsBgMobile from '../../../public/images/news-bg-mobile.png';
import newsHeadingImages from '../../../public/images/news-heading-images.svg';
import newsHeadingImagesMobile from '../../../public/images/news-heading-images-mobile.svg';
import newsImages from '../../../public/images/news-images.svg';

export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  const router = useRouter();

  const handleButtonClick = (id: string) => {
    router.push(`/${lang}/news/${id}`);
  };

  if (!dict) {
    return null;
  }
  return (
    <div className="min-h-screen">
      <HeroSection
        title={dict.news.hero.title}
        description={dict.news.hero.description}
        backgroundImage={newsHero.src}
        backgroundImageMobile={newsHeroMobile.src}
      />

      <ContentSection
        title={dict.news.section1.title}
        startingWord={dict.news.section1.startingWord}
        description={dict.news.section1.description}
        image={newsImages.src}
        backgroundImage={newsBg.src}
        backgroundImageMobile={newsBgMobile.src}
        button={{
          text: dict.news.section1.button,
          textColor: 'text-white',
          backgroundColor: 'bg-[#d10062]',
          reverse: true,
        }}
        reverse={true}
        onButtonClick={(id) => handleButtonClick(id)}
        idPassedToButton="lorem-ipsum"
      />

      <ContentSection
        title={dict.news.section2.title}
        startingWord={dict.news.section2.startingWord}
        description={dict.news.section2.description}
        image={newsHeadingImages.src}
        backgroundImageMobile={newsHeadingImagesMobile.src}
        button={{
          text: dict.news.section2.button,
          textColor: 'text-white',
          backgroundColor: 'bg-[#d10062]',
          reverse: false,
        }}
        onButtonClick={(id) => handleButtonClick(id)}
        idPassedToButton="news-heading"
      />
      <div className="bg-[#fbf1ef] sm:py-16"></div>
    </div>
  );
}

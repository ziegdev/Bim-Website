'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import HeroSection from '@/components/HeroSection';
import socialMediaHero from '@/public/images/social-media-hero.jpg';
import BackgroundButton from '@/components/BackgroundButton';
import preRegisterBg from '@/public/images/pre-registration-bg.png';
import preRegisterBgMobile from '@/public/images/pre-registration-bg-mobile.png';
import facebookIcon from '@/public/icons/fb.svg';
import instagramIcon from '@/public/icons/insta.svg';
import tiktokIcon from '@/public/icons/tiktok.svg';
import youtubeIcon from '@/public/icons/youtube.svg';
import twitterIcon from '@/public/icons/x.svg';
import leftArrowIcon from '@/public/images/left-arrow.png';
import rightArrowIcon from '@/public/images/right-arrow.png';
import { useDictionary } from '@/hooks/useDictionary';
import { Languages } from '@/lib/types/languages';
import RightArrowIcon from '@/public/images/right-arrow.png';
import LeftArrowIcon from '@/public/images/left-arrow.png';

interface YouTubeVideo {
  id: string;
  embedUrl: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

// YouTube Carousel Component
function YouTubeCarousel({
  videos,
}: {
  videos: YouTubeVideo[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on('select', () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  if (videos.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>Loading YouTube videos...</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {videos.map((video, index) => (
            <CarouselItem
              key={video.id || index}
              className="basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/4"
            >
              <div className="flex flex-col">
                <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-black shadow-lg">
                  <iframe
                    src={video.embedUrl}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={
                      video.title ||
                      `YouTube video ${index + 1}`
                    }
                    frameBorder="0"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                {video.title && (
                  <p className="mt-2 line-clamp-2 text-center text-sm text-gray-700">
                    {video.title}
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Custom Left Arrow */}
      <button
        onClick={() => api?.scrollPrev()}
        disabled={!canScrollPrev}
        className={`absolute -left-4 top-1/2 z-10 -translate-y-1/2 md:-left-16 ${
          !canScrollPrev
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:opacity-80'
        } transition-opacity`}
        aria-label="Previous video"
      >
        <Image
          src={leftArrowIcon}
          alt="Previous"
          width={40}
          height={40}
          className="h-10 w-10 md:h-12 md:w-12"
        />
      </button>

      {/* Custom Right Arrow */}
      <button
        onClick={() => api?.scrollNext()}
        disabled={!canScrollNext}
        className={`absolute -right-4 top-1/2 z-10 -translate-y-1/2 md:-right-16 ${
          !canScrollNext
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:opacity-80'
        } transition-opacity`}
        aria-label="Next video"
      >
        <Image
          src={rightArrowIcon}
          alt="Next"
          width={40}
          height={40}
          className="h-10 w-10 md:h-12 md:w-12"
        />
      </button>
    </div>
  );
}

// Social Media Links Component
function SocialMediaLinks() {
  const socialLinks = {
    tiktok: {
      name: 'TikTok',
      handle: '@bim.video.dating',
      icon: tiktokIcon,
      href: 'https://www.tiktok.com/@bim.video.dating?_t=ZN-8sZeUKK3cDm&_r=1',
      iconBg: 'bg-black',
    },
    instagram: {
      name: 'Instagram',
      handle: '@bim.dating',
      icon: instagramIcon,
      href: 'https://www.instagram.com/bim.dating?igsh=MXV4YWFyZDVhNm1vaQ==',
      iconBg:
        'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    },
    youtube: {
      name: 'YouTube',
      handle: '@BimDating',
      icon: youtubeIcon,
      href: 'https://www.youtube.com/@BimDating',
      iconBg: 'bg-red-600',
    },
    facebook: {
      name: 'Facebook',
      handle: '@BimDating',
      icon: facebookIcon,
      href: 'https://www.facebook.com',
      iconBg: 'bg-blue-600',
    },
    twitter: {
      name: 'X (Twitter)',
      handle: '@BimDating',
      icon: twitterIcon,
      href: 'https://www.twitter.com',
      iconBg: 'bg-black',
    },
  };

  const SocialLinkItem = ({
    social,
    index,
  }: {
    social: typeof socialLinks.tiktok;
    index: number;
  }) => (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group flex flex-col items-center gap-3"
    >
      <div
        className={`h-16 w-16 ${social.iconBg} flex items-center justify-center rounded-xl shadow-lg transition-shadow group-hover:shadow-xl`}
      >
        <Image
          src={social.icon.src}
          alt={social.name}
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <p className="group-hover:text-pink-600 text-center text-sm font-medium text-gray-800 transition-colors">
        {social.handle}
      </p>
    </motion.a>
  );

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center gap-8">
      {/* First Row: TikTok and Instagram */}
      <div className="flex items-center justify-center gap-32 md:gap-40">
        <SocialLinkItem
          social={socialLinks.tiktok}
          index={0}
        />
        <SocialLinkItem
          social={socialLinks.instagram}
          index={1}
        />
      </div>

      {/* Second Row: YouTube (centered) */}
      <div className="flex items-center justify-center">
        <SocialLinkItem
          social={socialLinks.youtube}
          index={2}
        />
      </div>

      {/* Third Row: Facebook and Twitter */}
      <div className="flex items-center justify-center gap-32 md:gap-40">
        <SocialLinkItem
          social={socialLinks.facebook}
          index={3}
        />
        <SocialLinkItem
          social={socialLinks.twitter}
          index={4}
        />
      </div>
    </div>
  );
}

export default function SocialMediasPage() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  const [youtubeVideos, setYoutubeVideos] = useState<
    YouTubeVideo[]
  >([]);
  const [activeTab, setActiveTab] = useState<
    'video' | 'socials'
  >('video');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetch('/api/youtube-videos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.videos) {
          setYoutubeVideos(data.videos);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          'Error fetching YouTube videos:',
          error,
        );
        setLoading(false);
      });
  }, []);

  if (!dict) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeroSection
        title={dict.socialMedia.title}
        description={dict.socialMedia.description}
        backgroundImage={socialMediaHero.src}
        backgroundImageMobile={socialMediaHero.src}
      />

      {/* Main Content Area with Background */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-right"
          style={{
            backgroundImage: `url(${
              windowWidth !== null && windowWidth <= 768
                ? preRegisterBgMobile.src
                : preRegisterBg.src
            })`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center px-4 py-12">
          {/* Tab Buttons with Background Images */}
          <div className="relative mb-12 flex flex-wrap items-center justify-center gap-6">
            <BackgroundButton
              onClick={() => setActiveTab('video')}
              variant="video"
              isActive={activeTab === 'video'}
            >
              {dict.socialMedia.videoContent}
            </BackgroundButton>
            <BackgroundButton
              onClick={() => setActiveTab('socials')}
              variant="socials"
              isActive={activeTab === 'socials'}
            >
              {dict.socialMedia.ourSocials}
            </BackgroundButton>
          </div>

          {/* Video Content Section */}
          {activeTab === 'video' && (
            <div className="w-full max-w-6xl space-y-12">
              {/* YouTube Video Section */}
              <div className="mx-auto w-full max-w-4xl">
                <div className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/i4soY_Xd-tU?si=7ZHjeV8e5MdalRDF"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                </div>
              </div>

              {/* YouTube Carousel Section */}
              <div className="w-full">
                {loading ? (
                  <div className="py-12 text-center text-gray-500">
                    <p>Loading YouTube videos...</p>
                  </div>
                ) : (
                  <YouTubeCarousel videos={youtubeVideos} />
                )}
              </div>
            </div>
          )}

          {/* Social Media Links Section */}
          {activeTab === 'socials' && (
            <div className="w-full py-8">
              <SocialMediaLinks />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

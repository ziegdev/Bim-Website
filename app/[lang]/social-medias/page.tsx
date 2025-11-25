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
interface YouTubeVideo {
  id: string;
  embedUrl: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

function VideoEmbed({
  video,
  aspectClass = 'aspect-[9/16]',
  roundedClass = 'rounded-2xl',
}: {
  video: YouTubeVideo;
  aspectClass?: string;
  roundedClass?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail =
    video.thumbnail ||
    (video.id
      ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      : '');
  const embedUrl =
    video.embedUrl ||
    (video.id
      ? `https://www.youtube.com/embed/${video.id}`
      : '');

  return (
    <div
      className={`relative ${aspectClass} overflow-hidden bg-black shadow-lg ${roundedClass}`}
    >
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={video.title || 'YouTube video'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 h-full w-full"
          aria-label={`Play ${video.title || 'video'}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
              ▶
            </span>
          </div>
        </button>
      )}
    </div>
  );
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
                <VideoEmbed video={video} />
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
      href: 'https://www.facebook.com/BimDating',
      iconBg: 'bg-blue-600',
    },
    twitter: {
      name: 'X (Twitter)',
      handle: '@BimDating',
      icon: twitterIcon,
      href: 'https://x.com/bimdating?s=21',
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
  const [dictLoading, setDictLoading] = useState(true);
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
    if (dict) {
      setDictLoading(false);
    }
  }, [dict]);

  useEffect(() => {
    fetch('/api/youtube-videos')
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `HTTP error! status: ${res.status}`,
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log('YouTube API response:', data);
        if (
          data.success &&
          data.videos &&
          Array.isArray(data.videos)
        ) {
          setYoutubeVideos(data.videos);
          console.log(
            `Loaded ${data.videos.length} YouTube videos`,
          );
        } else {
          console.warn('No videos in response:', data);
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

  if (dictLoading || !dict) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HeroSection
        title={dict?.socialMedia?.title || 'SOCIAL MEDIAS'}
        description={
          dict?.socialMedia?.description ||
          'Follow us to check our new content and to stay tuned for our incoming offers!'
        }
        backgroundImage={socialMediaHero?.src}
        backgroundImageMobile={socialMediaHero?.src}
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
              {dict?.socialMedia?.videoContent ||
                'Video Content'}
            </BackgroundButton>
            <BackgroundButton
              onClick={() => setActiveTab('socials')}
              variant="socials"
              isActive={activeTab === 'socials'}
            >
              {dict?.socialMedia?.ourSocials ||
                'Our Socials'}
            </BackgroundButton>
          </div>

          {/* Video Content Section */}
          {activeTab === 'video' && (
            <div className="w-full max-w-6xl space-y-12">
              {/* YouTube Video Section */}
              <div className="mx-auto w-full max-w-4xl">
                <VideoEmbed
                  video={{
                    id: 'i4soY_Xd-tU',
                    embedUrl:
                      'https://www.youtube.com/embed/i4soY_Xd-tU?rel=0&controls=0&modestbranding=1&playsinline=1',
                    thumbnail:
                      'https://img.youtube.com/vi/i4soY_Xd-tU/maxresdefault.jpg',
                    title: 'YouTube video player',
                  }}
                  aspectClass="aspect-video"
                  roundedClass="rounded-xl"
                />
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

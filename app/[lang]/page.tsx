'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography';
import { VideoCarouselWrapper } from '@/components/VideoCarouselWrapper';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';

import homeBg from '../../public/images/home-bg.png';
import homeBgMobile from '../../public/images/home-bg-mobile.png';
import appSroreImage from '../../public/images/apple-play-store-icon.png';
import googlePlayImage from '../../public/images/google-play-store-icon.png';

export default function Home() {
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

  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  const getImageSize = () => {
    if (windowWidth !== null && windowWidth <= 639)
      return {
        width: 120,
        height: 40,
      };
    if (
      windowWidth !== null &&
      windowWidth >= 640 &&
      windowWidth < 1024
    )
      return {
        width: 180,
        height: 60,
      };
    if (windowWidth !== null && windowWidth >= 1024)
      return {
        width: 220,
        height: 60,
      };
    return {
      width: 120,
      height: 40,
    };
  };

  const imageSize = getImageSize();

  return (
    <div className="flex-1">
      <video
        className="mx-auto object-cover"
        width="3096"
        height="1600"
        autoPlay
        muted
        loop
        preload="auto"
      >
        <source
          src="/videos/intro-lg.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

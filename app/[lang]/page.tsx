'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  useMediaQuery,
  useIsClient,
} from '@sohanemon/utils/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import {
  ElementRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import appSroteImage from '../../public/images/apple-play-store-icon.png';
import googlePlayImage from '../../public/images/google-play-store-icon.png';

export default function Home() {
  const isReady = useIsClient();
  const [playing, setPlaying] = useState(true);

  const videoRef = useRef<ElementRef<'video'>>(null);
  const sm = useMediaQuery('sm');
  const lg = useMediaQuery('lg');

  const videoSrc = lg
    ? '/videos/intro-lg.mp4'
    : sm
      ? '/videos/intro-md.webm'
      : '/videos/intro-sm.mp4';

  const posterSrc = lg
    ? '/videos/banner-lg.png'
    : sm
      ? '/videos/banner-md.png'
      : '/videos/banner-sm.png';
  useEffect(() => {
    setTimeout(() => {
      handlePlay();
    }, 1000);
  }, []);

  function handlePause() {
    videoRef.current?.pause();
    setPlaying(false);
  }

  function handlePlay() {
    videoRef.current?.play();
    setPlaying(true);
  }

  if (isReady)
    return (
      <div className="flex-1 overflow-clip">
        <video
          onEnded={handlePause}
          poster={posterSrc}
          ref={videoRef}
          playsInline
          webkit-playsinline
          className={cn(
            'h-[calc(100vh-132px)] w-full object-cover max-md:h-[calc(100vh-176px)] max-sm:h-[calc(100vh-164px)]',
            'relative',
          )}
          autoPlay
          muted
          preload="auto"
          controls={false}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <AnimatePresence mode="wait">
          {!playing && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              exit={{ scale: 5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={handlePlay}
              className={cn(
                'animate-out:animate-ping absolute inset-x-0 z-50 m-auto grid size-16 place-content-center rounded-full bg-pink text-background max-lg:inset-0 lg:bottom-[150px] lg:size-20',
              )}
            >
              <Play className="size-7 lg:size-9" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {!playing && (
            <motion.div
              initial={{ y: 300, opacity: 0, scaleX: 0.8 }}
              exit={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-40 flex justify-center gap-6 px-4 lg:gap-32"
            >
              <motion.button
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="rounded-2xl"
              >
                <Image
                  src={appSroteImage.src}
                  alt="Download on the App Store"
                  width={190}
                  height={60}
                  unoptimized
                />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="rounded-2xl"
              >
                <Image
                  src={googlePlayImage.src}
                  alt="Get it on Google Play"
                  width={190}
                  height={60}
                  unoptimized
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}

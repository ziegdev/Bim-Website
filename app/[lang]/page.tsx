'use client';

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

  useEffect(() => {
    setTimeout(() => {
      handlePlay();
    });
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
      <div className="flex-1">
        <video
          onEnded={handlePause}
          ref={videoRef}
          className={cn(
            'h-[calc(100dvh-132px)] w-full object-cover max-md:h-[calc(100dvh-176px)] max-sm:h-[calc(100dvh-164px)]',
            !playing && 'brightness-75',
            'relative',
          )}
          muted
          preload="auto"
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
                'animate-out:animate-ping absolute inset-0 z-50 m-auto grid place-content-center rounded-full bg-pink text-background lg:size-20',
              )}
            >
              <Play className="size-9" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
}

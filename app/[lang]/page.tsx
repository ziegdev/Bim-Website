'use client';

import {
  useMediaQuery,
  useIsClient,
} from '@sohanemon/utils/hooks';

export default function Home() {
  const isReady = useIsClient();
  const sm = useMediaQuery('sm');
  const lg = useMediaQuery('lg');

  const videoSrc = lg
    ? '/videos/intro-lg.mp4'
    : sm
      ? '/videos/intro-md.webm'
      : '/videos/intro-sm.mp4';

  if (isReady)
    return (
      <video
        className="h-[calc(100dvh-132px)] w-full flex-1 object-cover max-md:h-[calc(100dvh-176px)] max-sm:h-[calc(100dvh-164px)]"
        autoPlay
        muted
        loop
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
}

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
      ? '/videos/intro-md.mp4'
      : '/videos/intro-sm.mp4';

  if (isReady)
    return (
      <video
        className="mx-auto size-full flex-1 object-cover"
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

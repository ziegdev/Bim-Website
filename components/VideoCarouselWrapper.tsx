'use client';

import dynamic from 'next/dynamic';

const VideoCarousel = dynamic(
  () => import('./VideoCarousel'),
  { ssr: false },
);

export function VideoCarouselWrapper() {
  return <VideoCarousel />;
}

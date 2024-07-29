import { useState } from 'react';
import Image from 'next/image';

import { PlayIcon } from 'lucide-react';

import aboutUsOurConceptImage from '../public/images/about-us-our-concept-image.svg';
import thumbnailImage from '../public/images/thumbnail.svg';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl">
      {!isPlaying ? (
        <div className="relative">
          <Image
            src={aboutUsOurConceptImage.src}
            alt="Video background"
            width={500}
            height={300}
            layout="responsive"
            className="rounded-3xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[90%] w-[90%]">
              <Image
                src={thumbnailImage.src}
                alt="Video thumbnail"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
              <button
                className="absolute left-1/2 top-1/2 rounded-full bg-white bg-opacity-80 p-4"
                onClick={handlePlayClick}
              >
                <PlayIcon
                  fill="true"
                  className="text-pink-600 h-8 w-8"
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Image
            src={aboutUsOurConceptImage.src}
            alt="Video background"
            width={500}
            height={300}
            layout="responsive"
            className="rounded-3xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[90%] w-[90%]">
              <video
                className="h-full w-full rounded-3xl"
                controls
                autoPlay
              >
                <source
                  src="../public/sample-video.mov"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;

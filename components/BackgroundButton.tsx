'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import videoContentBg from '@/public/images/video-content-bg.png';
import ourSocialsBg from '@/public/images/our-socials-bg.png';

interface BackgroundButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant: 'video' | 'socials';
  isActive?: boolean;
  className?: string;
}

const BackgroundButton: React.FC<BackgroundButtonProps> = ({
  children,
  onClick,
  variant,
  isActive = false,
  className,
}) => {
  const backgroundImage =
    variant === 'video'
      ? videoContentBg.src
      : ourSocialsBg.src;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative flex h-[60px] min-w-[200px] items-center justify-center overflow-hidden px-10 py-8 text-sm transition-all duration-300',
        variant === 'video' ? 'text-white' : 'text-black',
        className,
      )}
      style={{
        border: 'none',
        outline: 'none',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content */}
      <span className="relative z-10 mb-2 whitespace-nowrap text-center drop-shadow-lg">
        {children}
      </span>
    </motion.button>
  );
};

export default BackgroundButton;

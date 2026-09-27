'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Typography } from './Typography';
import CustomButton from './CustomButton';
import { typographyVariants } from './TypographyConfig';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
  primaryButton?: string;
  secondaryButton?: string;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  titleAs?: 'p' | 'h1' | 'h2';
  animate?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  backgroundImage,
  backgroundImageMobile,
  primaryButton,
  secondaryButton,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  className,
  children,
  titleAs: Title = 'p',
  animate = true,
}) => {
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
  return (
    <section
      className={`relative overflow-hidden ${className}`}
    >
      {backgroundImage && backgroundImageMobile && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-right"
          style={{
            backgroundImage: `url(${
              windowWidth !== null &&
              windowWidth <= 768 &&
              backgroundImageMobile
                ? backgroundImageMobile
                : backgroundImage
            })`,
          }}
        />
      )}
      <motion.div
        initial={
          animate
            ? {
                opacity: 0,
                y: 50,
              }
            : false
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 sm:py-24"
      >
        <div className="">
          <Title
            className={cn(
              typographyVariants({
                variant: 'Bim1',
                className:
                  'mb-4 text-3xl leading-tight text-white sm:text-4xl',
              }),
            )}
          >
            {title}
          </Title>
          <Typography
            variant="Bim4Regular"
            className="mb-8 text-base text-white/80 sm:text-lg"
          >
            {description}
          </Typography>
          <div className="flex flex-row items-start justify-center gap-8">
            {primaryButton && (
              <CustomButton
                variant="primary"
                className="w-60"
                text={primaryButton}
                onClick={onPrimaryButtonClick}
              />
            )}
            {secondaryButton && (
              <CustomButton
                className="w-60 px-8"
                variant="secondary"
                text={secondaryButton}
                onClick={onSecondaryButtonClick}
              />
            )}
          </div>
        </div>
        {children}
      </motion.div>
    </section>
  );
};

export default HeroSection;

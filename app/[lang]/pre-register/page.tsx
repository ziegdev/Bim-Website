'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

import HeroSection from '@/components/HeroSection';
import { Typography } from '@/components/Typography';
import PreRegistrationForm from '@/components/PreRegistrationForm';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';

import preRegisterHero from '../../../public/images/pre-registration-hero.png';
import preRegisterHeroMobile from '../../../public/images/pre-registration-hero-mobile.png';
import preRegisterBg from '../../../public/images/pre-registration-bg.png';
import preRegisterBgMobile from '../../../public/images/pre-registration-bg-mobile.png';
import preRegisterImage from '../../../public/images/pre-registration-image.png';

export default function page() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

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

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  if (!dict) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title={dict.preRegister.hero.title}
        description={dict.preRegister.hero.description}
        backgroundImage={preRegisterHero.src}
        backgroundImageMobile={preRegisterHeroMobile.src}
      />

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
        <div className="container relative z-10 mx-auto grid grid-cols-1 gap-12 py-8 lg:grid-cols-2 lg:gap-28 lg:py-24">
          <div>
            <motion.div
              variants={itemVariants}
              className="order-1 hidden flex-1 justify-center sm:order-2 sm:flex"
            >
              <img
                src={preRegisterImage.src}
                alt="image"
                className="h-96 w-auto"
              />
            </motion.div>
            <Typography
              variant="Bim1"
              className="mb-4 mt-4 text-center text-xl text-[#4b0325] sm:mb-8 sm:mt-8 sm:text-justify sm:text-3xl"
            >
              {dict.preRegister.content.title}
            </Typography>
            <Typography
              variant="Bim4Regular"
              className="text-center text-base text-[#4b0325] sm:text-justify sm:text-lg"
            >
              {dict.preRegister.content.description}
            </Typography>
          </div>
          <div className="rounded-l-3xl rounded-t-3xl bg-white p-8 shadow-lg sm:p-12">
            <PreRegistrationForm />
          </div>
        </div>
      </section>
    </div>
  );
}

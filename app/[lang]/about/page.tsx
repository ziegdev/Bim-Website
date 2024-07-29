'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import ContentSection from '@/components/ContentSection';
import CustomButton from '@/components/CustomButton';
import HeroSection from '@/components/HeroSection';
import { Typography } from '@/components/Typography';
import VideoSection from '@/components/VideoSection';

import aboutHeroImage from '../../../public/images/about-hero.png';
import aboutHeroMobileImage from '../../../public/images/about-hero-mobile.png';
import aboutUsImages from '../../../public/images/about-us-images.svg';
import aboutUsBg from '../../../public/images/about-us-bg.png';
import aboutUsBgMobile from '../../../public/images/about-us-bg-mobile.png';
import aboutUsOurConcept from '../../../public/images/about-us-our-concept-mobile.svg';
import aboutUsOurConceptBg from '../../../public/images/about-us-our-concept-bg.png';
import aboutUsOurConceptBgMobile from '../../../public/images/about-us-our-concept-bg-mobile.png';
import aboutUsGetStartMobileBg from '../../../public/images/about-us-get-start-mobile-bg.png';
import aboutUsGetStartBg from '../../../public/images/about-us-get-start-bg.png';
import appSroteImage from '../../../public/images/apple-play-store-icon.png';
import googlePlayImage from '../../../public/images/google-play-store-icon.png';

import { useDictionary } from '@/hooks/useDictionary';
import { useParams, useRouter } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { sendGTMEvent } from '@next/third-parties/google';

export default function page() {
  const [windowWidth, setWindowWidth] = useState<
    number | null
  >(null);
  const getStartedRef = useRef<HTMLDivElement>(null);
  const ourConceptRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  const router = useRouter();

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleButtonClick = (id: string) => {
    router.push(`/${lang}/about/${id}`);
    sendGTMEvent({
      event: 'click',
      category: 'about',
      action: 'click',
      label: id,
    });
  };

  const routeToPreRegisterPage = () => {
    router.push(`/${lang}/pre-register`);
    sendGTMEvent({
      event: 'click',
      category: 'get_started',
      action: 'click',
      label: 'get_started',
    });
  };

  if (!dict) return null;
  return (
    <div className="min-h-screen">
      <HeroSection
        title={dict.about.hero.title}
        description={dict.about.hero.description}
        backgroundImage={aboutHeroImage.src}
        backgroundImageMobile={aboutHeroMobileImage.src}
        primaryButton={dict.about.hero.primaryButton}
        secondaryButton={dict.about.hero.secondaryButton}
        onPrimaryButtonClick={() =>
          scrollToSection(getStartedRef)
        }
        onSecondaryButtonClick={() =>
          scrollToSection(ourConceptRef)
        }
      />

      <ContentSection
        title={dict.about.aboutUs.title}
        startingWord={dict.about.aboutUs.startingWord}
        description={dict.about.aboutUs.description}
        image={aboutUsImages.src}
        backgroundImage={aboutUsBg.src}
        backgroundImageMobile={aboutUsBgMobile.src}
        button={{
          text: dict.about.aboutUs.button,
          textColor: 'text-white',
          backgroundColor: 'bg-[#d10062]',
          reverse: true,
        }}
        idPassedToButton="about-us"
        onButtonClick={(id) => handleButtonClick(id)}
        reverse={true}
      />
      <div ref={ourConceptRef}>
        <ContentSection
          title={dict.about.ourConcept.title}
          description={dict.about.ourConcept.description}
          image={aboutUsOurConcept.src}
          backgroundImage={aboutUsOurConceptBg.src}
          backgroundImageMobile={
            aboutUsOurConceptBgMobile.src
          }
          button={{
            text: dict.about.ourConcept.button,
            textColor: 'text-[#4b0325]',
            backgroundColor: 'bg-white',
            reverse: true,
          }}
          idPassedToButton="our-concept"
          onButtonClick={(id) => handleButtonClick(id)}
        />
      </div>
      <section
        className="relative overflow-hidden"
        ref={getStartedRef}
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-right"
          style={{
            backgroundImage: `url(${
              windowWidth !== null && windowWidth <= 768
                ? aboutUsGetStartMobileBg.src
                : aboutUsGetStartBg.src
            })`,
          }}
        />
        <div className="container relative z-10 mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto items-center px-4 sm:flex">
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              whileInView={{
                scale: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
                amount: 0.5,
              }}
              transition={{
                duration: 0.5,
              }}
              className="flex-1 sm:pe-20 sm:pr-8 lg:pe-28 xl:pe-40"
            >
              <VideoSection />
            </motion.div>
            <div className="mt-8 flex-1 justify-between sm:mt-0">
              <Typography
                variant="Bim1"
                className="mb-4 text-center text-3xl text-[#4b0325] sm:text-start sm:text-4xl"
              >
                {dict.about.getStarted.title}
              </Typography>
              <Typography
                variant="nexaRegular"
                className="mb-8 text-center text-base text-[#4b0325] sm:text-justify sm:text-lg"
              >
                {dict.about.getStarted.description}
              </Typography>
              <CustomButton
                onClick={() => routeToPreRegisterPage()}
                variant="tertiary"
                className="w-full bg-[#d10062] py-3 text-white"
                text={dict.about.getStarted.button}
              />
              <div className="mt-16 flex justify-evenly gap-4">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

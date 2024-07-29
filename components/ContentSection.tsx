'use client';

import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
} from 'react';
import { motion, useInView } from 'framer-motion';

import { Typography } from './Typography';
import CustomButton from './CustomButton';

interface ContentSectionProps {
  title: string;
  startingWord?: string;
  description: string;
  image: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
  button: {
    text: string;
    textColor: string;
    backgroundColor: string;
    reverse: boolean;
    className?: string;
  };
  reverse?: boolean;
  onButtonClick?: (id: string) => void;
  idPassedToButton?: string;
  children?: React.ReactNode;
}

const ContentSection = forwardRef<
  HTMLDivElement,
  ContentSectionProps
>(
  (
    {
      title,
      startingWord,
      description,
      image,
      backgroundImage,
      backgroundImageMobile,
      button,
      onButtonClick,
      idPassedToButton,
      children,
      reverse = false,
    },
    ref,
  ) => {
    const [windowWidth, setWindowWidth] = useState<
      number | null
    >(null);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, {
      once: true,
      amount: 0.3,
    });

    useEffect(() => {
      function handleResize() {
        setWindowWidth(window.innerWidth);
      }
      window.addEventListener('resize', handleResize);
      handleResize();
      return () =>
        window.removeEventListener('resize', handleResize);
    }, []);

    const containerVariants = {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.5,
        },
      },
    };

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

    return (
      <section
        ref={ref}
        className={`relative overflow-hidden ${backgroundImage ? '' : 'bg-[#fbf1ef]'}`}
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
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="container relative z-10 mx-auto px-4 py-16 sm:py-24"
        >
          <div
            className={`mx-auto items-center px-4 ${reverse ? 'flex-row-reverse sm:flex' : 'sm:flex'}`}
          >
            {image && (
              <motion.div
                variants={itemVariants}
                className={`order-1 flex-1 sm:order-2 ${reverse ? 'sm:pe-20 lg:pe-28 xl:pe-40' : 'sm:ps-20 lg:ps-28 xl:ps-40'}`}
              >
                <img
                  src={image}
                  alt={title}
                  className="h-auto w-full"
                />
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              className="order-2 flex-1 space-y-12 sm:order-1"
            >
              <Typography
                variant="Bim1"
                className="mb-4 mt-12 text-center text-3xl text-[#4b0325] sm:mt-0 sm:text-start sm:text-4xl"
              >
                {title}
              </Typography>
              <Typography
                variant="Bim4Regular"
                className="mb-8 text-center text-base text-[#4b0325] sm:text-justify sm:text-lg"
              >
                <span className="font-bold text-pink">
                  {startingWord}
                </span>{' '}
                {description}
              </Typography>
              <div className="flex justify-start">
                {button && idPassedToButton && (
                  <CustomButton
                    variant="custom"
                    className={`mx-auto w-[80%] sm:mx-0 ${button.backgroundColor} ${button.textColor} ${button.reverse ? 'rounded-br-3xl rounded-tr-3xl clip-customRight' : 'rounded-bl-3xl rounded-tl-3xl clip-customLeft'} ${button.className}`}
                    text={button.text}
                    onClick={() =>
                      onButtonClick?.(idPassedToButton)
                    }
                  />
                )}
              </div>
            </motion.div>
          </div>
          {children}
        </motion.div>
      </section>
    );
  },
);

ContentSection.displayName = 'ContentSection';

export default ContentSection;

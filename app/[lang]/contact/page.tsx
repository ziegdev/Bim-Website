'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import HeroSection from '@/components/HeroSection';
import { Typography } from '@/components/Typography';
import ContactUsForm from '@/components/ContactUsForm';
import { ContactDetails } from '@/lib/bin/ContactDetails';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';

import contactUsHeroImage from '../../../public/images/contact-us-hero.png';
import contactUsHeroMobileImage from '../../../public/images/contact-us-hero-mobile.png';
import contactUsBg from '../../../public/images/contact-us-bg.png';
import contactUsBgMobile from '../../../public/images/contact-us-bg-mobile.png';

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

  const getImageSize = () => {
    if (windowWidth !== null && windowWidth <= 639)
      return {
        width: 50,
        height: 50,
      };
    if (
      windowWidth !== null &&
      windowWidth >= 639 &&
      windowWidth <= 1028
    )
      return {
        width: 18,
        height: 18,
      };
    if (windowWidth !== null && windowWidth >= 1024)
      return {
        width: 70,
        height: 70,
      };
    return {
      width: 50,
      height: 50,
    };
  };

  const imageSize = getImageSize();

  if (!dict) {
    return null;
  }
  return (
    <div className="min-h-screen">
      <HeroSection
        title={dict.contact.hero.title}
        description={dict.contact.hero.description}
        backgroundImage={contactUsHeroImage.src}
        backgroundImageMobile={contactUsHeroMobileImage.src}
      />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-right"
          style={{
            backgroundImage: `url(${
              windowWidth !== null && windowWidth <= 768
                ? contactUsBgMobile.src
                : contactUsBg.src
            })`,
          }}
        />
        <div className="container relative z-10 mx-auto grid grid-cols-1 gap-12 py-8 sm:gap-6 sm:py-6 lg:grid-cols-2 lg:gap-28 lg:py-24">
          <div className="grid grid-cols-1 gap-12 py-8 sm:grid-cols-3 sm:gap-3 sm:py-12 md:gap-12 lg:grid-cols-1 lg:py-24">
            {Array.isArray(ContactDetails) &&
              ContactDetails.map((ContactDetail) => (
                <div
                  key={ContactDetail.id}
                  className="grid grid-cols-4 items-center gap-12 sm:gap-3"
                >
                  <div className="col-span-1 flex h-20 w-20 items-center justify-center rounded-r-full rounded-t-full bg-white sm:h-10 sm:w-10 lg:h-24 lg:w-24">
                    <Image
                      src={ContactDetail.href}
                      alt="contact-info"
                      width={imageSize.width}
                      height={imageSize.height}
                    />
                  </div>
                  <div className="col-span-3 grid">
                    <Typography
                      variant="Bim1"
                      className="text-md text-justify text-[#4B0325] sm:text-xl lg:mb-2 lg:text-3xl"
                    >
                      {
                        dict.contact.details[
                          ContactDetail.nameKey
                        ]
                      }
                    </Typography>
                    <Typography
                      variant="Bim4Regular"
                      className="text-md text-justify text-[#4B0325] sm:text-sm lg:text-xl"
                    >
                      {
                        dict.contact.details[
                          ContactDetail.valueKey
                        ]
                      }
                    </Typography>
                  </div>
                </div>
              ))}
          </div>
          <div className="rounded-l-3xl rounded-t-3xl bg-white p-8 shadow-lg sm:p-12">
            <ContactUsForm />
          </div>
        </div>
      </section>
    </div>
  );
}

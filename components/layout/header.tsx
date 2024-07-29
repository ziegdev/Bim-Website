'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { MainHeader } from '../MainHeader';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../LanguageSwitcher';

import logoIcon from '../../public/logo.svg';
import { useDictionary } from '@/hooks/useDictionary';
import { Languages } from '@/lib/types/languages';

export function Header() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    router.push(`/${lang}`);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!dict) {
    return null;
  }

  return (
    <header>
      <div className="bg-pink">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="z-50 lg:hidden"
            >
              <motion.div
                initial={false}
                animate={{
                  rotate: isMenuOpen ? 180 : 0,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                {isMenuOpen ? (
                  <X size={24} color="white" />
                ) : (
                  <Menu size={24} color="white" />
                )}
              </motion.div>
            </button>

            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3"
            >
              <Image
                src={logoIcon}
                alt="Logo"
                width={30}
                height={30}
                className="h-auto w-[30px] lg:w-[45px]"
                loading="lazy"
              />
              <span className="min-w-48 text-xs text-white sm:text-base">
                The Dating Social Media
              </span>
            </button>
          </div>
          <MainHeader className="hidden flex-row gap-4 lg:flex" />

          <div className="flex items-center gap-8 lg:gap-16">
            {/* <Link href="/pre-register"> */}
            <Button
              className="hidden rounded-lg bg-white text-[#4B0325] hover:bg-yellow-400 md:block"
              onClick={() => {
                router.push(`/${lang}/pre-register`);
                closeMenu?.();
              }}
            >
              {dict.header.button}
            </Button>
            {/* </Link> */}
            <div className="">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed left-0 top-0 z-40 w-full bg-pink lg:hidden"
            initial={{
              opacity: 0,
              y: '-100%',
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: '-100%',
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <div className="p-4 pt-20">
              <MainHeader
                className="flex flex-col items-start space-y-2"
                closeMenu={closeMenu}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

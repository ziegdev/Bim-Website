'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { GB } from './ui/flags/GB';
import { FR } from './ui/flags/FR';
import { LU } from './ui/flags/LU';
import { IT } from './ui/flags/IT';
import { ES } from './ui/flags/ES';
import { DE } from './ui/flags/DE';

const languages = [
  { value: 'en', label: 'English', flag: GB },
  { value: 'fr', label: 'French', flag: FR },
  { value: 'lb', label: 'Luxembourgish', flag: LU },
  { value: 'it', label: 'Italian', flag: IT },
  { value: 'es', label: 'Spanish', flag: ES },
  { value: 'de', label: 'German', flag: DE },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState<
    number | null
  >(null);
  const currentLang = pathname.split('/')[1];
  const selectedLanguage =
    languages.find((lang) => lang.value === currentLang) ||
    languages[0];

  const handleLanguageChange = (value: string) => {
    const newPathname = pathname.replace(
      `/${currentLang}`,
      `/${value}`,
    );
    router.push(newPathname);
  };

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 flex items-center rounded-md border-none px-3 py-2 text-white hover:text-rose-100 focus:ring-0 focus:ring-offset-0 sm:gap-2"
        >
          <selectedLanguage.flag className="h-5 w-5" />
          <span>
            {windowWidth !== null && windowWidth <= 640
              ? ''
              : selectedLanguage.label}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-md bg-white shadow-lg">
        <DropdownMenuRadioGroup
          value={currentLang}
          onValueChange={handleLanguageChange}
        >
          {languages.map(({ value, label, flag: Flag }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="flex items-center gap-2 px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100"
            >
              <Flag className="ms-4 h-5 w-5" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

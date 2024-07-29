'use client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Typography } from '../Typography';
import { Separator } from '../ui/separator';
import facebookIcon from '../../public/icons/fb.svg';
import instagramIcon from '../../public/icons/insta.svg';
import tiktokIcon from '../../public/icons/tiktok.svg';
import youtubeIcon from '../../public/icons/youtube.svg';
import twitterIcon from '../../public/icons/x.svg';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';

type SocialIcon = {
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const socialIcons: SocialIcon[] = [
  {
    href: 'https://www.facebook.com',
    src: facebookIcon.src,
    alt: 'Facebook',
    width: 9,
    height: 9,
  },
  {
    href: 'https://www.instagram.com/',
    src: instagramIcon.src,
    alt: 'Instagram',
    width: 12,
    height: 12,
  },
  {
    href: 'https://www.tiktok.com',
    src: tiktokIcon.src,
    alt: 'Tiktok',
    width: 10,
    height: 10,
  },
  {
    href: 'https://www.twitter.com',
    src: twitterIcon.src,
    alt: 'x',
    width: 12,
    height: 12,
  },
  {
    href: 'https://www.youtube.com',
    src: youtubeIcon.src,
    alt: 'Youtube',
    width: 15,
    height: 15,
  },
];

function SocialButton({
  href,
  src,
  alt,
  width,
  height,
}: SocialIcon) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-6 w-6 rounded-full border-2 bg-transparent hover:bg-rose-400"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
        />
      </a>
    </Button>
  );
}

export function Footer() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  if (!dict) {
    return null;
  }
  return (
    <>
      <div className="bg-pink">
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
            <div className="order-2 col-span-7 flex justify-center gap-4 md:order-1 md:justify-start">
              <Typography
                className="text-start text-sm text-white sm:text-lg md:text-start"
                variant="Bim4Regular"
              >
                {' '}
                <a target="_blank" href={`/${lang}/legal`}>
                  {' '}
                  {dict.footer.legal}
                </a>
              </Typography>
              <Separator
                orientation="vertical"
                className="my-auto h-5"
              />
              <Typography
                className="text-start text-sm text-white sm:text-lg md:text-start"
                variant="Bim4Regular"
              >
                {' '}
                {dict.footer.privacy}
              </Typography>
            </div>

            <div className="order-1 col-span-5 flex items-center justify-center gap-2 md:order-2 md:justify-end">
              <Typography
                className="me-4 text-start text-sm text-white sm:text-lg md:text-start"
                variant="Bim4Regular"
              >
                {dict.footer.followUs}
              </Typography>
              {socialIcons.map((icon) => (
                <SocialButton key={icon.alt} {...icon} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import {
  useParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from './ui/button';
import { Typography } from './Typography';
import { useDictionary } from '@/hooks/useDictionary';
import { Languages } from '@/lib/types/languages';

interface MainHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  closeMenu?: () => void;
}

export function MainHeader({
  className,
  closeMenu,
  ...props
}: MainHeaderProps) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] as Languages;
  const params = useParams();
  // const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  const routes = [
    {
      href: `/${lang}`,
      label: dict?.header.MainHeader.Home,
      active:
        pathname === `/${lang}` || pathname === `/${lang}/`,
    },
    {
      href: `/${lang}/about`,
      label: dict?.header.MainHeader.About,
      active: pathname === `/${lang}/about`,
    },
    {
      href: `/${lang}/news`,
      label: dict?.header.MainHeader.News,
      active: pathname === `/${lang}/news`,
    },
    {
      href: `/${lang}/contact`,
      label: dict?.header.MainHeader.Contact,
      active: pathname === `/${lang}/contact`,
    },
  ];

  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div {...props} className={className}>
        {routes.map((route) => (
          <motion.div
            key={route.href}
            variants={itemVariants}
          >
            <Button
              onClick={() => {
                router.push(route.href);
                closeMenu?.();
              }}
              variant={'link'}
              className={`${
                route.active
                  ? 'underline decoration-white underline-offset-18'
                  : ''
              } w-full justify-start`}
            >
              <Typography
                variant="Bim4Regular"
                className="ms-2 text-white"
              >
                {route.label}
              </Typography>
            </Button>
          </motion.div>
        ))}
        <Button
          className="rounded-lg bg-white text-[#4B0325] hover:bg-gray-50 lg:hidden"
          onClick={() => {
            router.push(`/${lang}/pre-register`);
            closeMenu?.();
          }}
        >
          {dict?.header.MainHeader.PreRegister}
        </Button>
      </div>
    </motion.div>
  );
}

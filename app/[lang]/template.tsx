'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface RootTemplateProps {
  children: React.ReactNode;
}

export default function RootTemplate({
  children,
}: RootTemplateProps) {
  const pathname = usePathname();
  // Keep the ad landing page visible before hydration as well.
  const isCrowdfunding =
    pathname?.endsWith('/crowdfunding');
  return (
    <>
      <motion.main
        initial={isCrowdfunding ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.1,
          duration: 0.4,
          when: 'beforeChildren',
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.main>
    </>
  );
}

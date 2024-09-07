'use client';
import { motion } from 'framer-motion';

interface RootTemplateProps {
  children: React.ReactNode;
}

export default function RootTemplate({
  children,
}: RootTemplateProps) {
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
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

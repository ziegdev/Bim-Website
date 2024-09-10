'use client';
import { useState, useRef } from 'react';
import { motion, useDomEvent } from 'framer-motion';
import type * as React from 'react';
import { cn } from '@sohanemon/utils';

import { useMediaQuery } from '@sohanemon/utils/hooks';

type MarkdownImageProps = React.ComponentProps<'img'>;

export function MarkdownImage({
  src,
  alt,
}: MarkdownImageProps) {
  const [isOpen, setOpen] = useState(false);

  const sm = useMediaQuery('sm');

  useDomEvent(
    useRef(typeof window === 'undefined' ? null : window),
    'scroll',
    () => isOpen && setOpen(false),
  );

  return (
    <>
      {isOpen && (
        <motion.span
          animate={{ opacity: 1 }}
          className={cn(
            'fixed inset-0 z-40 block cursor-zoom-out opacity-0 backdrop-blur sm:backdrop-blur-lg',
          )}
          onClick={() => setOpen(false)}
        />
      )}
      <img
        className={cn(
          'invisible m-auto rounded-xl',
          isOpen ? 'block' : 'hidden',
        )}
        src={src}
        alt={alt}
      />
      <motion.img
        layout
        className={cn(
          'm-auto cursor-zoom-in rounded-xl',
          isOpen &&
            'fixed inset-0 z-50 max-h-[90vh] max-w-[100vw] cursor-zoom-out object-contain lg:inset-10 lg:max-w-[90vw]',
        )}
        src={src}
        alt={alt}
        onClick={() => {
          if (sm) setOpen((p) => !p);
        }}
      />
    </>
  );
}

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Typography } from './Typography';

interface CustomButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'tertiary' | 'custom';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  variant,
  className,
  onClick,
  disabled,
  children,
  href,
  target,
  rel,
}) => {
  const reduceMotion = useReducedMotion();
  const primaryClasses =
    'bg-yellow-400 text-black hover:bg-yellow-500 clip-customLeft rounded-2xl rounded-tl-3xl rounded-bl-3xl  h-16';
  const secondaryClasses =
    'bg-white/20 text-white hover:bg-white/30 clip-customRight rounded-2xl rounded-tr-3xl rounded-br-3xl h-16';
  const tertiaryClasses =
    'bg-[#D10062] text-white hover:bg-[#C0005A] shadow-lg shadow-[#58350833] clip-customRight rounded-2xl rounded-tr-3xl rounded-br-3xl h-16';
  const customClasses = 'rounded-2xl h-16';

  const variantClasses =
    variant === 'primary'
      ? primaryClasses
      : variant === 'secondary'
        ? secondaryClasses
        : variant === 'tertiary'
          ? tertiaryClasses
          : customClasses;

  if (href) {
    return (
      <motion.a
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        whileHover={
          reduceMotion ? undefined : { scale: 1.04 }
        }
        whileTap={
          reduceMotion ? undefined : { scale: 0.96 }
        }
        className={cn(
          'relative inline-flex min-h-16 max-w-full items-center justify-center px-8 py-4 text-center transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
          variantClasses,
          'h-auto',
          className,
        )}
      >
        <span className="font-['Bim4-Regular'] text-base leading-relaxed [overflow-wrap:anywhere] sm:text-lg">
          {text}
        </span>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{
        scale: 1.04,
      }}
      whileTap={{
        scale: 0.96,
      }}
      className={cn(
        'relative px-6 py-2 transition-colors duration-300',
        variantClasses,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Typography
        variant="Bim4Regular"
        className="text-sm sm:text-lg"
      >
        {text}
      </Typography>
      {children}
    </motion.button>
  );
};

export default CustomButton;

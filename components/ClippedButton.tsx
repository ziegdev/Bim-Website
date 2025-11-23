'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClippedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'pink' | 'yellow';
  isActive?: boolean;
  className?: string;
}

const ClippedButton: React.FC<ClippedButtonProps> = ({
  children,
  onClick,
  variant = 'pink',
  isActive = false,
  className,
}) => {
  const baseClasses =
    'relative px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg';

  const variantClasses = {
    pink: isActive
      ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40'
      : 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40',
    yellow: isActive
      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/40'
      : 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/40',
  };

  // Slight rotation angle (counter-clockwise)
  const rotationAngle = -3;

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        rotate: rotationAngle - 1,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className,
      )}
      style={{
        transform: `rotate(${rotationAngle}deg)`,
        transformOrigin: 'center',
      }}
    >
      <span className="relative z-10 block">
        {children}
      </span>
    </motion.button>
  );
};

export default ClippedButton;

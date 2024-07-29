import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

import {
  TypographyProps,
  typographyVariants,
} from './TypographyConfig';

export const Typography = forwardRef<
  HTMLParagraphElement,
  TypographyProps
>(({ className, variant, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        typographyVariants({
          variant,
          className,
        }),
      )}
      {...props}
    />
  );
});
Typography.displayName = 'Typography';

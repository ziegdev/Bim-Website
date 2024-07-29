import { cva } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      default: 'font-sans',
      HempaSansSm:
        "font-['Hempa_Sans'] font-normal text-[18px] leading-[24px] tracking-normal",
      HempaSansLg:
        "font-['Hempa_Sans'] font-normal text-[20px] leading-[27.9px] tracking-normal",
      luckiestGuy:
        "font-['Luckiest_Guy'] font-normal text-[36px] leading-[43.2px] tracking-normal text-center",
      nexaRegular:
        "font-['NexaRegular'] font-normal text-[16px] leading-[24px] text-center",
      Bim1: "font-['Bim1'] font-normal text-[16px] leading-[24px] text-center",
      Bim4Regular:
        "font-['Bim4-Regular'] font-normal text-[16px] leading-[24px] text-center",
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

import { VariantProps } from 'class-variance-authority';

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof typographyVariants> {}

export const locales = [
  'en',
  'fr',
  'lb',
  'it',
  'es',
  'de',
] as const;
export const defaultLocale = 'en';

export type LocalesType = (typeof locales)[number];

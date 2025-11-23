type Locale = 'en' | 'fr' | 'es' | 'it' | 'lb' | 'de';

const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () =>
    import('../locales/en.json').then(
      (module) => module.default,
    ),
  fr: () =>
    import('../locales/fr.json').then(
      (module) => module.default,
    ),
  es: () =>
    import('../locales/es.json').then(
      (module) => module.default,
    ),
  it: () =>
    import('../locales/it.json').then(
      (module) => module.default,
    ),
  lb: () =>
    import('../locales/lb.json').then(
      (module) => module.default,
    ),
  de: () =>
    import('../locales/de.json').then(
      (module) => module.default,
    ),
};

export const getDictionary = async (
  locale: string,
): Promise<any> => {
  const normalizedLocale = locale as Locale;
  const dictionaryLoader = dictionaries[normalizedLocale];

  if (
    !dictionaryLoader ||
    typeof dictionaryLoader !== 'function'
  ) {
    // Fallback to English if locale is not found
    console.warn(
      `Locale "${locale}" not found, falling back to "en"`,
    );
    return dictionaries.en();
  }

  return dictionaryLoader();
};

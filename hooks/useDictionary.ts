'use client';
import { useLanguage } from '@/components/LanguageContext';
import { getDictionary } from '@/lib/getDictionary';
import { Dictionary } from '@/lib/types/dictionary';
import { Languages } from '@/lib/types/languages';
import { useEffect, useState } from 'react';

export function useDictionary(
  language = 'en' as Languages,
) {
  const [dict, setDict] = useState<Dictionary | null>(null);
  useEffect(() => {
    getDictionary(language as Languages).then(
      (result: Dictionary) => setDict(result),
    );
  }, [language]);

  return dict;
}

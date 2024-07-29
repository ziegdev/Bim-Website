'use client';

import { useState, useEffect } from 'react';
import { Typography } from './Typography';
import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';

export const CookieConsentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [consentChoices, setConsentChoices] = useState({
    necessary: false,
    analytics: false, 
    thirdParty: false,
  });
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsOpen(true);
    } else {
      try {
        const parsedConsent = JSON.parse(consent);
        setConsentChoices(parsedConsent);
      } catch (e) {
        if (consent === 'all') {
          setConsentChoices({
            necessary: true,
            analytics: true,
            thirdParty: true,
          });
        } else {
          setIsOpen(true);
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      thirdParty: true,
    };
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify(allConsent),
    );
    setConsentChoices(allConsent);
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    const rejectAllConsent = {
      necessary: false,
      analytics: false,
      thirdParty: false,
    };
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify(rejectAllConsent),
    );
    setConsentChoices(rejectAllConsent);
    setIsOpen(false);
  };

  const handleSaveChoices = () => {
    localStorage.setItem(
      'cookieConsent',
      JSON.stringify(consentChoices),
    );
    setIsOpen(false);
  };

  const handleToggleConsent = (
    type: keyof typeof consentChoices,
  ) => {
    setConsentChoices((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  if (!isOpen) return null;
  if (!dict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-lg rounded-lg bg-gray-800 p-6 text-white">
        <Typography
          variant="Bim1"
          className="mb-4 text-center text-xl"
        >
          {dict.cookies.title}
        </Typography>
        <Typography
          variant="Bim4Regular"
          className="mb-6 text-sm"
        >
          {dict.cookies.description}
        </Typography>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <Typography
              variant="Bim4Regular"
              className="text-sm"
            >
              {dict.cookies.necessary}
            </Typography>
            <input
              type="checkbox"
              checked={consentChoices.necessary}
              onChange={() =>
                handleToggleConsent('necessary')
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Typography
              variant="Bim4Regular"
              className="text-sm"
            >
              {dict.cookies.analytics}
            </Typography>
            <input
              type="checkbox"
              checked={consentChoices.analytics}
              onChange={() =>
                handleToggleConsent('analytics')
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Typography
              variant="Bim4Regular"
              className="text-sm"
            >
              {dict.cookies.thirdParty}
            </Typography>
            <input
              type="checkbox"
              checked={consentChoices.thirdParty}
              onChange={() =>
                handleToggleConsent('thirdParty')
              }
            />
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <button
            onClick={handleRejectAll}
            className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            <Typography variant="Bim4Regular">
              {dict.cookies.rejectAll}
            </Typography>
          </button>
          <button
            onClick={handleSaveChoices}
            className="flex-1 rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            <Typography variant="Bim4Regular">
              {dict.cookies.saveChoices}
            </Typography>
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 rounded bg-pink px-4 py-2 text-white hover:bg-[#9e004a]"
          >
            <Typography variant="Bim4Regular">
              {dict.cookies.acceptAll}
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

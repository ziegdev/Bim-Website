'use client';

import { useEffect, useState } from 'react';
import {
  crowdfundingCampaign,
  isCrowdfundingActive,
} from '@/lib/crowdfunding';

export function useCrowdfundingActive() {
  // Evaluate on the client so cached pages never contain an expired link.
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiry = () => {
      clearTimeout(timer);
      const now = Date.now();
      const nextActive = isCrowdfundingActive(now);
      setActive(nextActive);
      if (nextActive) {
        timer = setTimeout(
          checkExpiry,
          Math.min(
            60_000,
            Date.parse(crowdfundingCampaign.endsAt) - now,
          ),
        );
      }
    };

    checkExpiry();
    window.addEventListener('focus', checkExpiry);
    window.addEventListener('pageshow', checkExpiry);
    document.addEventListener(
      'visibilitychange',
      checkExpiry,
    );
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', checkExpiry);
      window.removeEventListener('pageshow', checkExpiry);
      document.removeEventListener(
        'visibilitychange',
        checkExpiry,
      );
    };
  }, []);

  return active;
}

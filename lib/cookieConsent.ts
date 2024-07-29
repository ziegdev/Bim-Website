export function checkCookieConsent(
  type: 'analytics' | 'thirdParty',
): boolean {
  if (typeof window === 'undefined') {
    return false; // Default to false on server-side
  }

  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return false;

  try {
    const consentChoices = JSON.parse(consent);
    return consentChoices[type] === true;
  } catch (e) {
    // If parsing fails, it might be the old 'all' string
    return consent === 'all';
  }
}

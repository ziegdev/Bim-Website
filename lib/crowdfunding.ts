/**
 * Campaign dates confirmed by BIM on 27 September 2026.
 * Europe/Paris is UTC+1 on 16 November: 23:59 local = 22:59 UTC.
 * Public editorial source: https://api.ulule.com/v1/projects/212901
 * Shared by the server gate and the client expiry guard.
 */
export const crowdfundingCampaign = {
  url: 'https://fr.ulule.com/dating-app-rencontre-en-video-/',
  endsAt: '2026-11-16T22:59:00Z',
  siteUrl: 'https://bim-dating.com',
} as const;

export function isCrowdfundingActive(
  now = Date.now(),
): boolean {
  return now < Date.parse(crowdfundingCampaign.endsAt);
}

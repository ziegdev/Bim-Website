import type { Metadata, Viewport } from 'next';

import packageJson from '../package.json';

const favicon = packageJson.icon;

export const siteConfig: {
  remoteUrl: string;
  metadata: Metadata;
  viewport: Viewport;
} = {
  remoteUrl: `https://${packageJson.name.toLowerCase()}.vercel.app`,
  metadata: {
    title: {
      default: 'BIM - The dating social media',
      template: `BIM - ${packageJson.name.toUpperCase()}`,
    },
    description: packageJson.description,
    openGraph: {
      title: 'BIM - The dating social media',
      description: packageJson.description,
    },
    twitter: {
      card: 'summary_large_image',
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
  },
  viewport: {
    themeColor: [
      {
        media: '(prefers-color-scheme: light)',
        color: 'white',
      },
      {
        media: '(prefers-color-scheme: dark)',
        color: 'black',
      },
    ],
  },
};

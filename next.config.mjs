/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.google.com',
      'flagcdn.com',
      'flagsapi.com',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  cacheMaxMemorySize: 1024 * 1024 * 100,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: true,
  compiler:
    process.env.NODE_ENV === 'production'
      ? { removeConsole: true }
      : {},
  typescript: {
    ignoreBuildErrors:
      process.env.NODE_ENV === 'production',
  },
};
export default nextConfig;

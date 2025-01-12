/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:locale/pdf.worker.js',
        destination: '/pdf.worker.js',
      },
      {
        source: '/:locale/pdf/:name',
        destination: '/pdf/:name',
      },
    ];
  },
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
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.module.rules.push({
      test: /\.(pdf)$/,
      type: 'asset/resource', // Treat PDF files as assets
      generator: {
        filename: 'static/pdf/[name].[hash][ext][query]',
      },
    });
    return config;
  },
};
export default nextConfig;

import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next-intl/config': path.resolve(process.cwd(), 'i18n/request.js'),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      'next-intl/config': './i18n/request.js',
    },
  },
};

export default nextConfig;

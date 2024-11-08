const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'raw.githubusercontent.com'
    ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.VERCEL_URL || 'localhost',
        port: '',
        pathname: '/api/assets/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  experimental: {
    serverActions: true,
  },
  generateEtags: false,
  transpilePackages: [
    'framer-motion',
    '@emotion/is-prop-valid'
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/is-prop-valid': require.resolve('@emotion/is-prop-valid'),
    }
    if (isServer) {
      config.externals = [...(config.externals || []), 'esprima']
    }
    return config
  },
  output: 'standalone',
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.cache = false;
    }
    return config;
  },
}

module.exports = withContentlayer(nextConfig) 
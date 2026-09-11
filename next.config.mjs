/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
  },

  // /services/business-systems was retired when the offer moved to digital
  // marketing and affordable websites. It had 26 impressions and 0 clicks, so
  // the redirect is only here to keep stray links and bookmarks working.
  async redirects() {
    return [
      {
        source: '/services/business-systems',
        destination: '/services',
        permanent: true,
      },
    ]
  },

  // Performance optimizations
  compress: true,

  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

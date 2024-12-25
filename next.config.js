// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "awkilxsbjloidoylspmq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  unoptimized: true,
  webpack: (config, { isServer }) => {
    // Add clean webpack plugin
    config.optimization = {
      ...config.optimization,
      runtimeChunk: false,
    };
    return config;
  },
  swcMinify: true,
  onDemandEntries: {
    // Reduce the number of pages kept in memory
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
  typescript: {
    // This will reduce TypeScript checking overhead during development
    ignoreBuildErrors: true, // Only during development
  },
};

module.exports = nextConfig;

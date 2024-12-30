// next.config.mjs
import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // Handle Sharp in client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        sharp: false,
        fs: false,
      };
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "awkilxsbjloidoylspmq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

const nextConfig = withPlaiceholder(config);

export default nextConfig;

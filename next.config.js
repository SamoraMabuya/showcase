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
};

module.exports = nextConfig;

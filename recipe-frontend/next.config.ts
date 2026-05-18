import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  devIndicators: false,
  trailingSlash: true,

  images: {
    unoptimized: process.env.NODE_ENV === 'development',

    remotePatterns: [
      {
        protocol: "https",
        hostname: "recipe-backend-st1o.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5041",
        pathname: "/uploads/**",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

const pwaConfig = withPWA(nextConfig);
export default { ...pwaConfig, images: nextConfig.images };
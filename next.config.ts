import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/devices/**", search: "" },
      { pathname: "/devices/**", search: "?v=*" },
    ],
  },
};

export default nextConfig;

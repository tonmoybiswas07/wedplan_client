import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;

import type { NextConfig } from "next";
import "dotenv/config";


const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'export',
  basePath: process.env.ASSET_BASEPATH,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: ['mongoose', 'mongodb'],
  trailingSlash: true,
  // Remove output export to enable server-side features
  // This allows API routes, SSR, and other server features
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize mongoose and mongodb to avoid bundling issues
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('mongoose', 'mongodb');
      } else {
        config.externals = [config.externals, 'mongoose', 'mongodb'];
      }
    }
    return config;
  },
};

export default nextConfig;

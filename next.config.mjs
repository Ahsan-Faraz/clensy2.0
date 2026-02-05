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
  transpilePackages: ['@wecre8websites/strapi-page-builder-react', 'next-auth'],
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
    
    // Ensure proper module resolution for scoped packages and ESM packages
    config.resolve = config.resolve || {};
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      'node_modules',
    ];
    
    // Ensure webpack can resolve the package exports field
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };
    
    // Handle package exports properly
    config.resolve.conditionNames = ['import', 'require', 'default'];
    
    // Fix for handlebars - ignore require.extensions
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/handlebars/,
        message: /require\.extensions/,
      },
    ];
    
    // Fix for handlebars - ignore require.extensions warning
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/handlebars/,
        message: /require\.extensions/,
      },
    ];
    
    // Fix for next-auth compatibility with webpack
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  // Turbopack configuration (empty to silence warning, webpack is used for mongoose/mongodb)
  turbopack: {},
  // Add headers for Strapi preview iframe embedding
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:1337 https://*.railway.app https://*.up.railway.app https://strapi-production-8d56.up.railway.app;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

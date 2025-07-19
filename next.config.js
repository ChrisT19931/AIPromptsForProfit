/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['bcryptjs']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bcryptjs');
    }
    return config;
  }
};

module.exports = nextConfig;
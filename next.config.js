/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bcryptjs');
    }
    return config;
  }
};

module.exports = nextConfig;
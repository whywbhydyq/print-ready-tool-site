/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    cpus: 1,
    workerThreads: false
  },
  webpack: (config, { dev }) => {
    if (!dev && config.optimization) {
      config.optimization.minimize = false;
    }
    return config;
  }
};
export default nextConfig;

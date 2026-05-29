/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/image-size/print-size-calculator', destination: '/print-size-calculator', permanent: true },
      { source: '/image-size/dpi-calculator', destination: '/dpi-calculator', permanent: true }
    ];
  },
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

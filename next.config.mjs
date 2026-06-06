const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com https://*.googlesyndication.com https://*.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.googlesyndication.com https://*.google.com https://*.g.doubleclick.net",
      "font-src 'self' data:",
      "connect-src 'self' https://*.googlesyndication.com https://*.google.com https://*.g.doubleclick.net",
      "frame-src https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.google.com",
      'upgrade-insecure-requests'
    ].join('; ')
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      { source: '/kdp-cover-calculator/:path*', destination: '/', permanent: true },
      { source: '/image-size/print-size-calculator', destination: '/print-size-calculator', permanent: true },
      { source: '/image-size/dpi-calculator', destination: '/dpi-calculator', permanent: true }
    ];
  },
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    cpus: 1,
    workerThreads: false
  }
};
export default nextConfig;

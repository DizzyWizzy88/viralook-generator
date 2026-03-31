/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

// If you have 'withPWA' at the bottom, change it to this:
if (process.env.NODE_ENV === 'development') {
  // Keep it active for web dev if you want
  const withPWA = require('next-pwa')({ dest: 'public' });
  module.exports = withPWA(nextConfig);
} else {
  // Disable it for the static export that Capacitor uses
  module.exports = nextConfig;
}
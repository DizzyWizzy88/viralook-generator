/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // We are removing the 'eslint' block entirely to stop the warning.
  // Next.js will now use the default linting settings.
};

export default nextConfig;

module.exports = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  optimizeFonts: false,
  // ADD THESE TWO BLOCKS BELOW
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

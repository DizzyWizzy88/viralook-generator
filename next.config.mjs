/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Next.js to "clean" the native code before building
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    '@expo/next-adapter',
    'react-native-safe-area-context',
    'react-native-vector-icons',
  ],

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Crucial: ensure every request for 'react-native' goes to the 'web' version
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },

  experimental: {
    // Required for some PWA/Edge features in 2026
    forceSwcTransforms: true,
    esmExternals: 'loose', 
  },
};

export default nextConfig;

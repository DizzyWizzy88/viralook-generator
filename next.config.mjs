/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Tell Next.js to pre-process these folders
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    'solito',
    'react-native-safe-area-context',
  ],

  // 2. NEW: Native Turbopack Alias (Next.js 16 syntax)
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
  },

  // 3. Keep Webpack fallback for production safety
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    return config;
  },
};

export default nextConfig;

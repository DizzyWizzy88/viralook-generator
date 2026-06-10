import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viralook.generator',
  appName: 'Viralook AI Studio',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
    allowNavigation: ['*']
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;

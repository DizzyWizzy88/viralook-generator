
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viralook.generator',
  appName: 'viralook-generator',
  webDir: 'out',
  // This is CRITICAL for Next.js static exports to work correctly on Android
  server: {
    androidScheme: 'https',
    cleartext: true, // Allows debugging and local API calls if needed
  },
  plugins: {
    // The new Capgo Social Login configuration
    SocialLogin: {
      google: {
        // Find this in Firebase Console -> Project Settings -> Authentication -> Google
        // It usually ends in .apps.googleusercontent.com
        clientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
        
        // This is optional but helpful if you want to force a specific account
        forceCodeForRefreshToken: true,
      },
    },
    // We keep this here to ensure our cleanup component from earlier has permissions
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#070707",
      showSpinner: false,
    },
  },
};

export default config;
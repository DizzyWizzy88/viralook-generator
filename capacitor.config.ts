
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viralook.generator',
  appName: 'viralook-generator',
  webDir: 'out',
  android: {
    path: 'android',
    backgroundColor: '#070707' // Set the background color to match your app's theme
  },
  plugins: {
    CapacitorSocialLogin: {
      google: {
        clientId: '994498276710-kriv0t2p1o82v59s7el0q65705u6kmgd.apps.googleusercontent.com',
      },
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#070707', // Match the splash screen background
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;

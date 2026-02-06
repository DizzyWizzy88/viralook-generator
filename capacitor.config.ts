import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viralook.app', 
  appName: 'Viralook Generator',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;

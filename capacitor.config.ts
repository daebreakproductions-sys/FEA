import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myepicidea.flinteats',
  appName: 'Flint Eats',
  webDir: 'www/browser',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
   },
   server: {
       iosScheme: 'ionic'
   }
};

export default config;
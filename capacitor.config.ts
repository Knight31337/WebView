import type { CapacitorConfig } from '@capacitor/cli';
import appConfig from './app.config.json';

const config: CapacitorConfig = {
  appId: appConfig.appId,
  appName: appConfig.appName,
  webDir: 'www',
  server: {
    url: appConfig.webUrl,
    cleartext: true,
    allowNavigation: appConfig.allowNavigation,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: appConfig.splashScreenDuration,
      backgroundColor: appConfig.backgroundColor,
      showSpinner: false,
    },
    StatusBar: {
      style: appConfig.statusBarStyle === 'light' ? 'LIGHT' : 'DARK',
      backgroundColor: appConfig.statusBarColor,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: appConfig.backgroundColor,
  },
  android: {
    backgroundColor: appConfig.backgroundColor,
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;

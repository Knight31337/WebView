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
    androidScheme: 'https',
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
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'default',
    },
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
    backgroundColor: appConfig.backgroundColor,
    limitsNavigationsToAppBoundDomains: false,
  },
  android: {
    backgroundColor: appConfig.backgroundColor,
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    initialFocus: true,
  },
} as any;

// Pass notification config through so native code can read it from capacitor.config.json
(config as any).notifications = appConfig.notifications;

export default config;

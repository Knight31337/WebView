import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

// Initialize the app shell
document.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();

  // Configure status bar on native platforms
  if (platform !== 'web') {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (e) {
      // Status bar plugin may not be available
    }
  }

  // Handle offline state
  if (!navigator.onLine) {
    showOffline();
  }

  window.addEventListener('online', () => {
    document.getElementById('offline').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    location.reload();
  });

  window.addEventListener('offline', () => {
    showOffline();
  });

  // Hide splash screen once ready
  if (platform !== 'web') {
    try {
      await SplashScreen.hide();
    } catch (e) {
      // Splash screen plugin may not be available
    }
  }

  // Handle Android back button
  if (platform === 'android') {
    document.addEventListener('backbutton', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Let the app exit
        navigator.app?.exitApp?.();
      }
    });
  }

  // Handle keyboard on iOS
  if (platform === 'ios') {
    try {
      Keyboard.addListener('keyboardWillShow', () => {
        document.body.classList.add('keyboard-open');
      });
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-open');
      });
    } catch (e) {
      // Keyboard plugin may not be available
    }
  }
});

function showOffline() {
  document.getElementById('loading').style.display = 'none';
  const offlineEl = document.getElementById('offline');
  offlineEl.style.display = 'block';
  // Message is set from app.config.json via capacitor config at build time
  document.getElementById('offline-message').textContent =
    'No internet connection. Please check your network and try again.';
}

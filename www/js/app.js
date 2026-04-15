// Minimal fallback shell — only runs if the remote URL fails to load.
// When server.url is set in capacitor.config, Capacitor loads the remote
// site directly in the WebView. This page is a safety net.

document.addEventListener('DOMContentLoaded', function () {
  // Handle offline state
  if (!navigator.onLine) {
    showOffline();
  }

  window.addEventListener('online', function () {
    document.getElementById('offline').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    location.reload();
  });

  window.addEventListener('offline', function () {
    showOffline();
  });

  // Best-effort push notification registration via Capacitor bridge.
  // This runs briefly before the WebView navigates to the remote URL.
  // The native layer handles registration as the primary mechanism.
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      var PushNotifications = window.Capacitor.Plugins.PushNotifications;
      if (PushNotifications) {
        PushNotifications.requestPermissions().then(function (result) {
          if (result.receive === 'granted') {
            PushNotifications.register();
          }
        });
        PushNotifications.addListener('registration', function (token) {
          console.log('Push registration token:', token.value);
        });
        PushNotifications.addListener('registrationError', function (err) {
          console.error('Push registration error:', err.error);
        });
        PushNotifications.addListener('pushNotificationReceived', function (notification) {
          console.log('Push received:', notification.title);
        });
        PushNotifications.addListener('pushNotificationActionPerformed', function (notification) {
          console.log('Push action:', notification.actionId);
        });
      }
    } catch (e) {
      // Plugin may not be available — native side handles it
    }
  }
});

function showOffline() {
  document.getElementById('loading').style.display = 'none';
  var offlineEl = document.getElementById('offline');
  offlineEl.style.display = 'block';
  document.getElementById('offline-message').textContent =
    'No internet connection. Please check your network and try again.';
}

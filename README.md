# WebView Wrapper App Template

A Capacitor-based template that wraps any website into a native iOS and Android app. One config file controls everything — the URL, app name, notifications, and appearance. No native code changes required between deployments.

Built with [Capacitor 8](https://capacitorjs.com/) by the Ionic team.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deploying for a New Customer](#deploying-for-a-new-customer)
- [Configuration Reference](#configuration-reference)
- [Notification Systems](#notification-systems)
  - [Pull-Based Local Notifications](#pull-based-local-notifications)
  - [Firebase Push Notifications](#firebase-push-notifications)
- [Project Structure](#project-structure)
- [Module and Code Reference](#module-and-code-reference)
  - [app.config.json](#appconfigjson)
  - [capacitor.config.ts](#capacitorconfigts)
  - [www/index.html](#wwwindexhtml)
  - [www/js/app.js](#wwwjsappjs)
  - [iOS Native Code](#ios-native-code)
  - [Android Native Code](#android-native-code)
- [NPM Dependencies](#npm-dependencies)
- [NPM Scripts](#npm-scripts)
- [App Store Submission Tips](#app-store-submission-tips)
- [Troubleshooting](#troubleshooting)

---

## How It Works

The app is a thin native shell with a full-screen WebView. When the user opens the app, it:

1. Shows a splash screen briefly
2. Loads the configured URL directly in the WebView
3. Displays the website full-screen with no browser chrome, no URL bar, and no navigation controls
4. All user interaction goes directly to the website

The user sees your app icon, taps it, and gets your website rendered as if it were a native app. They never see a URL or browser controls.

---

## Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| **Node.js** (v18+) | Package management and Capacitor CLI | `brew install node` |
| **Xcode** (iOS builds) | Build and run on iOS simulators/devices | Mac App Store |
| **Android Studio** (Android builds) | Build and run on Android emulators/devices | `brew install --cask android-studio` |
| **Java 21** (Android builds) | Required by Gradle | `brew install --cask temurin@21` |
| **Android SDK** | Android build tools | Via Android Studio SDK Manager |
| **CocoaPods** (optional) | Some iOS plugins may require it | `brew install cocoapods` |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Knight31337/WebView.git
cd WebView

# 2. Install dependencies
npm install

# 3. Edit app.config.json with your URL and app name
#    (see "Deploying for a New Customer" below)

# 4. Add native platforms
npm run init:all

# 5. Sync config to native projects
npm run sync

# 6. Build and run
npm run build:ios       # Opens Xcode — run on simulator or device
npm run build:android   # Opens Android Studio — run on emulator or device
```

---

## Deploying for a New Customer

This is the core workflow. To create a new app for a different website, you only edit **one file**: `app.config.json`.

### Step 1: Update `app.config.json`

Change these four fields at minimum:

```json
{
  "appName": "Customer App Name",
  "appId": "com.customercompany.appname",
  "webUrl": "https://www.customer-website.com/page",
  "allowNavigation": ["customer-website.com", "*.customer-website.com"]
}
```

| Field | What to set | Rules |
|-------|-------------|-------|
| `appName` | The name users see under the app icon | Keep it short (under 15 chars displays best) |
| `appId` | Unique bundle identifier | Must be globally unique across all app stores. Use reverse domain: `com.company.appname`. Cannot be changed after first submission. |
| `webUrl` | The full URL the app loads on launch | Must be HTTPS. Include the full path if needed. |
| `allowNavigation` | Domains the WebView is allowed to navigate to | Include the main domain and any subdomains the site uses (CDNs, auth providers, etc.) |

### Step 2: Sync to native projects

```bash
npx cap sync
```

This pushes your config changes into the iOS and Android project files.

### Step 3: Update platform-specific names

**iOS** — Update the display name in `ios/App/App/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>Customer App Name</string>
```

**Android** — Update the app name in `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Customer App Name</string>
<string name="title_activity_main">Customer App Name</string>
```

**Android** — Update the bundle ID in `android/app/build.gradle`:
```groovy
applicationId "com.customercompany.appname"
```

And update the `namespace` in the same file:
```groovy
namespace = "com.customercompany.appname"
```

### Step 4: Replace app icons

- **iOS**: Replace icon files in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- **Android**: Replace icon files in `android/app/src/main/res/mipmap-*/`

Use a tool like [appicon.co](https://appicon.co) or [makeappicon.com](https://makeappicon.com) to generate all required sizes from a single 1024x1024 PNG.

### Step 5: Build release versions

**iOS (Xcode):**
```bash
npm run build:ios
```
In Xcode: select your team under Signing & Capabilities, choose "Any iOS Device" as the destination, then Product > Archive.

**Android (Android Studio):**
```bash
npm run build:android
```
In Android Studio: Build > Generate Signed Bundle/APK.

### Step 6: Submit to stores

- **Apple App Store**: Upload via Xcode's Organizer or Transporter app
- **Google Play Store**: Upload the signed APK/AAB via the Google Play Console

---

## Configuration Reference

Complete `app.config.json` field reference:

```json
{
  "appName": "My App",
  "appId": "com.example.myapp",
  "webUrl": "https://www.example.com",
  "backgroundColor": "#ffffff",
  "statusBarStyle": "dark",
  "statusBarColor": "#ffffff",
  "splashScreenDuration": 2000,
  "allowNavigation": ["example.com", "*.example.com"],
  "orientation": "portrait",
  "userAgent": "",
  "allowBackButton": true,
  "allowZoom": false,
  "offlineMessage": "No internet connection. Please check your network and try again.",
  "notifications": {
    "pullEnabled": true,
    "pullEndpointPath": "/notifications.json",
    "pullIntervalMinutes": 15,
    "pushEnabled": true,
    "pushTokenEndpoint": ""
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `appName` | string | required | Display name on the home screen |
| `appId` | string | required | Unique bundle ID (reverse domain format) |
| `webUrl` | string | required | The URL loaded when the app opens |
| `backgroundColor` | string | `"#ffffff"` | Background color for splash screen and loading states |
| `statusBarStyle` | string | `"dark"` | Status bar text color: `"dark"` (black text) or `"light"` (white text) |
| `statusBarColor` | string | `"#ffffff"` | Status bar background color (Android) |
| `splashScreenDuration` | number | `2000` | How long the splash screen shows (milliseconds) |
| `allowNavigation` | string[] | required | Domains the WebView can navigate to. Supports wildcards (`*.example.com`) |
| `orientation` | string | `"portrait"` | Screen orientation: `"portrait"`, `"landscape"`, or `"any"` |
| `userAgent` | string | `""` | Custom user agent string. Empty uses the platform default. |
| `allowBackButton` | boolean | `true` | Whether the Android back button navigates browser history |
| `allowZoom` | boolean | `false` | Whether pinch-to-zoom is enabled |
| `offlineMessage` | string | (see above) | Message shown on the offline screen |
| `notifications.pullEnabled` | boolean | `true` | Enable pull-based notification polling |
| `notifications.pullEndpointPath` | string | `"/notifications.json"` | Path on the website to poll for notifications |
| `notifications.pullIntervalMinutes` | number | `15` | How often to check for new notifications (minimum 15 for Android) |
| `notifications.pushEnabled` | boolean | `true` | Enable Firebase push notifications |
| `notifications.pushTokenEndpoint` | string | `""` | URL to POST device tokens to (optional) |

---

## Notification Systems

The app supports two independent notification systems. Both can be enabled simultaneously.

### Pull-Based Local Notifications

The app periodically fetches a JSON file from the target website. If new notification IDs are found, it shows a local notification on the device.

**How it works:**
1. The app reads `pullEndpointPath` from config (default: `/notifications.json`)
2. It constructs the full URL: `{scheme}://{host}{pullEndpointPath}`
3. On a timer (configurable interval), it fetches this URL
4. It compares notification IDs against a stored list of "seen" IDs
5. New IDs trigger a local notification
6. Seen IDs are persisted in `UserDefaults` (iOS) / `SharedPreferences` (Android)

**Platform implementation:**
- **iOS**: `BGAppRefreshTask` for background polling + `Timer` for foreground polling
- **Android**: `WorkManager` `PeriodicWorkRequest` (survives app close and device reboots)

**JSON endpoint format** — your website must serve this:

```json
{
  "notifications": [
    {
      "id": "unique-string-id",
      "title": "Notification Title",
      "body": "Notification message body text"
    },
    {
      "id": "another-unique-id",
      "title": "Another Notification",
      "body": "Another message"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier. The app tracks seen IDs to avoid duplicate notifications. Change this ID to re-trigger. |
| `title` | string | yes | Bold title line of the notification |
| `body` | string | yes | Body text of the notification |

**To trigger a new notification:** Add a new object to the `notifications` array with a unique `id` that hasn't been used before. The app will detect it on the next poll cycle and show the notification.

**To stop showing a notification:** Remove it from the array. Already-seen IDs are stored locally, so removing an old notification won't re-trigger it.

**Important notes:**
- iOS throttles background fetch — the actual interval may be longer than configured
- Android WorkManager minimum interval is 15 minutes
- The app stores up to 100 seen IDs (oldest are pruned)
- Polling only works when the device has network connectivity

### Firebase Push Notifications

Real-time push notifications via Firebase Cloud Messaging (FCM). Notifications arrive instantly, even when the app is closed.

**Setup steps:**

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

2. **Add an Android app:**
   - Package name: must match `appId` in `app.config.json`
   - Download `google-services.json`
   - Place it in `android/app/google-services.json`

3. **Add an iOS app:**
   - Bundle ID: must match `appId` in `app.config.json`
   - Download `GoogleService-Info.plist`
   - Place it in `ios/App/App/GoogleService-Info.plist`

4. **iOS additional setup:**
   - In Xcode, go to your target > Signing & Capabilities
   - Click "+ Capability" and add **Push Notifications**
   - Click "+ Capability" and add **Background Modes**, check **Remote notifications** and **Background fetch**
   - In your Apple Developer account, create an APNs authentication key (.p8 file)
   - Upload the .p8 key to Firebase Console > Project Settings > Cloud Messaging

5. **Rebuild both platforms:**
   ```bash
   npx cap sync
   # Then rebuild in Xcode and Android Studio
   ```

**Sending a push notification:**
- Go to Firebase Console > Messaging > New Campaign > Notifications
- Enter a title and body
- Select your app as the target
- Send

**Token endpoint (optional):**
If you set `pushTokenEndpoint` in `app.config.json`, the app will POST the device token to your server when it registers. The payload format:

```json
{
  "token": "device-token-string",
  "platform": "ios" | "android",
  "appId": "com.example.myapp"
}
```

Your server can store these tokens and use the Firebase Admin SDK to send targeted notifications programmatically.

---

## Project Structure

```
WebView/
├── app.config.json                          # MAIN CONFIG — edit this for each deployment
├── capacitor.config.ts                      # Reads app.config.json, generates native configs
├── package.json                             # NPM dependencies and scripts
├── package-lock.json                        # Locked dependency versions
├── .gitignore                               # Ignores node_modules, ios/, android/
│
├── www/                                     # Web shell (fallback UI)
│   ├── index.html                           #   Loading spinner + offline screen
│   └── js/
│       └── app.js                           #   Offline handling + push registration
│
├── ios/                                     # iOS native project (generated)
│   └── App/
│       ├── App.xcodeproj                    #   Xcode project file
│       ├── App/
│       │   ├── AppDelegate.swift            #   Push + pull notification logic
│       │   ├── Info.plist                   #   App metadata, permissions, background modes
│       │   ├── Assets.xcassets/             #   App icons and images
│       │   └── public/                      #   Synced web assets
│       └── CapApp-SPM/                      #   Swift Package Manager plugin config
│
├── android/                                 # Android native project (generated)
│   ├── app/
│   │   ├── build.gradle                     #   App dependencies (Firebase, WorkManager)
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml          #   Permissions, services, activities
│   │   │   ├── java/com/example/myapp/
│   │   │   │   ├── MainActivity.java        #   Notification channel + permission + polling init
│   │   │   │   ├── FCMService.java          #   Firebase message receiver
│   │   │   │   └── NotificationPollWorker.java  # Background JSON polling worker
│   │   │   ├── res/                         #   Icons, strings, styles
│   │   │   └── assets/
│   │   │       └── capacitor.config.json    #   Generated config (read by native code)
│   │   └── google-services.json             #   Firebase config (you add this)
│   ├── build.gradle                         #   Root Gradle config
│   └── variables.gradle                     #   SDK and library versions
│
├── server.js                                # Local dev proxy server (development only)
└── preview.html                             # Browser preview mockup (development only)
```

---

## Module and Code Reference

### `app.config.json`

**Purpose:** Single source of truth for all app configuration. This is the only file you edit between deployments.

**How it flows:** `capacitor.config.ts` imports this file and maps its values to Capacitor's configuration format. When you run `npx cap sync`, the config is written as `capacitor.config.json` into both `ios/App/App/` and `android/app/src/main/assets/`. The native code (AppDelegate.swift, MainActivity.java, etc.) reads this generated JSON at runtime to configure notification behavior.

---

### `capacitor.config.ts`

**Purpose:** Bridges `app.config.json` to Capacitor's native configuration format.

**Key responsibilities:**
- Maps `webUrl` to `server.url` (tells the WebView which URL to load)
- Configures `allowNavigation` to restrict which domains the WebView can access
- Sets up plugin configurations for SplashScreen, StatusBar, Keyboard, PushNotifications, and LocalNotifications
- Passes the `notifications` block through to the generated JSON so native code can read it
- Configures iOS-specific settings (content inset, link preview prevention)
- Configures Android-specific settings (mixed content blocking, input capture)

**You should not need to edit this file.** All values are driven from `app.config.json`.

---

### `www/index.html`

**Purpose:** Fallback loading screen. This is shown briefly while Capacitor initializes before redirecting to the remote URL, or when the device is offline.

**Contains:**
- A CSS loading spinner animation
- An offline message screen with a "Try Again" button
- Links to `js/app.js` for runtime behavior

---

### `www/js/app.js`

**Purpose:** Handles two things during the brief window before the remote URL loads:

1. **Offline detection:** If the device has no network, it hides the loading spinner and shows the offline message with a retry button. Listens for `online`/`offline` events to auto-recover.

2. **Best-effort push registration:** If the Capacitor JS bridge is available (it runs briefly before the WebView navigates to the remote URL), it requests notification permissions and registers for push notifications via the `PushNotifications` plugin.

**Important:** This file uses plain JavaScript (no ES modules, no bundler). The Capacitor bridge plugins are accessed via `window.Capacitor.Plugins`. This is a belt-and-suspenders approach — the primary push registration happens in native code (AppDelegate.swift / MainActivity.java).

---

### iOS Native Code

#### `AppDelegate.swift`

**Location:** `ios/App/App/AppDelegate.swift`

This is the main iOS entry point. It handles:

**Push Notifications:**
- Requests notification permissions (`UNUserNotificationCenter.requestAuthorization`) on launch
- Registers for remote notifications (`application.registerForRemoteNotifications`)
- Receives the APNs device token and forwards it to Capacitor's notification system
- Optionally POSTs the token to a configured server endpoint
- Implements `UNUserNotificationCenterDelegate` to show notifications even when the app is in the foreground

**Pull-Based Polling:**
- Registers a `BGAppRefreshTask` with identifier `com.webview.notificationcheck`
- Runs a foreground `Timer` that polls on the configured interval when the app is active
- Polls immediately on launch, then on the timer interval
- On background entry, schedules a `BGAppRefreshTaskRequest` for background polling
- Fetches the notification JSON endpoint via `URLSession`
- Parses the response looking for new notification IDs
- Shows local notifications via `UNNotificationRequest` for any unseen IDs
- Stores seen IDs in `UserDefaults` (capped at 100)

**Config reading:**
- Loads `capacitor.config.json` from the app bundle at runtime
- Reads `notifications.pullEnabled`, `pullIntervalMinutes`, `pullEndpointPath`, and `pushTokenEndpoint`
- Constructs the poll URL from the `server.url` base domain + the endpoint path

#### `Info.plist`

**Location:** `ios/App/App/Info.plist`

Key entries added for this template:
- `UIBackgroundModes`: `remote-notification` (push), `fetch` (background polling)
- `BGTaskSchedulerPermittedIdentifiers`: `com.webview.notificationcheck`
- `NSAppTransportSecurity > NSAllowsArbitraryLoads`: `true` (allows HTTP/HTTPS loading)
- `CFBundleDisplayName`: The app name shown to users

---

### Android Native Code

#### `MainActivity.java`

**Location:** `android/app/src/main/java/com/example/myapp/MainActivity.java`

Extends Capacitor's `BridgeActivity`. On `onCreate`, it:

1. **Creates a notification channel** (`default_channel`) — required on Android 8+ for any notifications to display
2. **Requests `POST_NOTIFICATIONS` permission** — required on Android 13+ (Tiramisu). Uses `ActivityResultLauncher` for the modern permission request flow.
3. **Schedules the poll worker** — reads `capacitor.config.json` from assets, checks if `pullEnabled` is true, then enqueues a `PeriodicWorkRequest` via `WorkManager` with the configured interval (minimum 15 minutes). The work request requires network connectivity.

#### `FCMService.java`

**Location:** `android/app/src/main/java/com/example/myapp/FCMService.java`

Extends `FirebaseMessagingService`. Handles:

- **`onNewToken()`**: Called when Firebase generates or refreshes the device token. Logs the token and optionally POSTs it to the configured `pushTokenEndpoint`.
- **`onMessageReceived()`**: Called when a push message arrives. Supports both notification payloads (handled by Firebase when app is in background) and data payloads (handled by this code when app is in foreground). Data payload keys `title` and `body` override notification payload values.
- **`showNotification()`**: Creates a `NotificationCompat` notification on the `default_channel`. Tapping the notification opens `MainActivity`.
- **`postTokenToServer()`**: POSTs the FCM token as JSON to the configured endpoint on a background thread.

#### `NotificationPollWorker.java`

**Location:** `android/app/src/main/java/com/example/myapp/NotificationPollWorker.java`

Extends `Worker` for use with `WorkManager`. This is the Android equivalent of iOS's `BGAppRefreshTask`.

- **`doWork()`**: Reads the poll endpoint URL from config, fetches it via `HttpURLConnection`, processes the JSON response
- **`processNotifications()`**: Parses the notification array, compares IDs against `SharedPreferences`, shows a notification for each new ID, updates the stored seen set (capped at 100)
- **`showNotification()`**: Posts a `NotificationCompat` notification. Uses the notification ID's hashCode as the notification ID so duplicate sends don't stack.
- **`getPollEndpointUrl()`**: Reads `capacitor.config.json` from assets and constructs the full URL from the base domain + endpoint path

#### `AndroidManifest.xml`

**Location:** `android/app/src/main/AndroidManifest.xml`

Key entries:
- `INTERNET` permission — required for WebView and polling
- `POST_NOTIFICATIONS` permission — required for showing notifications on Android 13+
- `RECEIVE_BOOT_COMPLETED` permission — allows WorkManager to reschedule polling after device reboot
- `FCMService` service declaration with `MESSAGING_EVENT` intent filter
- `default_notification_channel_id` metadata pointing to `default_channel`

#### `build.gradle` (app module)

**Location:** `android/app/build.gradle`

Added dependencies:
- `com.google.firebase:firebase-messaging:24.1.1` — Firebase Cloud Messaging SDK
- `androidx.work:work-runtime:2.10.1` — WorkManager for background polling

The Google Services plugin is conditionally applied — it activates automatically when `google-services.json` is present in the `android/app/` directory.

---

## NPM Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@capacitor/core` | ^8.3.0 | Capacitor runtime |
| `@capacitor/cli` | ^8.3.0 | Capacitor command line tools |
| `@capacitor/ios` | ^8.3.0 | iOS platform support |
| `@capacitor/android` | ^8.3.0 | Android platform support |
| `@capacitor/splash-screen` | ^8.0.1 | Native splash screen on launch |
| `@capacitor/status-bar` | ^8.0.2 | Status bar styling (color, text style) |
| `@capacitor/keyboard` | ^8.0.3 | Keyboard behavior (viewport resizing) |
| `@capacitor/push-notifications` | ^8.0.3 | FCM/APNs push notification registration |
| `@capacitor/local-notifications` | ^8.0.2 | Local notification display |
| `typescript` | ^6.0.2 | Required for `capacitor.config.ts` parsing |

---

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run init:ios` | `npx cap add ios` | Generate the iOS Xcode project |
| `npm run init:android` | `npx cap add android` | Generate the Android Studio project |
| `npm run init:all` | Both of the above | Generate both platforms |
| `npm run sync` | `npx cap sync` | Copy web assets + config to native projects |
| `npm run open:ios` | `npx cap open ios` | Open the iOS project in Xcode |
| `npm run open:android` | `npx cap open android` | Open the Android project in Android Studio |
| `npm run build:ios` | Sync + open iOS | Sync config then open Xcode |
| `npm run build:android` | Sync + open Android | Sync config then open Android Studio |
| `npm run build:all` | `npx cap sync` | Sync both platforms (no IDE open) |

---

## App Store Submission Tips

### Apple App Store

Apple's App Store Review Guidelines (section 4.2) may reject apps that are "simply a website bundled as an app." This template includes features that help with approval:

- Splash screen on launch (native feel)
- Offline detection with retry screen (graceful degradation)
- Back button / navigation handling (native UX)
- Push notification support (native capability)
- Full-screen WebView with no browser chrome (app-like experience)

**Additional tips:**
- Make sure your website is mobile-responsive
- Add push notifications — Apple looks favorably on apps that use native features
- Your app should provide value beyond what the mobile website offers
- Consider adding an app icon that matches your brand

### Google Play Store

Google Play is more lenient with WebView apps. The main requirements:

- The app must function (no crashes or blank screens)
- Content must comply with Google Play policies
- The app must request appropriate permissions

---

## Troubleshooting

### App shows "Loading..." and never loads the website
- Check that `webUrl` in `app.config.json` is a valid HTTPS URL
- Check that the domain is listed in `allowNavigation`
- Run `npx cap sync` after any config changes
- Clean build in Xcode (Product > Clean Build Folder) or Android Studio (Build > Clean Project)

### Notifications don't appear
- **iOS**: Ensure Background Modes and Push Notifications capabilities are added in Xcode
- **Android**: Ensure notification permission was granted (check Settings > Apps > Your App > Notifications)
- **Pull-based**: Verify your website serves valid JSON at the configured endpoint path
- **Push**: Verify `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in place

### Links open in external browser instead of the app
- Add the domain to `allowNavigation` in `app.config.json`
- Include wildcards for subdomains: `"*.example.com"`
- Include any third-party domains your site uses (CDNs, auth providers, payment processors)

### Build fails with "Unsupported class file major version"
- This means your Java version is too new for the Gradle plugin
- Install Java 21: `brew install --cask temurin@21`
- Build with: `JAVA_HOME=$(/usr/libexec/java_home -v 21) ./gradlew assembleDebug`

### iOS simulator shows blank white screen
- Run `npx cap sync ios` to ensure the latest config is pushed
- Delete the app from the simulator and reinstall
- Check Xcode console for error messages

---

## License

ISC

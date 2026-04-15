# WebView Wrapper App Template

A minimal Capacitor-based template that wraps any website into a native iOS/Android app. Change one config file, build, and ship.

## Quick Start

### 1. Configure your app

Edit `app.config.json` — this is the only file you need to touch:

```json
{
  "appName": "My App",
  "appId": "com.yourcompany.yourapp",
  "webUrl": "https://your-website.com",
  "allowNavigation": ["your-website.com", "*.your-website.com"]
}
```

| Field | What it does |
|-------|-------------|
| `appName` | Display name on the home screen |
| `appId` | Bundle identifier (reverse domain, e.g. `com.company.app`) |
| `webUrl` | The URL your app loads |
| `backgroundColor` | Splash/loading screen background color |
| `statusBarStyle` | `"dark"` (dark text) or `"light"` (light text) |
| `allowNavigation` | Domains the WebView is allowed to navigate to |
| `orientation` | `"portrait"`, `"landscape"`, or `"any"` |
| `allowBackButton` | Android back button navigates history |
| `allowZoom` | Allow pinch-to-zoom |
| `offlineMessage` | Message shown when offline |

### 2. Add platforms

```bash
npm install
npm run init:ios       # adds iOS project
npm run init:android   # adds Android project
```

### 3. Build and open in IDE

```bash
npm run build:ios      # syncs + opens Xcode
npm run build:android  # syncs + opens Android Studio
```

### 4. Replace app icons

- **iOS**: Replace files in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- **Android**: Replace files in `android/app/src/main/res/mipmap-*/`

Use a tool like [appicon.co](https://appicon.co) to generate all required sizes from a single image.

### 5. Submit to stores

Build a release from Xcode (iOS) or Android Studio (Android) and follow the standard submission process.

## Cloning for a new project

1. Duplicate this folder
2. Edit `app.config.json` with your new app details
3. Run `npm install && npm run init:all`
4. Replace icons and splash screens
5. Build and submit

## App Store Tips

Apple may reject apps that are "just a website." To avoid rejection:
- Ensure your site is mobile-responsive and feels native
- Handle the back button and navigation properly (this template does)
- Show a proper offline screen (this template does)
- Add a splash screen (this template does)
- Consider adding push notifications via your web app

## Project Structure

```
├── app.config.json         # YOUR CONFIG — edit this
├── capacitor.config.ts     # Reads from app.config.json (don't edit)
├── www/                    # Web shell (loading + offline screens)
│   ├── index.html
│   └── js/app.js
├── ios/                    # Generated — open in Xcode
├── android/                # Generated — open in Android Studio
└── package.json
```

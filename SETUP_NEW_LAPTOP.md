# Second Laptop Setup — Paste This Into Claude Code

Copy everything below the line into Claude Code on your second laptop as your first message.

---

I need you to set up this Mac as a development environment for building WebView wrapper apps for iOS and Android. Install and configure everything listed below. For anything that requires `sudo` or a password, tell me to run the command manually and wait for me to confirm before continuing.

## 1. Install Homebrew (if not already installed)

Check if `brew` is available. If not, install it:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 2. Install core software via Homebrew

Install these packages (formulas and casks). Check what's already installed and skip those:

**Formulas:**
- `node` (Node.js — needed for Capacitor CLI)
- `gh` (GitHub CLI — needed for repo access)
- `mas` (Mac App Store CLI — needed to install Xcode)
- `git` (should already be present)

**Casks:**
- `temurin` (Java 26 — latest JDK)
- `temurin@21` (Java 21 LTS — required for Android Gradle builds)
- `android-studio` (Android IDE)
- `android-commandlinetools` (Android SDK manager, emulator tools)

Run: `brew install node gh mas git`

For casks that need sudo, tell me to run each one:
- `brew install --cask temurin`
- `brew install --cask temurin@21`
- `brew install --cask android-studio`
- `brew install --cask android-commandlinetools`

## 3. Install Xcode

Check if Xcode is in /Applications. If not:
```
mas install 497799835
```
This may need sudo — tell me to run it if so.

After Xcode is installed, tell me to run:
```
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Then verify with `xcodebuild -version`.

## 4. Install Android SDK components

After Java and android-commandlinetools are installed, install the Android SDK:

```bash
mkdir -p ~/Library/Android/sdk
yes | sdkmanager --sdk_root=$HOME/Library/Android/sdk "platform-tools" "platforms;android-35" "platforms;android-36" "build-tools;35.0.0" "emulator" "system-images;android-35;google_apis;arm64-v8a" "cmdline-tools;latest"
```

## 5. Create Android emulator

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
echo "no" | $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd -n Pixel_7 -k "system-images;android-35;google_apis;arm64-v8a" -d "pixel_7" --force
```

## 6. Set up Android SDK path for Android Studio

Create the file `~/.zshrc` entry (or append if it exists):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH
```

## 7. Authenticate with GitHub

Tell me to run:
```
gh auth login
```

Choose: GitHub.com → HTTPS → Login with web browser. I'll complete the browser auth flow.

Verify with `gh auth status` — should show logged in as Knight31337.

## 8. Clone the WebView repo

```bash
mkdir -p ~/Documents/Claude/Projects
cd ~/Documents/Claude/Projects
gh repo clone Knight31337/WebView
cd WebView
npm install
```

## 9. Add native platforms and sync

```bash
npx cap add ios
npx cap add android
npx cap sync
```

## 10. Set up Android local.properties

Create `android/local.properties`:
```
sdk.dir=/Users/USERNAME/Library/Android/sdk
```
Replace USERNAME with my actual username (check with `whoami`).

## 11. Verify iOS build

```bash
cd ios/App
xcodebuild -project App.xcodeproj -scheme App -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build
```

This should end with BUILD SUCCEEDED.

## 12. Verify Android build

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
cd android
./gradlew assembleDebug
```

This should end with BUILD SUCCESSFUL.

## 13. Test on simulators

**iOS:**
```bash
xcrun simctl boot "iPhone 17 Pro"
open -a Simulator
xcrun simctl install booted path/to/App.app
xcrun simctl launch booted com.seadogbrewing.treasureisland
```

**Android:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
$ANDROID_HOME/emulator/emulator -avd Pixel_7 &
# Wait for boot, then:
$ANDROID_HOME/platform-tools/adb install android/app/build/outputs/apk/debug/app-debug.apk
$ANDROID_HOME/platform-tools/adb shell am start -n com.example.myapp/com.example.myapp.MainActivity
```

## 14. Verify everything

Run these checks and report the results:
- `node -v` (should be v18+)
- `java -version` (should show both 26 and 21 available)
- `xcodebuild -version` (should show Xcode)
- `gh auth status` (should show Knight31337)
- `adb --version` (should show Android Debug Bridge)
- `xcrun simctl list devices available | grep iPhone` (should list simulators)
- `ls ~/Library/Android/sdk/` (should show build-tools, emulator, platform-tools, platforms, system-images)

Tell me the results of each check so I can verify the setup is complete.

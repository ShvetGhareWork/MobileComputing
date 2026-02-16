# Smart Finance Calculator

A React Native application for calculating Income Tax (India) and Loan EMI.

## 1. Project Setup

### Prerequisites
- Node.js (>= 18)
- Java Development Kit (JDK 17)
- Android Studio (latest)

### Initialization
Run the following commands to initialize the project:

```bash
npx react-native@latest init SmartFinanceCalculator
cd SmartFinanceCalculator
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

## 2. Folder Structure

```
SmartFinanceCalculator/
├── android/                   # Native Android code
├── ios/                       # Native iOS code
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── IncomeTaxCalculatorScreen.tsx
│   │   └── EMICalculatorScreen.tsx
│   └── navigation/
│       └── AppNavigator.tsx
├── App.tsx                    # Entry point
└── package.json
```

## 3. Running the App

### Android
```bash
npx react-native run-android
```

## 4. Building Release APK

### Generate Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
Place `my-release-key.keystore` in `android/app/`.

### Gradle Configuration
Edit `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

Edit `android/app/build.gradle`:
```gradle
...
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Build Command
```bash
cd android
./gradlew assembleRelease
```
The APK will be at `android/app/build/outputs/apk/release/app-release.apk`.

### Install on Device
Connect device via USB and run:
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 5. App Screenshots
| Home Screen | Income Tax Calculator | EMI Calculator |
|-------------|-----------------------|----------------|
| ![Home Screen](placeholder_home.png) | ![Tax Screen](placeholder_tax.png) | ![EMI Screen](placeholder_emi.png) |


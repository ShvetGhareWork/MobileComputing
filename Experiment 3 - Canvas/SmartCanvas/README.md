# Smart Canvas 🎨

Smart Canvas is a high-performance, offline-first mobile drawing application built with **React Native** and **Expo**. It provides a smooth, responsive drawing experience similar to Apple Notes or Procreate Pocket, featuring a minimalist design and essential tools for creativity.

## ✨ Features

- **High-Performance Drawing**: Powered by `@shopify/react-native-skia` for zero-latency strokes.
- **Essential Toolbox**:
  - 🖌️ **Pen Tool**: Smooth, pressure-sensitive feel.
  - 🧼 **Eraser**: Precise correction tool.
  - 🎨 **Color Picker**: Curated palette of vibrant colors.
  - 📏 **Stroke Size**: Adjustable brush thickness slider.
- **Gallery Integration**: Save your masterpieces directly to your device's Camera Roll.
- **Undo/Redo**: Full history support to correct mistakes easily.
- **Offline First**: No internet connection required. Privacy-focused.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (0.73+)
- **Platform**: [Expo SDK 50+](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Graphics Engine**: [@shopify/react-native-skia](https://shopify.github.io/react-native-skia/)
- **File System**: `expo-file-system` & `expo-media-library`
- **Icons**: `lucide-react-native`

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Android Studio (for Android Emulator) or an Android device

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/smart-canvas.git
    cd smart-canvas
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the application:**
    ```bash
    npx expo run:android
    ```
    *Note: This project uses native code (Skia), so it cannot run in Expo GO. You must use a Development Build or the Emulator.*

## 📦 Building for Release (Android)

To generate a signed APK for the Google Play Store or manual installation:

1.  **Generate a Keystore:**
    ```bash
    keytool -genkey -v -keystore release.keystore -alias smartcanvas -keyalg RSA -keysize 2048 -validity 10000
    ```

2.  **Configure Gradle:**
    Add your keystore credentials to `android/gradle.properties`:
    ```properties
    MYAPP_UPLOAD_STORE_FILE=../../release.keystore
    MYAPP_UPLOAD_KEY_ALIAS=smartcanvas
    MYAPP_UPLOAD_STORE_PASSWORD=your_password
    MYAPP_UPLOAD_KEY_PASSWORD=your_password
    ```

3.  **Build APK:**
    ```bash
    cd android
    ./gradlew assembleRelease
    ```
    The APK will be at `android/app/build/outputs/apk/release/app-release.apk`.

For more details, check the [Release Guide](release_guide.md).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

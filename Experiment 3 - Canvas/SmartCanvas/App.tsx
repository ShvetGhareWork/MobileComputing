import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DrawingScreen from './src/screens/DrawingScreen';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        // Add custom fonts here if needed, or remove if using system fonts
    });

    useEffect(() => {
        // Simulate asset loading or just hide splash screen immediately if no assets
        async function prepare() {
            try {
                // Load fonts, make DB connections, etc.
                // await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                await SplashScreen.hideAsync();
            }
        }
        prepare();
    }, []);

    return (
        <View style={styles.container}>
            <DrawingScreen />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

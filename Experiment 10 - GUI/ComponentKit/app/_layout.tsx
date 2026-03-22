import { Stack } from 'expo-router';
import { AppProvider, useAppContext } from '../src/context/AppContext';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { initDb } from '../src/services/formService';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { themePreference } = useAppContext();
  const systemColorScheme = useColorScheme();

  const isDarkMode =
    themePreference === 'Dark' ||
    (themePreference === 'System' && systemColorScheme === 'dark');

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDb().then(() => setDbInitialized(true)).catch(console.error);
  }, []);

  if (!dbInitialized) return null;

  return (
    <AppProvider>
      <ThemeWrapper>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeWrapper>
    </AppProvider>
  );
}

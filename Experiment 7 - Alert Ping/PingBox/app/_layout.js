import { AppProvider } from '../context/AppContext';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { requestPermissions, handleNotificationResponse } from '../services/notificationService';
import { useRouter } from 'expo-router';
import { AppState } from 'react-native';
import { registerBackgroundFetchAsync } from '../services/backgroundService';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    requestPermissions();
    registerBackgroundFetchAsync().catch(console.error);

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response, (data) => {
        if (data.messageId) {
          router.push(`/message/${data.messageId}`);
        }
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="message/[id]" options={{ title: 'Message Detail' }} />
      </Stack>
    </AppProvider>
  );
}

import { Stack } from 'expo-router';
import { LocationProvider } from '../src/context/LocationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocationProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1E1E1E',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'TrailMark Map',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              title: 'Location History',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="location/[id]"
            options={{
              title: 'Location Details',
              presentation: 'card',
            }}
          />
        </Stack>
      </LocationProvider>
    </GestureHandlerRootView>
  );
}

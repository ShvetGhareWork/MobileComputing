import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../../src/context/AppContext';

export default function TabLayout() {
  const theme = useTheme();
  const { submissionCount } = useAppContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          title: 'Form',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="form-textbox" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarBadge: submissionCount > 0 ? submissionCount : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.colors.error, color: theme.colors.onError },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="history" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="overlays"
        options={{
          title: 'Overlays',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="layers" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { useAppContext } from '../../context/AppContext';

export default function TabLayout() {
  const { unreadCount } = useAppContext();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      headerTitleAlign: 'center',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inbox',
          tabBarLabel: 'Inbox',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tabs.Screen
        name="rules"
        options={{
          title: 'Alert Rules',
          tabBarLabel: 'Rules',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}

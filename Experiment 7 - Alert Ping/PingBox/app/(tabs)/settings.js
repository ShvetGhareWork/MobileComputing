import React from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function SettingsScreen() {
  const { settings, updateSettings } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound</Text>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(val) => updateSettings({ soundEnabled: val })}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Vibrate</Text>
          <Switch
            value={settings.vibrateEnabled}
            onValueChange={(val) => updateSettings({ vibrateEnabled: val })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Do Not Disturb</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable DND (10 PM - 7 AM)</Text>
          <Switch
            value={settings.dndEnabled}
            onValueChange={(val) => updateSettings({ dndEnabled: val })}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Alert Priority</Text>
        <View style={styles.priorityContainer}>
          {['low', 'default', 'high'].map(p => (
            <Button
              key={p}
              title={p}
              color={settings.defaultPriority === p ? '#007AFF' : '#CCC'}
              onPress={() => updateSettings({ defaultPriority: p })}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

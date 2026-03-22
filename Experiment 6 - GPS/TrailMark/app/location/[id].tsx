import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocationContext } from '../../src/context/LocationContext';
import { getLocationById, SavedLocation } from '../../src/services/locationService';
import { MapPin, Navigation, Trash2, Calendar } from 'lucide-react-native';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { removeLocation } = useLocationContext();
  const [location, setLocation] = useState<SavedLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (id) {
          const loc = await getLocationById(Number(id));
          setLocation(loc);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const handleOpenMaps = () => {
    if (!location) return;

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${location.latitude},${location.longitude}`;
    const label = location.label;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleDelete = () => {
    if (!location) return;

    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeLocation(location.id);
            router.back();
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Location not found.</Text>
      </View>
    );
  }

  const date = new Date(location.saved_at).toLocaleString();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <MapPin size={32} stroke="#10B981" />
          <Text style={styles.title}>{location.label}</Text>
        </View>

        {location.note ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.note}>{location.note}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordinates</Text>
          <View style={styles.coordsContainer}>
            <Text style={styles.coordText}>Lat: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.coordText}>Lng: {location.longitude.toFixed(6)}</Text>
            {location.accuracy && (
              <Text style={styles.accuracyText}>Accuracy: ±{location.accuracy.toFixed(1)}m</Text>
            )}
          </View>
        </View>

        <View style={styles.dateSection}>
          <Calendar size={16} stroke="#888" />
          <Text style={styles.dateText}>Saved on {date}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMaps}>
          <Navigation size={20} stroke="#FFF" />
          <Text style={styles.buttonText}>Open in Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} stroke="#FFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  note: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
  },
  coordsContainer: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    gap: 4,
  },
  coordText: {
    color: '#10B981',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  accuracyText: {
    color: '#888',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    marginTop: 4,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  dateText: {
    color: '#888',
    fontSize: 14,
  },
  actionsContainer: {
    gap: 16,
  },
  mapButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

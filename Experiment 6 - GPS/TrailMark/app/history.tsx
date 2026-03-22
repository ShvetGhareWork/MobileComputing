import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocationContext } from '../src/context/LocationContext';
import { MapPin, ChevronRight, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getDistance } from 'geolib';

export default function HistoryScreen() {
  const router = useRouter();
  const { savedLocations, currentLocation } = useLocationContext();

  const renderItem = ({ item }: { item: any }) => {
    let distanceText = '';

    if (currentLocation) {
      const distance = getDistance(
        { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
        { latitude: item.latitude, longitude: item.longitude }
      );

      if (distance < 1000) {
        distanceText = `${distance} m away`;
      } else {
        distanceText = `${(distance / 1000).toFixed(1)} km away`;
      }
    }

    const date = new Date(item.saved_at).toLocaleDateString();

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => router.push(`/location/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <MapPin size={20} stroke="#10B981" />
            <Text style={styles.cardTitle} numberOfLines={1}>{item.label}</Text>
          </View>
          {distanceText ? (
            <Text style={styles.distanceText}>{distanceText}</Text>
          ) : null}
        </View>

        {item.note ? (
          <Text style={styles.cardNote} numberOfLines={2}>{item.note}</Text>
        ) : null}

        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <Clock size={14} stroke="#888" />
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <ChevronRight size={20} stroke="#555" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {savedLocations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MapPin size={48} stroke="#555" />
          <Text style={styles.emptyText}>No locations saved yet.</Text>
          <Text style={styles.emptySubtext}>Drop a pin on the map to start your history!</Text>
        </View>
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  distanceText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#4F46E520',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardNote: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#888',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

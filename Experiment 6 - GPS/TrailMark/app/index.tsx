import React, { useRef, useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useLocationContext } from '../src/context/LocationContext';
import { MapPin, Navigation, History, Plus } from 'lucide-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { mapDarkStyle } from '../src/constants/mapStyle';

export default function IndexScreen() {
  const router = useRouter();
  const { currentLocation, savedLocations, locationError, addLocation, isLoading } = useLocationContext();
  const mapRef = useRef<MapView>(null);

  // Bottom Sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Form state
  const [label, setLabel] = useState('');
  const [note, setNote] = useState('');

  // Initial region setup based on current location
  const initialRegion = useMemo(() => {
    if (currentLocation) {
      return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    // Default fallback (e.g., center of some city if no location)
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }, [currentLocation]);

  // Handle center on me
  const handleCenterOnMe = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // Handle opening bottom sheet
  const handleDropPin = () => {
    if (!currentLocation) return;
    setLabel('');
    setNote('');
    setIsSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  // Handle saving location
  const handleSaveLocation = async () => {
    if (!currentLocation || !label.trim()) return;

    try {
      await addLocation(
        label.trim(),
        note.trim(),
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        currentLocation.coords.accuracy
      );
      bottomSheetRef.current?.close();
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Failed to save location', error);
      // could show an alert here
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Locating you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {locationError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapDarkStyle}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {savedLocations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            pinColor="#4F46E5"
            onCalloutPress={() => router.push(`/location/${loc.id}`)}
          >
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{loc.label}</Text>
                {loc.note ? (
                  <Text style={styles.calloutNote} numberOfLines={2}>
                    {loc.note}
                  </Text>
                ) : null}
                <Text style={styles.calloutHint}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.floatingControls}>
        <TouchableOpacity
          style={styles.fabHistory}
          onPress={() => router.push('/history')}
          activeOpacity={0.8}
        >
          <History size={24} stroke="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fabLocation}
          onPress={handleCenterOnMe}
          activeOpacity={0.8}
        >
          <Navigation size={24} stroke="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomCenterContainer}>
        <TouchableOpacity
          style={styles.dropPinButton}
          onPress={handleDropPin}
          activeOpacity={0.9}
        >
          <MapPin size={20} stroke="#FFF" />
          <Text style={styles.dropPinText}>Drop Pin Here</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(idx) => setIsSheetOpen(idx !== -1)}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.sheetContent}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.sheetTitle}>Save Location</Text>

            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                Lat: {currentLocation?.coords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.coordinatesText}>
                Lng: {currentLocation?.coords.longitude.toFixed(6)}
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Label (e.g., Hidden Waterfall)"
              placeholderTextColor="#888"
              value={label}
              onChangeText={setLabel}
              autoFocus
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (optional)"
              placeholderTextColor="#888"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                !label.trim() && styles.saveButtonDisabled
              ]}
              onPress={handleSaveLocation}
              disabled={!label.trim()}
            >
              <Text style={styles.saveButtonText}>Save Pin</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 12,
    fontSize: 16,
  },
  errorBanner: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    padding: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  errorText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  floatingControls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    gap: 16,
  },
  fabHistory: {
    backgroundColor: '#333',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabLocation: {
    backgroundColor: '#4F46E5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomCenterContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dropPinButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    gap: 8,
  },
  dropPinText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutContainer: {
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    width: 200,
  },
  calloutTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  calloutNote: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 8,
  },
  calloutHint: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSheetBackground: {
    backgroundColor: '#1E1E1E',
  },
  bottomSheetIndicator: {
    backgroundColor: '#555',
  },
  sheetContent: {
    flex: 1,
    padding: 24,
  },
  sheetTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coordinatesText: {
    color: '#10B981',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#3730A3',
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

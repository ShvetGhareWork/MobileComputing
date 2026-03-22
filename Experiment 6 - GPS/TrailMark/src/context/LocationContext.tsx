import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import {
  initDb,
  getAllLocations,
  saveLocation as saveLocDb,
  deleteLocation as deleteLocDb,
  SavedLocation,
  startWatching,
  stopWatching,
} from '../services/locationService';

type LocationContextType = {
  currentLocation: Location.LocationObject | null;
  savedLocations: SavedLocation[];
  locationError: string | null;
  isLoading: boolean;
  addLocation: (
    label: string,
    note: string,
    latitude: number,
    longitude: number,
    accuracy: number | null
  ) => Promise<void>;
  removeLocation: (id: number) => Promise<void>;
  refreshLocations: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    const initialize = async () => {
      try {
        initDb();
        await refreshLocations();

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        const initialLoc = await Location.getCurrentPositionAsync({});
        setCurrentLocation(initialLoc);

        sub = await startWatching((loc) => {
          setCurrentLocation(loc);
        });
        setSubscription(sub);
      } catch (error: any) {
        setLocationError(error.message || 'Error initializing location services');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      if (sub) {
        stopWatching(sub);
      }
    };
  }, []);

  const refreshLocations = async () => {
    try {
      const locations = await getAllLocations();
      setSavedLocations(locations);
    } catch (error: any) {
      console.error('Error fetching locations:', error);
    }
  };

  const addLocation = async (
    label: string,
    note: string,
    latitude: number,
    longitude: number,
    accuracy: number | null
  ) => {
    try {
      await saveLocDb(label, note, latitude, longitude, accuracy);
      await refreshLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const removeLocation = async (id: number) => {
    try {
      await deleteLocDb(id);
      await refreshLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        savedLocations,
        locationError,
        isLoading,
        addLocation,
        removeLocation,
        refreshLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

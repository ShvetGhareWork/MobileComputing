import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';

export type SavedLocation = {
  id: number;
  label: string;
  note: string | null;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  saved_at: string;
};

// Open database connection synchronously (Expo SQLite Next handles this)
const db = SQLite.openDatabaseSync('trailmark.db');

export const initDb = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      note TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL,
      saved_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export const saveLocation = (
  label: string,
  note: string,
  latitude: number,
  longitude: number,
  accuracy: number | null
): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.runSync(
        'INSERT INTO locations (label, note, latitude, longitude, accuracy) VALUES (?, ?, ?, ?, ?)',
        [label, note, latitude, longitude, accuracy]
      );
      resolve(result.lastInsertRowId);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllLocations = (): Promise<SavedLocation[]> => {
  return new Promise((resolve, reject) => {
    try {
      const allRows = db.getAllSync<SavedLocation>('SELECT * FROM locations ORDER BY saved_at DESC');
      resolve(allRows);
    } catch (error) {
      reject(error);
    }
  });
};

export const getLocationById = (id: number): Promise<SavedLocation | null> => {
  return new Promise((resolve, reject) => {
    try {
      const row = db.getFirstSync<SavedLocation>('SELECT * FROM locations WHERE id = ?', [id]);
      resolve(row);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteLocation = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.runSync('DELETE FROM locations WHERE id = ?', [id]);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  const location = await Location.getCurrentPositionAsync({});
  return location;
};

export const startWatching = async (
  callback: (location: Location.LocationObject) => void
): Promise<Location.LocationSubscription> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 5,
    },
    callback
  );

  return subscription;
};

export const stopWatching = (subscription: Location.LocationSubscription) => {
  subscription.remove();
};

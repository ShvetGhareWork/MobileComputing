import * as SQLite from 'expo-sqlite';

export interface FormSubmission {
  id?: number;
  full_name: string;
  email: string;
  age: number;
  gender: string;
  country: string;
  notifications_enabled: number;
  preferred_theme: string;
  rating: number;
  bio: string;
  submitted_at?: string;
  profile_photo_uri?: string | null;
}

export const initDb = async () => {
  const db = await SQLite.openDatabaseAsync('componentkit.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      email TEXT,
      age INTEGER,
      gender TEXT,
      country TEXT,
      notifications_enabled INTEGER,
      preferred_theme TEXT,
      rating INTEGER,
      bio TEXT,
      profile_photo_uri TEXT,
      submitted_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

export const saveSubmission = async (submission: FormSubmission): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('componentkit.db');
  const result = await db.runAsync(
    `INSERT INTO form_submissions (
      full_name, email, age, gender, country, notifications_enabled, preferred_theme, rating, bio, profile_photo_uri
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      submission.full_name,
      submission.email,
      submission.age,
      submission.gender,
      submission.country,
      submission.notifications_enabled,
      submission.preferred_theme,
      submission.rating,
      submission.bio,
      submission.profile_photo_uri || null
    ]
  );
  return result.lastInsertRowId;
};

export const getAllSubmissions = async (): Promise<FormSubmission[]> => {
  const db = await SQLite.openDatabaseAsync('componentkit.db');
  const allRows = await db.getAllAsync<FormSubmission>('SELECT * FROM form_submissions ORDER BY submitted_at DESC');
  return allRows;
};

export const deleteSubmission = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('componentkit.db');
  await db.runAsync('DELETE FROM form_submissions WHERE id = ?', [id]);
};

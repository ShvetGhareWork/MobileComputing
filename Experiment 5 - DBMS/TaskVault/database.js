import * as SQLite from 'expo-sqlite';

// Initialize the database connection
let db = null;

export const initDB = async () => {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync('taskvault.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',  -- 'pending' | 'in_progress' | 'done'
        priority TEXT DEFAULT 'medium', -- 'low' | 'medium' | 'high'
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    console.log('Database initialized');
    return db;
  } catch (error) {
    console.error('Failed to initialize database', error);
    throw error;
  }
};

export const getAllTasks = async () => {
  try {
    const database = await initDB();
    const result = await database.getAllAsync('SELECT * FROM tasks ORDER BY created_at DESC');
    return result;
  } catch (error) {
    console.error('Failed to fetch tasks', error);
    return [];
  }
};

export const getTaskById = async (id) => {
  try {
    const database = await initDB();
    const result = await database.getFirstAsync('SELECT * FROM tasks WHERE id = ?', id);
    return result;
  } catch (error) {
    console.error('Failed to fetch task', error);
    return null;
  }
};

export const addTask = async (title, description, priority = 'medium') => {
  try {
    const database = await initDB();
    const result = await database.runAsync(
      'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
      title, description, priority
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Failed to add task', error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const database = await initDB();
    await database.runAsync('UPDATE tasks SET status = ? WHERE id = ?', status, id);
    return true;
  } catch (error) {
    console.error('Failed to update task status', error);
    throw error;
  }
};

export const updateTask = async (id, title, description, priority, status) => {
  try {
    const database = await initDB();
    await database.runAsync(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?',
      title, description, priority, status, id
    );
    return true;
  } catch (error) {
    console.error('Failed to update task', error);
    throw error;
  }
}

export const deleteTask = async (id) => {
  try {
    const database = await initDB();
    await database.runAsync('DELETE FROM tasks WHERE id = ?', id);
    return true;
  } catch (error) {
    console.error('Failed to delete task', error);
    throw error;
  }
};

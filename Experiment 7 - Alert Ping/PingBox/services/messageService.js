import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('pingbox.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        channel TEXT DEFAULT 'sms',   -- 'sms' | 'email' | 'in_app'
        is_read INTEGER DEFAULT 0,
        received_at TEXT DEFAULT (datetime('now', 'localtime'))
      );

      CREATE TABLE IF NOT EXISTS alert_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword TEXT NOT NULL,
        sound TEXT DEFAULT 'default',
        vibrate INTEGER DEFAULT 1,
        priority TEXT DEFAULT 'high'  -- 'low' | 'default' | 'high' | 'max'
      );
    `);
  }
  return db;
};

export const getDB = async () => {
  if (!db) {
    return await initDB();
  }
  return db;
};

export const getAllMessages = async () => {
  const database = await getDB();
  return await database.getAllAsync('SELECT * FROM messages ORDER BY received_at DESC');
};

export const getMessageById = async (id) => {
  const database = await getDB();
  return await database.getFirstAsync('SELECT * FROM messages WHERE id = ?', [id]);
};

export const addMessage = async (sender, content, channel) => {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO messages (sender, content, channel) VALUES (?, ?, ?)',
    [sender, content, channel]
  );
  return result.lastInsertRowId;
};

export const markAsRead = async (id) => {
  const database = await getDB();
  await database.runAsync('UPDATE messages SET is_read = 1 WHERE id = ?', [id]);
};

export const deleteMessage = async (id) => {
  const database = await getDB();
  await database.runAsync('DELETE FROM messages WHERE id = ?', [id]);
};

export const getUnreadCount = async () => {
  const database = await getDB();
  const result = await database.getFirstAsync('SELECT COUNT(*) as count FROM messages WHERE is_read = 0');
  return result ? result.count : 0;
};

export const getAllAlertRules = async () => {
  const database = await getDB();
  return await database.getAllAsync('SELECT * FROM alert_rules');
};

export const addAlertRule = async (keyword, sound, vibrate, priority) => {
  const database = await getDB();
  const result = await database.runAsync(
    'INSERT INTO alert_rules (keyword, sound, vibrate, priority) VALUES (?, ?, ?, ?)',
    [keyword, sound, vibrate, priority]
  );
  return result.lastInsertRowId;
};

export const deleteAlertRule = async (id) => {
  const database = await getDB();
  await database.runAsync('DELETE FROM alert_rules WHERE id = ?', [id]);
};

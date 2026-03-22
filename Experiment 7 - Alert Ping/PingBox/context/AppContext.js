import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initDB,
  getAllMessages,
  getUnreadCount,
  addMessage,
  markAsRead,
  deleteMessage,
  getAllAlertRules,
  addAlertRule,
  deleteAlertRule
} from '../services/messageService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alertRules, setAlertRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrateEnabled: true,
    dndEnabled: false,
    defaultPriority: 'default',
  });

  const loadData = async () => {
    try {
      await initDB();
      const loadedMessages = await getAllMessages();
      const count = await getUnreadCount();
      const rules = await getAllAlertRules();

      const savedSettings = await AsyncStorage.getItem('pingbox_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      setMessages(loadedMessages);
      setUnreadCount(count);
      setAlertRules(rules);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMessage = async (sender, content, channel) => {
    const newId = await addMessage(sender, content, channel);
    await loadData(); // Reload to get updated count and list
    return newId;
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    await loadData();
  };

  const handleDeleteMessage = async (id) => {
    await deleteMessage(id);
    await loadData();
  };

  const handleAddRule = async (keyword, sound, vibrate, priority) => {
    const newId = await addAlertRule(keyword, sound, vibrate, priority);
    await loadData();
    return newId;
  };

  const handleDeleteRule = async (id) => {
    await deleteAlertRule(id);
    await loadData();
  };

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await AsyncStorage.setItem('pingbox_settings', JSON.stringify(updatedSettings));
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        unreadCount,
        alertRules,
        isLoading,
        settings,
        updateSettings,
        refreshData: loadData,
        addMessage: handleAddMessage,
        markAsRead: handleMarkAsRead,
        deleteMessage: handleDeleteMessage,
        addAlertRule: handleAddRule,
        deleteAlertRule: handleDeleteRule
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { addMessage, getAllAlertRules } from './messageService';
import * as Notifications from 'expo-notifications';
import { scheduleAlert } from './notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = 'background-fetch-messages';

// Define the task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const fakeSenders = ['System', 'Admin', 'BackgroundWorker'];
    const fakeMessages = ['Server overload detected', 'Backup completed successfully', 'Low disk space warning', 'New user registered'];
    const channels = ['sms', 'email', 'in_app'];

    const sender = fakeSenders[Math.floor(Math.random() * fakeSenders.length)];
    const content = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];

    const newMessageId = await addMessage(sender, content, channel);
    const alertRules = await getAllAlertRules();

    const savedSettingsStr = await AsyncStorage.getItem('pingbox_settings');
    const settings = savedSettingsStr ? JSON.parse(savedSettingsStr) : {
      dndEnabled: false,
      defaultPriority: 'default'
    };

    let priority = settings.defaultPriority;
    for (const rule of alertRules) {
      if (content.toLowerCase().includes(rule.keyword.toLowerCase())) {
        priority = rule.priority;
        break; // Match first rule
      }
    }

    let shouldFireAlert = true;
    if (settings.dndEnabled) {
      const currentHour = new Date().getHours();
      // DND: 10 PM (22) to 7 AM (7)
      if (currentHour >= 22 || currentHour < 7) {
        shouldFireAlert = false;
      }
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted' && shouldFireAlert) {
        await scheduleAlert(
          `New ${channel.toUpperCase()} from ${sender} (Background)`,
          content,
          { messageId: newMessageId, priority }
        );
    }

    // Return BackgroundFetch.Result.NewData to indicate successful execution and new data fetched
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background task failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the task
export const registerBackgroundFetchAsync = async () => {
  try {
    return await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15, // 15 seconds (Note: OS limits typically prevent exact 15s intervals in production)
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.warn('BackgroundFetch not available:', err);
  }
};

// Unregister the task
export const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};

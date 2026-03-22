import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { scheduleAlert } from '../../services/notificationService';

const fakeSenders = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'];
const fakeMessages = ['Urgent! Call me ASAP.', 'Just checking in, how are things?', 'Meeting rescheduled to 3 PM.', 'Can you review the PR?', 'Happy birthday!', 'Don\'t forget to buy milk.'];
const channels = ['sms', 'email', 'in_app'];

export default function InboxScreen() {
  const { messages, isLoading, addMessage, alertRules, settings } = useAppContext();
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Group messages by channel
  const groupedMessages = channels.map(channel => ({
    title: channel,
    data: messages.filter(msg => msg.channel === channel)
  })).filter(section => section.data.length > 0);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setPermissionStatus(status);
    });
  }, []);

  const simulateIncomingMessage = async () => {
    const sender = fakeSenders[Math.floor(Math.random() * fakeSenders.length)];
    const content = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];

    const newMessageId = await addMessage(sender, content, channel);

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

    if (permissionStatus === 'granted' && shouldFireAlert) {
       scheduleAlert(
          `New ${channel.toUpperCase()} from ${sender}`,
          content,
          { messageId: newMessageId, priority }
       );
    } else if (permissionStatus !== 'granted') {
        console.log("Permission not granted. Simulation without notification.");
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.is_read;
    let priorityColor = 'transparent';
    let priorityCardColor = '#FFF';

    for (const rule of alertRules) {
      if (item.content.toLowerCase().includes(rule.keyword.toLowerCase())) {
        if (rule.priority === 'max') { priorityColor = '#B71C1C'; priorityCardColor = '#FFEBEE'; }
        else if (rule.priority === 'high') { priorityColor = '#F44336'; priorityCardColor = '#FFEBEE'; }
        else if (rule.priority === 'default') { priorityColor = '#FFC107'; priorityCardColor = '#FFFDE7'; }
        else if (rule.priority === 'low') { priorityColor = '#9E9E9E'; priorityCardColor = '#F5F5F5'; }
        break; // Match first rule
      }
    }

    return (
      <TouchableOpacity
        style={[
          styles.messageCard,
          { borderLeftColor: priorityColor, backgroundColor: priorityCardColor },
          isUnread && styles.unreadCard
        ]}
        onPress={() => router.push(`/message/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.sender, isUnread && styles.unreadText]}>{item.sender}</Text>
          <Text style={styles.channelBadge}>{item.channel.toUpperCase()}</Text>
        </View>
        <Text style={[styles.contentPreview, isUnread && styles.unreadText]} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>{new Date(item.received_at).toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      {permissionStatus !== 'granted' && (
        <View style={styles.permissionWarning}>
           <Text style={styles.permissionText}>Notifications permission denied. Alerts will not appear.</Text>
           <Button title="Request Permissions" onPress={async () => {
             const { status } = await Notifications.requestPermissionsAsync();
             setPermissionStatus(status);
           }} />
        </View>
      )}

      <SectionList
        sections={groupedMessages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages yet.</Text>}
      />
      <View style={styles.buttonContainer}>
        <Button title="Simulate Incoming Message" onPress={simulateIncomingMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionWarning: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  permissionText: {
    color: '#D32F2F',
    marginBottom: 5,
  },
  listContainer: {
    padding: 15,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    marginTop: 15,
    backgroundColor: '#F2F2F7', // To match container background and mask scrolling items
  },
  messageCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#007AFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sender: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#000',
  },
  channelBadge: {
    fontSize: 10,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
    color: '#666',
  },
  contentPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
});

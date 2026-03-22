import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '../../context/AppContext';
import { getMessageById } from '../../services/messageService';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams();
  const { markAsRead, deleteMessage } = useAppContext();
  const router = useRouter();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const msg = await getMessageById(parseInt(id, 10));
      setMessage(msg);
      if (msg && !msg.is_read) {
        markAsRead(msg.id);
      }
    };
    fetchMessage();
  }, [id]);

  const handleReply = async () => {
    if (message.channel === 'sms') {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          ['1234567890'], // Placeholder number, would ideally come from DB
          `Re: ${message.content}`
        );
      } else {
        Alert.alert("SMS not available on this device");
      }
    } else if (message.channel === 'email') {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: ['test@example.com'], // Placeholder
          subject: `Re: Message from PingBox`,
          body: `\n\n> ${message.content}`,
        });
      } else {
        Alert.alert("Mail not available on this device");
      }
    } else {
      Alert.alert("Reply for in_app not implemented.");
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Message', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteMessage(message.id);
        router.back();
      }},
    ]);
  };

  if (!message) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sender}>{message.sender}</Text>
          <Text style={styles.channelBadge}>{message.channel.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{new Date(message.received_at).toLocaleString()}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{message.content}</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Reply" onPress={handleReply} />
        <View style={{height: 10}}/>
        <Button title="Delete" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sender: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  channelBadge: {
    fontSize: 12,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actions: {
    marginTop: 20,
  },
});

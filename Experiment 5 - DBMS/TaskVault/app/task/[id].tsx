import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '../../store/useTaskStore';
import { getTaskById } from '../../database';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

const STATUS_COLORS = {
  pending: '#6b7280',
  in_progress: '#3b82f6',
  done: '#10b981',
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { updateTaskStatus, deleteTask } = useTaskStore();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTaskById(Number(id));
        if (data) {
          setTask(data);
        } else {
          Alert.alert('Error', 'Task not found');
          router.back();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, router]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus(task.id, newStatus);
      setTask({ ...task, status: newStatus });
    } catch {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(task.id);
            router.back();
          } catch {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  if (loading || !task) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{task.title}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[task.priority] }]}>
          <Text style={styles.badgeText}>Priority: {task.priority}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[task.status] }]}>
          <Text style={styles.badgeText}>Status: {task.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={[styles.section, { borderColor: backgroundColor === '#fff' ? '#eee' : '#333' }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Description</Text>
        <Text style={[styles.description, { color: textColor }]}>
          {task.description || 'No description provided.'}
        </Text>
      </View>

      <View style={[styles.section, { borderColor: backgroundColor === '#fff' ? '#eee' : '#333' }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Created At</Text>
        <Text style={[styles.date, { color: '#888' }]}>{new Date(task.created_at).toLocaleString()}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={[styles.sectionTitle, { color: textColor, marginBottom: 12 }]}>Change Status</Text>
        <View style={styles.statusButtons}>
          {['pending', 'in_progress', 'done'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                task.status === status && { backgroundColor: STATUS_COLORS[status], borderColor: STATUS_COLORS[status] },
                { borderColor: backgroundColor === '#fff' ? '#ccc' : '#444' }
              ]}
              onPress={() => handleStatusChange(status)}
              disabled={task.status === status}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  task.status === status ? { color: '#fff' } : { color: textColor },
                ]}
              >
                {status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  deleteButton: {
    padding: 4,
  },
  badges: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  date: {
    fontSize: 14,
  },
  actionsContainer: {
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

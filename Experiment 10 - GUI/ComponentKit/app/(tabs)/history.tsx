import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Card, Text, Avatar, Modal, Portal, Button, Dialog, ActivityIndicator } from 'react-native-paper';
import { getAllSubmissions, deleteSubmission, FormSubmission } from '../../src/services/formService';
import { useAppContext } from '../../src/context/AppContext';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function HistoryScreen() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateSubmissionCount } = useAppContext();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSubmissions();
    }, [])
  );

  const handleCardPress = (item: FormSubmission) => {
    setSelectedSubmission(item);
    setModalVisible(true);
  };

  const handleLongPress = (id: number) => {
    setItemToDelete(id);
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteSubmission(itemToDelete);
        setDialogVisible(false);
        setItemToDelete(null);
        await fetchSubmissions();
        await updateSubmissionCount();
      } catch (e) {
        console.error('Delete failed', e);
      }
    }
  };

  const cancelDelete = () => {
    setDialogVisible(false);
    setItemToDelete(null);
  };

  if (loading && submissions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchSubmissions} />}
      >
        {submissions.length === 0 ? (
          <Text style={styles.emptyText}>No submissions found.</Text>
        ) : (
          submissions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleCardPress(item)}
              onLongPress={() => item.id && handleLongPress(item.id)}
            >
              <Card style={styles.card}>
                <Card.Title
                  title={item.full_name}
                  subtitle={`${item.email} • ${item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : ''}`}
                  left={(props) =>
                    item.profile_photo_uri ? (
                      <Avatar.Image {...props} source={{ uri: item.profile_photo_uri }} />
                    ) : (
                      <Avatar.Text {...props} label={item.full_name.substring(0, 2).toUpperCase()} />
                    )
                  }
                />
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Details Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          {selectedSubmission && (
            <View>
              <Text variant="titleLarge" style={styles.modalTitle}>Submission Details</Text>
              <Text variant="bodyMedium">Name: {selectedSubmission.full_name}</Text>
              <Text variant="bodyMedium">Email: {selectedSubmission.email}</Text>
              <Text variant="bodyMedium">Age: {selectedSubmission.age}</Text>
              <Text variant="bodyMedium">Gender: {selectedSubmission.gender}</Text>
              <Text variant="bodyMedium">Country: {selectedSubmission.country}</Text>
              <Text variant="bodyMedium">Notifications: {selectedSubmission.notifications_enabled ? 'Yes' : 'No'}</Text>
              <Text variant="bodyMedium">Theme: {selectedSubmission.preferred_theme}</Text>
              <Text variant="bodyMedium">Mood Rating: {selectedSubmission.rating}/10</Text>
              <Text variant="bodyMedium">Bio: {selectedSubmission.bio}</Text>
              <Button style={{ marginTop: 20 }} onPress={() => setModalVisible(false)}>
                Close
              </Button>
            </View>
          )}
        </Modal>
      </Portal>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={cancelDelete}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to delete this submission? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelDelete}>Cancel</Button>
            <Button onPress={confirmDelete} textColor="red">Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
});

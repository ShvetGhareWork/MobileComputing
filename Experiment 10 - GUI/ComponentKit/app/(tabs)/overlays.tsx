import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image } from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  Modal,
  Snackbar,
  Banner,
  useTheme,
  Card,
  Avatar
} from 'react-native-paper';

export default function OverlaysScreen() {
  const theme = useTheme();

  // Dialog State
  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // Snackbar State
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const showSnackbar = () => setSnackbarVisible(true);
  const hideSnackbar = () => setSnackbarVisible(false);

  // Banner State
  const [bannerVisible, setBannerVisible] = useState(false);
  const toggleBanner = () => setBannerVisible(!bannerVisible);

  // BottomSheet-style Modal State
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const showBottomSheet = () => setBottomSheetVisible(true);
  const hideBottomSheet = () => setBottomSheetVisible(false);

  return (
    <View style={styles.container}>
      <Banner
        visible={bannerVisible}
        actions={[
          {
            label: 'Fix it',
            onPress: () => setBannerVisible(false),
          },
          {
            label: 'Learn more',
            onPress: () => setBannerVisible(false),
          },
        ]}
        icon={({ size }) => (
          <Avatar.Icon size={size} icon="alert" style={{ backgroundColor: theme.colors.error }} />
        )}>
        There was a problem processing a transaction on your credit card.
      </Banner>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title title="Overlays & Notifications" />
          <Card.Content style={styles.contentSpacing}>
            <Button mode="contained" onPress={showDialog}>
              Show Dialog
            </Button>
            <Button mode="outlined" onPress={showModal}>
              Show Modal
            </Button>
            <Button mode="contained-tonal" onPress={showSnackbar}>
              Show Snackbar
            </Button>
            <Button mode="elevated" onPress={toggleBanner}>
              Toggle Banner
            </Button>
            <Button mode="outlined" onPress={showBottomSheet}>
              Show Bottom Sheet
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={styles.textCenter}>This is a dialog</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">This is simple dialog with title, content, and actions. Tap cancel or agree to dismiss it.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={hideDialog}>Agree</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Standard Modal */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleLarge" style={styles.modalTitle}>Custom Modal Content</Text>
          <Text variant="bodyMedium" style={styles.modalBody}>
            Modals are highly customizable and can contain anything you want.
          </Text>
          <Button mode="contained" onPress={hideModal}>Dismiss</Button>
        </Modal>
      </Portal>

      {/* Bottom Sheet Modal */}
      <Portal>
        <Modal
          visible={bottomSheetVisible}
          onDismiss={hideBottomSheet}
          contentContainerStyle={[styles.bottomSheet, { backgroundColor: theme.colors.surface }]}
          style={styles.bottomSheetWrapper}
        >
          <View style={styles.dragHandle} />
          <Text variant="titleLarge" style={styles.modalTitle}>Bottom Sheet Modal</Text>
          <Text variant="bodyMedium" style={styles.modalBody}>
            This is styled to look like a bottom sheet that slides up from the bottom of the screen.
          </Text>
          <Button mode="outlined" onPress={hideBottomSheet} style={styles.bottomSheetButton}>
            Close
          </Button>
        </Modal>
      </Portal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
            hideSnackbar();
          },
        }}>
        This is a snackbar warning!
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  contentSpacing: {
    gap: 16,
  },
  textCenter: {
    textAlign: 'center',
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    marginBottom: 20,
    textAlign: 'center',
  },
  bottomSheetWrapper: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40, // safe area padding
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 16,
    alignSelf: 'center',
  },
  bottomSheetButton: {
    marginTop: 20,
    width: '100%',
  },
});

import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { useStore } from '../store/useStore';
import * as FileSystem from 'expo-file-system';
import { bluetoothManager } from './BluetoothManager';

export const pickFileForTransfer = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to send files.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow all types if possible, though 'Images' is safer for now
      quality: 1,
      base64: true, // Directly get base64 for transfer simplicity
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      useStore.getState().addLog(`Selected file: ${asset.uri}`);
      
      // If base64 is not provided by picker (sometimes happens), read it manually
      let fileData = asset.base64;
      if (!fileData) {
          useStore.getState().addLog('Reading file data...');
          fileData = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
      }

      if (fileData) {
          useStore.getState().addLog(`Starting transfer... Size: ${fileData.length} chars`);
          await bluetoothManager.sendData(fileData);
      } else {
          useStore.getState().addLog('Error: Could not read file data.');
      }
    }
  } catch (error: any) {
    useStore.getState().addLog(`Picker Error: ${error.message}`);
  }
};

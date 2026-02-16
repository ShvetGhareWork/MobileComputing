/* eslint-disable no-bitwise */
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, NativeModules, NativeEventEmitter } from 'react-native';
import { useStore } from '../store/useStore';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

const { BlePeripheralModule } = NativeModules;
const peripheralEmitter = new NativeEventEmitter(BlePeripheralModule);

class BluetoothManager {
  manager: BleManager;
  subscription: any;
  receivedBuffer: string = '';

  constructor() {
    this.manager = new BleManager();
  }

  initialize = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);

      const allGranted = Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        useStore.getState().addLog('Permissions not granted');
        return false;
      }
    }
    return true;
  };

  scanForDevices = () => {
    useStore.getState().setIsScanning(true);
    useStore.getState().clearDevices();

    this.manager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if (error) {
        useStore.getState().addLog(`Scan Error: ${error.message}`);
        useStore.getState().setIsScanning(false);
        return;
      }

      if (device && (device.name === 'BlueDrop' || device.localName === 'BlueDrop')) {
        useStore.getState().addDevice(device);
      }
    });

    setTimeout(() => {
      this.manager.stopDeviceScan();
      useStore.getState().setIsScanning(false);
    }, 10000);
  };

  connectToDevice = async (deviceId: string) => {
    try {
      this.manager.stopDeviceScan();
      useStore.getState().setIsScanning(false);
      useStore.getState().addLog(`Connecting to ${deviceId}...`);

      const device = await this.manager.connectToDevice(deviceId);
      useStore.getState().addLog('Connected! Discovering services...');
      
      await device.discoverAllServicesAndCharacteristics();
      useStore.getState().setConnectedDevice(device);
      useStore.getState().addLog('Services discovered. Ready to transfer.');
      
    } catch (error: any) {
      useStore.getState().addLog(`Connection Error: ${error.message}`);
    }
  };

  sendData = async (data: string) => {
    const device = useStore.getState().connectedDevice;
    if (!device) return;

    try {
      // Small delay to ensure connection is stable
      await new Promise(resolve => setTimeout(resolve, 500));

      const chunks = this.chunkString(data, 400); // Safely smaller chunk size
      useStore.getState().addLog(`Sending ${chunks.length} chunks...`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const base64Data = Buffer.from(chunk).toString('base64');
        
        await device.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          base64Data
        );
        
        const progress = Math.round(((i + 1) / chunks.length) * 100);
        useStore.getState().setTransferProgress(progress);
      }
      useStore.getState().addLog('Data sent successfully!');
    } catch (error: any) {
      useStore.getState().addLog(`Send Error: ${error.message}`);
    }
  };

  disconnect = async () => {
      const device = useStore.getState().connectedDevice;
      if (device) {
          await this.manager.cancelDeviceConnection(device.id);
          useStore.getState().setConnectedDevice(null);
      }
  }

  // --- Peripheral Methods ---

  startAdvertising = async () => {
      try {
          useStore.getState().addLog('Starting Advertising...');
          this.receivedBuffer = ''; // Reset buffer
          await BlePeripheralModule.startAdvertising();
          
          peripheralEmitter.addListener('onAdvertisingStarted', () => {
              useStore.getState().addLog('Advertising Started Successfully');
          });
          
          peripheralEmitter.addListener('onDeviceConnected', (address) => {
             useStore.getState().addLog(`Device Connected: ${address}`);
             // Verify this is working as expected
             useStore.getState().setConnectedDevice({ id: address, name: 'Remote Sender' } as any); 
          });

          peripheralEmitter.addListener('onDataReceived', (base64Data) => {
             // Append data
             const chunk = Buffer.from(base64Data, 'base64').toString('utf-8');
             this.receivedBuffer += chunk;
             useStore.getState().addLog(`Received chunk. Total size: ${this.receivedBuffer.length}`);
             // Update progress? We don't know total size yet.
          });
          
      } catch (error: any) {
          useStore.getState().addLog(`Advertising Error: ${error.message || error}`);
      }
  }

  stopAdvertising = () => {
      try {
          BlePeripheralModule.stopAdvertising();
          peripheralEmitter.removeAllListeners('onAdvertisingStarted');
          peripheralEmitter.removeAllListeners('onDeviceConnected');
          peripheralEmitter.removeAllListeners('onDataReceived');
          useStore.getState().addLog('Advertising Stopped');
      } catch (error) {
          // ignore
      }
  }

  saveReceivedFile = async () => {
      try {
          if (!this.receivedBuffer) {
              useStore.getState().addLog('No data to save.');
              return;
          }

          const filename = `received_${Date.now()}.png`; // Creating simple logic for now, assuming image.
          // Note: In a real app we'd send metadata first (filename, type).
          // Here we assume it's the base64 of an image? No, wait. 
          // `sendData` sends base64 encoding of the chunk. 
          // `onDataReceived` receives base64 from Native.
          // Native `onCharacteristicWriteRequest` gets bytes. 
          // `BlePeripheralModule` converts bytes to Base64 String -> sends to JS.
          // JS `Buffer.from(base64Data, 'base64').toString('utf-8')` -> This decodes the base64 BACK to the original string.
          // IF `sendData` sent `data` (which was already base64 of image), then `this.receivedBuffer` IS the base64 string of the image.
          // So we can save it directly.
          
          // @ts-ignore
          const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + filename;
          await FileSystem.writeAsStringAsync(fileUri, this.receivedBuffer, { encoding: 'base64' });
          
          useStore.getState().addLog(`File saved to: ${fileUri}`);
          
          // Optionally save to gallery
          // await MediaLibrary.saveToLibraryAsync(fileUri); // Requires 'expo-media-library'
          
      } catch (error: any) {
           useStore.getState().addLog(`Save Error: ${error.message}`);
      }
  }

  private chunkString(str: string, length: number) {
    return str.match(new RegExp('.{1,' + length + '}', 'g')) || [];
  }
}

export const bluetoothManager = new BluetoothManager();

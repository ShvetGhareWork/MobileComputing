import { create } from 'zustand';
import { Device } from 'react-native-ble-plx';

interface AppState {
  role: 'SENDER' | 'RECEIVER' | null;
  isScanning: boolean;
  devices: Device[];
  connectedDevice: Device | null;
  transferProgress: number;
  log: string[];
  setRole: (role: 'SENDER' | 'RECEIVER' | null) => void;
  setIsScanning: (isScanning: boolean) => void;
  addDevice: (device: Device) => void;
  clearDevices: () => void;
  setConnectedDevice: (device: Device | null) => void;
  setTransferProgress: (progress: number) => void;
  addLog: (message: string) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  role: null,
  isScanning: false,
  devices: [],
  connectedDevice: null,
  transferProgress: 0,
  log: [],
  setRole: (role) => set({ role }),
  setIsScanning: (isScanning) => set({ isScanning }),
  addDevice: (device) =>
    set((state) => {
      if (state.devices.some((d) => d.id === device.id)) return state;
      return { devices: [...state.devices, device] };
    }),
  clearDevices: () => set({ devices: [] }),
  setConnectedDevice: (connectedDevice) => set({ connectedDevice }),
  setTransferProgress: (transferProgress) => set({ transferProgress }),
  addLog: (message) => set((state) => ({ log: [message, ...state.log].slice(0, 50) })),
  reset: () =>
    set({
      role: null,
      isScanning: false,
      devices: [],
      connectedDevice: null,
      transferProgress: 0,
      log: [],
    }),
}));

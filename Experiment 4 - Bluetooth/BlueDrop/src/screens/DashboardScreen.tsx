import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useStore } from '../store/useStore';
import { bluetoothManager } from '../services/BluetoothManager';
import { Button } from '../components/Button';

// Mock Device for UI testing until real devices are scanned
const MOCK_DEVICES = [
    { id: '1', name: 'Pixel 6 Pro', rssi: -50 },
    { id: '2', name: 'Galaxy S22', rssi: -65 },
];

export const DashboardScreen = () => {
    const { role, isScanning, devices, log, setRole } = useStore();

    useEffect(() => {
        // Initial permission check
        bluetoothManager.initialize();
    }, []);

    useEffect(() => {
        if (role === 'RECEIVER') {
            bluetoothManager.startAdvertising();
        } else {
            bluetoothManager.stopAdvertising();
        }

        return () => {
            bluetoothManager.stopAdvertising();
        }
    }, [role]);

    const handleScan = () => {
        bluetoothManager.scanForDevices();
    };

    const handleConnect = (deviceId: string) => {
        bluetoothManager.connectToDevice(deviceId);
    };

    // Render Role Selection if no role selected
    if (!role) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>BlueDrop</Text>
                <Text style={styles.subtitle}>Select your role</Text>
                <View style={styles.roleContainer}>
                    <Button title="Sender (Central)" onPress={() => setRole('SENDER')} />
                    <Button title="Receiver (Peripheral)" onPress={() => setRole('RECEIVER')} variant="secondary" />
                </View>
                <Text style={styles.info}>
                    * Sender Scans & Connects
                    {'\n'}* Receiver Advertises (Not fully supported in Expo Go/Std Plugin)
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>BlueDrop</Text>
                <Text style={styles.roleTag}>{role}</Text>
            </View>

            <View style={styles.content}>
                {role === 'SENDER' ? (
                    <>
                        <Button
                            title={isScanning ? 'Scanning...' : 'Scan for Devices'}
                            onPress={handleScan}
                            disabled={isScanning}
                        />

                        <View style={styles.listContainer}>
                            <Text style={styles.sectionTitle}>Available Devices</Text>
                            {devices.length === 0 ? (
                                <Text style={styles.emptyText}>No devices found. Ensure BlueDrop is running on the other device.</Text>
                            ) : (
                                <FlatList
                                    data={devices}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <View style={styles.deviceItem}>
                                            <View>
                                                <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
                                                <Text style={styles.deviceId}>{item.id} (RSSI: {item.rssi})</Text>
                                            </View>
                                            <Button
                                                title="Connect"
                                                onPress={() => handleConnect(item.id)}
                                                variant="secondary"
                                            />
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </>
                ) : (
                    <View style={styles.receiverContainer}>
                        <ActivityIndicator size="large" color="#00e5ff" />
                        <Text style={styles.waitingText}>Waiting for connection...</Text>
                        <Text style={styles.hintText}>Receiver is Advertising. Sender should scan and connect.</Text>
                        {useStore.getState().log.length > 0 && <Button title="Save Received File" onPress={() => bluetoothManager.saveReceivedFile()} variant="primary" />}
                    </View>
                )}

                {/* Transfer Controls for Sender when Connected */}
                {role === 'SENDER' && useStore.getState().connectedDevice && (
                    <View style={styles.transferContainer}>
                        <Text style={styles.sectionTitle}>Transfer</Text>
                        <Button title="Pick & Send File" onPress={() => import('../services/FilePickerService').then(m => m.pickFileForTransfer())} />
                        {useStore.getState().transferProgress > 0 && (
                            <Text style={styles.progressText}>Transfer Progress: {useStore.getState().transferProgress}%</Text>
                        )}
                    </View>
                )}

                {/* Logs Section for Debugging */}
                <View style={styles.logsContainer}>
                    <Text style={styles.logsTitle}>Logs</Text>
                    <FlatList
                        data={log}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={styles.logText}>{`> ${item}`}</Text>}
                    />
                </View>

                <Button title="Change Role" onPress={() => useStore.getState().reset()} variant="danger" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a', // Cyber/Dark theme
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#00e5ff', // Neon Blue
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginBottom: 40,
    },
    roleContainer: {
        gap: 16,
        marginBottom: 30,
    },
    info: {
        color: '#555',
        textAlign: 'center',
        fontSize: 12,
    },
    roleTag: {
        color: '#00e5ff',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#00e5ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
    },
    content: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
        marginTop: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    },
    deviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    deviceName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deviceId: {
        color: '#888',
        fontSize: 12,
    },
    receiverContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    waitingText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
        fontWeight: '600',
    },
    hintText: {
        color: '#666',
        marginTop: 10,
    },
    logsContainer: {
        height: 150,
        backgroundColor: '#111',
        borderRadius: 8,
        padding: 10,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    logsTitle: {
        color: '#666',
        fontSize: 12,
        marginBottom: 4,
    },
    logText: {
        color: '#00ff00', // Hacker green logs
        fontFamily: 'monospace',
        fontSize: 10,
    },
    transferContainer: {
        marginTop: 20,
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    progressText: {
        color: '#00e5ff',
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '600',
    },
});

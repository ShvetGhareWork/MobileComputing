import React, { useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Save } from 'lucide-react-native';
import DrawingCanvas, { DrawingCanvasRef } from '../components/DrawingCanvas';
import Toolbox from '../components/Toolbox';
import { saveImageToGallery } from '../utils/fileSystem';

const DrawingScreen: React.FC = () => {
    const canvasRef = useRef<DrawingCanvasRef>(null);
    const [color, setColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (canvasRef.current) {
            setSaving(true);
            try {
                const image = await canvasRef.current.getSnapshot();
                if (image) {
                    const success = await saveImageToGallery(image);
                    if (success) {
                        Alert.alert('Saved', 'Artwork saved to your gallery!');
                    } else {
                        // Alert already shown in saveImageToGallery for permissions
                    }
                } else {
                    Alert.alert('Error', 'Could not capture canvas.');
                }
            } catch (e) {
                Alert.alert('Error', 'Failed to save artwork.');
                console.error(e);
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.title}>Smart Canvas</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Save color="#fff" size={20} />
                    )}
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.canvasContainer}>
                <DrawingCanvas
                    ref={canvasRef}
                    color={color}
                    strokeWidth={strokeWidth}
                    tool={tool}
                />
            </View>

            <Toolbox
                color={color}
                setColor={setColor}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                tool={tool}
                setTool={setTool}
                onClear={() => canvasRef.current?.clear()}
                onUndo={() => canvasRef.current?.undo()}
                onRedo={() => canvasRef.current?.redo()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF', // Clean Blue
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    saveText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: '600',
    },
    canvasContainer: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
});

export default DrawingScreen;

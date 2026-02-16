import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Palette, Eraser, Trash2, Undo, Redo } from 'lucide-react-native';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080', '#A52A2A', '#808080'];

interface ToolboxProps {
    color: string;
    setColor: (color: string) => void;
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
    tool: 'pen' | 'eraser';
    setTool: (tool: 'pen' | 'eraser') => void;
    onClear: () => void;
    onUndo: () => void;
    onRedo: () => void;
}

const Toolbox: React.FC<ToolboxProps> = ({
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    tool,
    setTool,
    onClear,
    onUndo,
    onRedo,
}) => {
    return (
        <View style={styles.container}>
            {/* Tools Row */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.toolButton, tool === 'pen' && styles.activeTool]}
                    onPress={() => setTool('pen')}
                >
                    <Palette color={tool === 'pen' ? '#fff' : '#000'} size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toolButton, tool === 'eraser' && styles.activeTool]}
                    onPress={() => setTool('eraser')}
                >
                    <Eraser color={tool === 'eraser' ? '#fff' : '#000'} size={24} />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.actionButton} onPress={onUndo}>
                    <Undo color="#000" size={24} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onRedo}>
                    <Redo color="#000" size={24} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={onClear}>
                    <Trash2 color="#FF0000" size={24} />
                </TouchableOpacity>
            </View>

            {/* Colors Row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
                {COLORS.map((c) => (
                    <TouchableOpacity
                        key={c}
                        style={[
                            styles.colorSwatch,
                            { backgroundColor: c },
                            color === c && tool === 'pen' && styles.activeColor,
                        ]}
                        onPress={() => {
                            setColor(c);
                            setTool('pen');
                        }}
                    />
                ))}
            </ScrollView>

            {/* Slider Row */}
            <View style={styles.sliderRow}>
                <Text style={styles.sliderLabel}>Size: {strokeWidth.toFixed(0)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={50}
                    step={1}
                    value={strokeWidth}
                    onValueChange={setStrokeWidth}
                    minimumTrackTintColor="#000000"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#000000"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    toolButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    activeTool: {
        backgroundColor: '#000',
    },
    actionButton: {
        padding: 10,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#ddd',
        marginHorizontal: 8,
    },
    colorRow: {
        marginBottom: 12,
    },
    colorSwatch: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeColor: {
        borderColor: '#000',
        transform: [{ scale: 1.1 }],
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sliderLabel: {
        width: 60,
        fontSize: 14,
        fontWeight: '600',
    },
    slider: {
        flex: 1,
        height: 40,
    },
});

export default Toolbox;

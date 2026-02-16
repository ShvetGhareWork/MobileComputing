import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled = false }) => {
    const getBackgroundColor = () => {
        if (disabled) return '#333333';
        switch (variant) {
            case 'secondary': return '#2c2c2e';
            case 'danger': return '#ff3b30';
            default: return '#007aff';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: getBackgroundColor() }]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledText: {
        color: '#888888',
    },
});

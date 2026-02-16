import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }: { navigation: any }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Finance Calculator</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('IncomeTax')}
            >
                <Text style={styles.buttonText}>Income Tax Calculator</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EMI')}
            >
                <Text style={styles.buttonText}>Loan EMI Calculator</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF', // Standard Blue
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default HomeScreen;

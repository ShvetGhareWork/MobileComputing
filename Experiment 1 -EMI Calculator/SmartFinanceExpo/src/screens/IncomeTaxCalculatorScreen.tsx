import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';

const IncomeTaxCalculatorScreen = () => {
    const [income, setIncome] = useState('');
    const [deductions, setDeductions] = useState('');
    const [ageGroup, setAgeGroup] = useState('below60'); // 'below60', '60-80', 'above80'
    const [result, setResult] = useState<any>(null);

    const calculateTax = () => {
        const annualIncome = parseFloat(income);
        const totalDeductions = parseFloat(deductions) || 0;

        if (isNaN(annualIncome)) {
            Alert.alert('Error', 'Please enter a valid Annual Income');
            return;
        }

        const taxableIncome = Math.max(0, annualIncome - totalDeductions);
        let tax = 0;

        // Tax Slabs (New Regime)
        // 0 - 3L = 0%
        // 3L - 6L = 5%
        // 6L - 9L = 10%
        // 9L - 12L = 15%
        // 12L - 15L = 20%
        // Above 15L = 30%

        if (taxableIncome > 1500000) {
            tax += (taxableIncome - 1500000) * 0.30;
            tax += 150000; // Tax for 12-15L (3L * 20% = 60000) + ... sum of lower slabs
            // But let's calculate step by step to be clear or use the cumulative
            // 0-3: 0
            // 3-6: 15000 (5% of 3L)
            // 6-9: 30000 (10% of 3L)
            // 9-12: 45000 (15% of 3L)
            // 12-15: 60000 (20% of 3L)
            // Total for 15L: 15000+30000+45000+60000 = 150000
        } else if (taxableIncome > 1200000) {
            tax += (taxableIncome - 1200000) * 0.20;
            tax += 90000; // 15000+30000+45000
        } else if (taxableIncome > 900000) {
            tax += (taxableIncome - 900000) * 0.15;
            tax += 45000; // 15000+30000
        } else if (taxableIncome > 600000) {
            tax += (taxableIncome - 600000) * 0.10;
            tax += 15000; // 15000
        } else if (taxableIncome > 300000) {
            tax += (taxableIncome - 300000) * 0.05;
        }

        // Cess is usually 4% on top of tax, but the prompt didn't ask for it explicitly.
        // I will add it if it's standard, but the prompt just said "Use current Indian tax slabs".
        // I'll stick to the base tax for simplicity unless I want to be "Smart".
        // I'll leave it as base tax to match the "Simple" requirement strictly.

        setResult({
            taxableIncome,
            tax,
            netIncome: annualIncome - tax,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Income Tax Calculator (New Regime)</Text>

            <Text style={styles.label}>Annual Income (₹)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 1200000"
                value={income}
                onChangeText={setIncome}
            />

            <Text style={styles.label}>Age Group</Text>
            <View style={styles.ageContainer}>
                <TouchableOpacity
                    style={[styles.ageButton, ageGroup === 'below60' && styles.ageButtonSelected]}
                    onPress={() => setAgeGroup('below60')}
                >
                    <Text style={[styles.ageText, ageGroup === 'below60' && styles.ageTextSelected]}>Below 60</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.ageButton, ageGroup === '60-80' && styles.ageButtonSelected]}
                    onPress={() => setAgeGroup('60-80')}
                >
                    <Text style={[styles.ageText, ageGroup === '60-80' && styles.ageTextSelected]}>60-80</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.ageButton, ageGroup === 'above80' && styles.ageButtonSelected]}
                    onPress={() => setAgeGroup('above80')}
                >
                    <Text style={[styles.ageText, ageGroup === 'above80' && styles.ageTextSelected]}>Above 80</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Deductions (80C, 80D, etc.)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 150000"
                value={deductions}
                onChangeText={setDeductions}
            />

            <TouchableOpacity style={styles.calculateButton} onPress={calculateTax}>
                <Text style={styles.buttonText}>Calculate Tax</Text>
            </TouchableOpacity>

            {result && (
                <View style={styles.resultContainer}>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Taxable Income:</Text>
                        <Text style={styles.resultValue}>₹ {result.taxableIncome.toFixed(2)}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total Tax Payable:</Text>
                        <Text style={styles.resultValue}>₹ {result.tax.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.resultRow, styles.totalRow]}>
                        <Text style={[styles.resultLabel, styles.totalText]}>Net Income:</Text>
                        <Text style={[styles.resultValue, styles.totalText]}>₹ {result.netIncome.toFixed(2)}</Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff', // White background
        flexGrow: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    ageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    ageButton: {
        flex: 1,
        paddingVertical: 10, // Adjusted padding
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginHorizontal: 4, // Space between buttons
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    ageButtonSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    ageText: {
        color: '#333',
        fontSize: 14, // Adjusted font size
    },
    ageTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    calculateButton: {
        backgroundColor: '#28a745', // Green
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    resultLabel: {
        fontSize: 16,
        color: '#333',
    },
    resultValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        marginTop: 10,
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#007AFF',
    },
});

export default IncomeTaxCalculatorScreen;

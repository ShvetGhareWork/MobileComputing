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

const EMICalculatorScreen = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [tenure, setTenure] = useState('');
    const [result, setResult] = useState<any>(null);

    const calculateEMI = () => {
        const P = parseFloat(loanAmount);
        const R_annual = parseFloat(interestRate);
        const N_years = parseFloat(tenure);

        if (isNaN(P) || isNaN(R_annual) || isNaN(N_years)) {
            Alert.alert('Error', 'Please enter valid numbers');
            return;
        }

        const r = R_annual / 12 / 100; // Monthly interest rate
        const n = N_years * 12; // Tenure in months

        // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
        let emi = 0;
        if (r === 0) {
            emi = P / n;
        } else {
            emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        setResult({
            emi,
            totalInterest,
            totalPayment,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Loan EMI Calculator</Text>

            <Text style={styles.label}>Loan Amount (₹)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 500000"
                value={loanAmount}
                onChangeText={setLoanAmount}
            />

            <Text style={styles.label}>Interest Rate (Annual %)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 8.5"
                value={interestRate}
                onChangeText={setInterestRate}
            />

            <Text style={styles.label}>Tenure (Years)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="e.g. 10"
                value={tenure}
                onChangeText={setTenure}
            />

            <TouchableOpacity style={styles.calculateButton} onPress={calculateEMI}>
                <Text style={styles.buttonText}>Calculate EMI</Text>
            </TouchableOpacity>

            {result && (
                <View style={styles.resultContainer}>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Monthly EMI:</Text>
                        <Text style={styles.resultValue}>₹ {result.emi.toFixed(2)}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total Interest:</Text>
                        <Text style={styles.resultValue}>₹ {result.totalInterest.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.resultRow, styles.totalRow]}>
                        <Text style={[styles.resultLabel, styles.totalText]}>Total Payment:</Text>
                        <Text style={[styles.resultValue, styles.totalText]}>₹ {result.totalPayment.toFixed(2)}</Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
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
    calculateButton: {
        backgroundColor: '#007AFF', // Blue
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

export default EMICalculatorScreen;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import IncomeTaxCalculatorScreen from './src/screens/IncomeTaxCalculatorScreen';
import EMICalculatorScreen from './src/screens/EMICalculatorScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Smart Finance Calculator' }}
        />
        <Stack.Screen 
          name="IncomeTax" 
          component={IncomeTaxCalculatorScreen} 
          options={{ title: 'Income Tax Calculator' }}
        />
        <Stack.Screen 
          name="EMI" 
          component={EMICalculatorScreen} 
          options={{ title: 'Loan EMI Calculator' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

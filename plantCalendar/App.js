import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import logInScreen from './src/logIn/logInScreen';
import homeScreen from './src/home/homeScreen';
import gardenScreen from './src/garden/gardenScreen';
import friendsScreen from './src/friends/friendsScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    // Initialize all the screens
    // When calling .navigate, use "name" to navigate to the corresponding screen
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={logInScreen} />
        <Stack.Screen name="Home" component={homeScreen} />
        <Stack.Screen name="Garden" component={gardenScreen} />
        <Stack.Screen name="Friends" component={friendsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

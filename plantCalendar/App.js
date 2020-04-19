import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LogInScreen from './src/logIn/LogInScreen';
import HomeScreen from './src/home/HomeScreen';
import GardenScreen from './src/garden/GardenScreen';
import FriendsScreen from './src/friends/FriendsScreen';
import ViewTaskModal from './src/taskModal/ViewTaskModal';
import EditTaskScreen from './src/taskModal/EditTaskScreen';
import CreateTaskScreen from './src/taskModal/CreateTaskScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ignoreWarnings from 'react-native-ignore-warnings';

import firebaseConfig from './config';

// import * as firebase from 'firebase';
// firebase.initializeApp(firebaseConfig);
import { decode, encode } from 'base-64';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

// keeps warnings about long timers from showing up on Android
// see https://github.com/facebook/react-native/issues/12981
ignoreWarnings('Setting a timer');

function MainStackApp() {
  return (
    // Initialize all the screens
    // When calling .navigate, use "name" to navigate to the corresponding screen
      <MainStack.Navigator initialRouteName="Login">
        <MainStack.Screen name="Login" component={LogInScreen} />
        <MainStack.Screen name="Home" component={HomeScreen} />
        <MainStack.Screen name="Garden" component={GardenScreen} />
        <MainStack.Screen name="Friends" component={FriendsScreen} />
        <MainStack.Screen name="CreateTask" component={CreateTaskScreen} />
      </MainStack.Navigator>
  );
}

export default function App() {
  return (
    // Initialize all the screens
    // When calling .navigate, use "name" to navigate to the corresponding screen
    <NavigationContainer>
      <RootStack.Navigator 
          initialRouteName="Main"
          mode= "modal"
          headerMode= 'none'
          screenOptions={{
            cardStyle: {
              backgroundColor:'rgba(0,0,0,0.5)',
            },
            // from react native transparent modals example
            // make the modal fade in and fade out
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              },
            }),
          }}>
        <RootStack.Screen name="Main" component={MainStackApp} />
        <RootStack.Screen name="ViewTaskModal" component={ViewTaskModal} />
        <RootStack.Screen name="EditTask" component={EditTaskScreen} />
        
        </RootStack.Navigator>
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

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LogInScreen from './src/logIn/LogInScreen';
import HomeScreen from './src/home/HomeScreen';
import GardenScreen from './src/garden/GardenScreen';
import FriendsScreen from './src/friends/FriendsScreen';
import ViewTaskModal from './src/taskModal/ViewTaskModal';
import EditTaskScreen from './src/taskModal/EditTaskScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackApp() {
  return (
    // Initialize all the screens
    // When calling .navigate, use "name" to navigate to the corresponding screen
      <MainStack.Navigator initialRouteName="Login">
        <MainStack.Screen name="Login" component={LogInScreen} />
        <MainStack.Screen name="Home" component={HomeScreen} />
        <MainStack.Screen name="Garden" component={GardenScreen} />
        <MainStack.Screen name="Friends" component={FriendsScreen} />
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

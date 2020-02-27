import  React, { Component } from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';

export default class ViewTaskModal extends React.Component {
    render() {
      return (
        <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center'}} >
          <View style = {{ height: '50%', width: '80%', backgroundColor: "#F2F2F2", alignItems: 'center', justifyContent: 'center'}}>
            <Text style = {{ fontSize: 30 }}>This is a modal!</Text>
            <Button
              onPress = {() => this.props.navigation.goBack()}
              title = "Dismiss"
            />
          </View>
        </View>
      );
  }
}
  
   
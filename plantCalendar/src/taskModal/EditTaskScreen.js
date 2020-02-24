import  React, { Component } from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';

export default class ViewTaskModal extends React.Component {
    render() {
      return (
          // flex exapnds the component to fill available space, in this case
          // it fills the screen with the backgroundcolor
        <View style = {{ flex: 1, 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: 'white'}} >
            <Button
              onPress = {() => this.props.navigation.goBack()}
              title = "Dismiss"
            />

        </View>
      );
  }
}
  
   
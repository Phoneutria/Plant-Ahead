import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, 
        StyleSheet, Alert, Image} from 'react-native';
import * as Progress from 'react-native-progress';

export default class gardenScreen extends React.Component {
    /* TODO: currently the growthpoints is a state variable
    this means that when you go from homeScreen to other
    screens and come back, growthPoints will be restored 
    to 0. In the future, it should be a global variable 
    that is taking data from Firebase or other place */
    constructor(props) {
        super(props);
        this.state = {
            growthPoints: 0
        };
    };

    // TODO: center and make logo bigger
    // make button alerts
    // show growth points next to the bar
    // handle the button when progress is added
    progressAdded() {
        if(this.state.growthPoints < 1){
            this.setState({ growthPoints: this.state.growthPoints+0.2 });
            Alert.alert("adding points!");
        } else {
            Alert.alert("Your tree is done growing!");
        }
    }

    render() {
        return (
            <View style={{ flex: 10}}>
            <Image
                    style={styles.logo}
                    source={require('../../assets/loginLogo.png')}/>
            <Button
            title="Water"/>
            <Button
            title="Fertilize"/>
            <Button
            title="Shop"/>

            {/* // Self defined object progress bar */}
            <Progress.Bar 
                progress={this.state.growthPoints} 
                width={300} 
                height={20}
                style={styles.progressBar}
                />

            {/* // Button to add more progree to the progress bar */}
            <Button
                onPress={this.progressAdded.bind(this)}
                title='Temperory to show progress bar'/>
        </View>
        )
       
    }
};

styles = StyleSheet.create({
    button: {
        position: 'absolute',
        padding: 20,
        marginRight: 15,
        marginLeft: 15,
        backgroundColor: '#0E88E5',
        bottom:50,
        right:10,
        height: 70,
        width: 70,  //The Width must be the same as the height
        borderRadius:140,
        
    },
    textButton: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color:'#FFFFFF'
    },
    progressBar:{
        left: 40,
    },
    logo: {
        width: 150,
        height: 150,
    }
});

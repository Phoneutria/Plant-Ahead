import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, 
        StyleSheet, Alert, Image} from 'react-native';
import * as Progress from 'react-native-progress';

export default class GardenScreen extends React.Component {
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

    // TODO: make logo bigger (when ever I change the height or width,
    // the logo just gets cut off)
    progressAdded() {
        if(this.state.growthPoints < 1){
            this.setState({ growthPoints: this.state.growthPoints+0.1 });
            Alert.alert("adding points!");
        } else {
            Alert.alert("Your tree is done growing!");
        }
    }

    render () {
        return (
        <View>
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/loginLogo.png')}/>
                <Button
                    title="Water"
                    onPress={this.progressAdded.bind(this)}/>
                <Button
                    title="Fertilize"
                    onPress={this.progressAdded.bind(this)}/>
                <Button
                    title="Shop"
                    onPress={this.progressAdded.bind(this)}/>
                <Text
                    style={{fontSize:20, color:'#0E88E5', marginBottom: 20}}>
                    You currently have  [   
                    {/*.toFixed(1) rounds the number to 1 decimal place for */}
                    <Text>{this.state.growthPoints.toFixed(1)}</Text>
                    ] growthPoints!
                </Text>
            </View>
            <Progress.Bar 
                progress={this.state.growthPoints} 
                width={300} 
                height={20}
                style={styles.progressBar}
                />
         </View>
        )
       
    }
};

styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        color:'#0E88E5',
        marginBottom: 10
    },
    progressBar:{
        left: 40,
    },
    logo: {
    
        
        marginTop: 50,
    
        width: 150,
        height: 150,
    },
    container:{
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
});

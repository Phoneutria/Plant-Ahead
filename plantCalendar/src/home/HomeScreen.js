import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
import Calendar from './Calendar';  // import task components

export default class HomeScreen extends React.Component {
    /* TODO: currently the growthpoints is a state variable
    this means that when you go from homeScreen to other
    screens and come back, growthPoints will be restored 
    to 0. In the future, it should be a global variable 
    that is taking data from Firebase or other place */
    constructor(props) {
        super(props);
        this.state = {
            growthPoints: 0,
        };
    };

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
        // options for drop-down box
        let data = [{
            value: 'By Due Date'},{
            value: 'By Priority'
        }];

        return (
            <View style={{ flex: 10}}>
            <Dropdown
                label='Sort'
                data={data}
            />
            {/* This is the button for adding adding tasks
            TODO: center the + sign*/ }
            <TouchableOpacity 
                style={styles.button}
                onPress={()=> this.props.navigation.navigate('CreateTask')}>
                    <Text style={styles.textButton}>+</Text>
            </TouchableOpacity>

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

            {/* Tempory Dummy Calendar to display tasks*/}
            <Calendar></Calendar>
        </View>
        )
       
    }
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        padding: 20,
        marginRight: 15,
        marginLeft: 15,
        backgroundColor: '#0E88E5',
        bottom:20,
        right:10,
        height: 70,
        width: 70,  //The Width must be the same as the height
        borderRadius:140,
        zIndex: 2,  // Make the button appear above the tasks
    },
    textButton: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color:'#FFFFFF'
    },
    progressBar:{
        left: 40,
    }
});

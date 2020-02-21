import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';



export default class homeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {growthPoints: 0};
    };

    progressAdded() {
        Alert.alert(this.state.growthPoints);
        
        if(this.state.growthPoints < 1){
            temp = this.state.growthPoints;
            this.setState({ growthPoints: temp+0.2 });
        }
    }

    render() {
        // options for drop-down box
        let data = [{
            value: 'By Due Date'
        },{
            value: 'By Priority'
        }];
        return (
            <View style={{ flex: 10}}>
            <Dropdown
                label='Sort'
                data={data}
            />
            <TouchableOpacity 
                style={styles.button}
                onPress={()=> Alert.alert("Add task!")}>
                    <Text style={styles.textButton}>+</Text>
            </TouchableOpacity>
            <Progress.Bar 
                progress={this.state.growthPoints} 
                width={300} 
                height={20}
                style={styles.progressBar}
                />
              <Button
                    onPress={this.progressAdded}
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
        backgroundColor: '#90F050',
        bottom:20,
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
    }
});
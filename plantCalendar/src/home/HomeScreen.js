import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import Calendar from './Calendar';  // import task components
import * as firebase from 'firebase';
// import { calendar } from 'googleapis/build/src/apis/calendar';

export default class HomeScreen extends React.Component {
    /* TODO: currently the growthpoints is a state variable
    this means that when you go from homeScreen to other
    screens and come back, growthPoints will be restored 
    to 0. In the future, it should be a global variable 
    that is taking data from Firebase or other place */
    constructor(props) {
        super(props);
        this.state = {
            money: 0,
            userEmail: this.props.route.params.userEmail,
            refresh: false,
        };
        this.updateMoneyDisplay = this.updateMoneyDisplay.bind(this);
    };
    
    /*
    * \breif: renders the calender
    * \detail: this function first calls the renderTask function
    * that is from its child class - Calender.js in order to dispaly the 
    * new tasks. Then, it updates the state variable refresh so that the render
    * function of HomeScreen can be called.
    */
    renderCalendar() {
        this.calendar.renderTask();
        // the refresh state varaible is made just so everytime renderCalendar
        // is called, the HomeScreen is rendered
        this.setState({refresh: !this.state.refresh});
    }

    /*
    * \breif: This function is automatically called the first time it gets to HomeScreen
    */
   componentWillMount() {
        this.updateMoneyDisplay();
   }

   /**
    * \breif: This function updates the dispaly of money in the HomeScreen by getting
    * it from Firebase
    */
   updateMoneyDisplay() {
        const userRef = firebase.firestore().collection('users').doc(this.props.route.params.userEmail);
        userRef.get().then(user => {
            this.setState({money: user.data().money});
        });
   }

    render() {
        // options for drop-down box
        let data = [{
            value: 'By Due Date'},{
            value: 'By Priority'
        }];
        
        return (
            <View style={styles.container}>
                <Text style={styles.text}>You currently have <Text style={{fontWeight:"bold"}}>{this.state.money}</Text> coins</Text>
            <Dropdown
                label='Sort'
                data={data}
                style={styles.dropDown}
            />
            {/* This is the button for adding adding tasks
            TODO: center the + sign*/ }
            <TouchableOpacity 
                style={styles.button}
                onPress={()=> this.props.navigation.navigate('CreateTask', 
                    {
                        // pass in the userEmail so CreateTaskScreen can have the necessary info
                        // to interact with firestore
                        userEmail: this.props.route.params.userEmail,
                        // pass in accessToken so CreateTaskScreen is authorized to edit the user's google Tasks
                        accessToken: this.props.route.params.accessToken,
                        // pass in the renderCalendar function to Create Task so that
                        // when we return to this page, the new task is rendered
                        renderCalendar: this.renderCalendar.bind(this),
                    })}>
                    <Text style={styles.textButton}>+</Text>
            </TouchableOpacity>
           
            {/* <Button
                onPress={()=> this.props.navigation.navigate('Garden',
                {
                    // pass in the userEmail so Garden can have the necessary info
                    // to interact with firestore
                    userEmail: this.props.route.params.userEmail,
                    money: this.state.money
                })}
                title='Temporary going to garden'/> */}
            <Calendar
                // ref is required so that the renderTask function from the Calendar
                // class can be called by the renderCalendar in this class
                ref = {calendar => {this.calendar = calendar}} 
                // variables and functions that are passed to the calendar class
                accessToken = {this.props.route.params.accessToken}
                userEmail = {this.props.route.params.userEmail}
                updateMoneyDisplay = {this.updateMoneyDisplay}
                currentMoney = {this.state.money}
            ></Calendar>
        </View>
        );
        
    }
};


const styles = StyleSheet.create({
    container: {
        // control how the children align horizontally
        flex: 1,
        backgroundColor: '#ffffff',
        flexDirection:'column',
        paddingLeft:10,

    },
    button: {
        position: 'absolute',
        padding: 20,
        marginRight: 15,
        marginLeft: 15,
        backgroundColor: '#8ccd82',
        bottom:20,
        right:10,
        height: 70,
        width: 70,  //The Width must be the same as the height
        borderRadius:140,
        zIndex: 2,  // Make the button appear above the tasks
    },
    textButton: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color:'#FFFFFF'
    },
    text:{
        marginTop: 15,
        alignSelf: 'center',
        fontSize: 25,
        color: '#8ccd82',   
    },
    dropDown:{
        fontSize:15,
        // fontColor:'#8ccd82',   
        paddingLeft:10,
    }
});

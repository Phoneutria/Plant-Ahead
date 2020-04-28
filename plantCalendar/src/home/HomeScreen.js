import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import * as Progress from 'react-native-progress';
import * as firebase from 'firebase';
import TaskData from './TaskData';
import Calendar from './Calendar';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

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
            taskData: new TaskData(this.props.route.params.accessToken, this.props.route.params.userEmail)
        };
        this.updateMoneyDisplay = this.updateMoneyDisplay.bind(this);
    };
    
    /*
    * \brief: renders the calender
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
    * \brief: This function is automatically called the first time it gets to HomeScreen
    */
   componentMount() {
        this.updateMoneyDisplay();
   }

   /**
    * \brief: This function updates the dispaly of money in the HomeScreen by getting
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

        // configuration for swiping the screen
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          };

        return (
            // If the user swipe to the left, the screen will navigate to Garden
            <GestureRecognizer
            onSwipe={(direction, state) => {
                const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
                if (direction == SWIPE_LEFT) {
                    this.props.navigation.navigate('Garden', {
                    // pass in the userEmail so Garden can have the necessary info
                    // to interact with firestore
                    userEmail: this.props.route.params.userEmail,
                    money: this.state.money
                    })
                } 
            }}
            config={config}
            style={{
              flex: 1,
            }}
            >
            <View style={styles.container}>
            
                <Text style={styles.text}>You currently have <Text style={{fontWeight:"bold"}}>{this.state.money}</Text> coins</Text>
            <Dropdown
                label='Sort'
                data={data}
                style={styles.dropDown}
            />
             <Calendar
                taskData = {this.state.taskData}
                userEmail = {this.props.route.params.userEmail}
                // ref is required so that the renderTask function from the Calendar
                // class can be called by the renderCalendar in this class
                ref = {calendar => {this.calendar = calendar}} 
                renderCalendar = {this.renderCalendar.bind(this)}
                // variables and functions that are passed to the calendar class
                // accessToken = {this.props.route.params.accessToken}
                userEmail = {this.props.route.params.userEmail}
                updateMoneyDisplay = {this.updateMoneyDisplay}
                currentMoney = {this.state.money}
            ></Calendar>

            <View style={styles.bottomContainer}>
                {/* For user to create task */}
                <TouchableOpacity 
                    style={styles.createButton}
                    onPress={()=> this.props.navigation.navigate('CreateTask', 
                        {
                            // pass in the userEmail so CreateTaskScreen can have the necessary info
                            // to interact with firestore
                            // pass in taskData so the create task screen can
                            // modify the local data
                            taskData:this.state.taskData,

                            renderCalendar: this.renderCalendar.bind(this),
                        })}>
                        <Text style={styles.textButton}>+</Text>
                </TouchableOpacity>

                {/* For user to Sign out */}
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={()=> this.props.navigation.navigate('Login')}>
                    <Text style={styles.textButton}>Sign out</Text>
                </TouchableOpacity>
            </View>
           
        </View>
        </GestureRecognizer>
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
    createButton: {
        position: 'absolute',
        padding: 20,
        marginRight: 15,
        marginLeft: 15,
        backgroundColor: '#8ccd82',
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
    logoutButton: {
        textAlign: 'center',
        fontSize: 20,
        backgroundColor:'#8ccd82',
        padding:10,
        borderRadius:5,
    },
    bottomContainer:{
        // control how the children align horizontally
        // flex: 2,
        flexDirection:'row',
        marginBottom: 50,
        alignItems: "center",
        justifyContent: 'space-between',
        padding:10,
    },
    text:{
        marginTop: 15,
        alignSelf: 'center',
        fontSize: 20,
        color: '#8ccd82',   
    },
    dropDown:{
        fontSize:15,
        // fontColor:'#8ccd82',   
        paddingLeft:10,
    }
});

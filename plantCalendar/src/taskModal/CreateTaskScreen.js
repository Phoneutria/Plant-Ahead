import React, {useState} from 'react';
import{ Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, 
    Alert, TextInput, TouchableHighlightBase} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-material-dropdown';
import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';
import GoogleHandler from './GoogleHandler.js';


export default class CreateTaskScreen extends React.Component {
  state = {
    name: "Empty",
    dueDate: new Date(1598051730000),
    priority: "medium",
    estTimeToComplete: 0,
    // a class to handle most of the firestore interfaces (eg. update time in firestore)
    firestoreHandle: new FirestoreHandle(),
    googleHandle: new GoogleHandler()
  }


  // TODO: instead of this function, it would be a function that
  // create new task and returns back to the home page
  // Temporary function to check if text input and date picker worked
  formatOutput() {
    let temp = String(this.state.dueDate).split(' ');
    temp = " is due on " + temp[1]+ "-" + temp[2]+ "-" + temp[3];
    let output = String(this.state.name) + temp + " with " + this.state.priority + 
    " priority. You have " + String(this.state.estTimeToComplete) + " hours left!";

    // TODO: Once you have the create new Task function ready, uncomment the code bellow
    //   then set googlTaskId to task id returned by Goolge Task Create function

    // let googleTaskId = "TODO: actualGoolgeTaskId"
    
    // // create the task in firestore
    // this.state.firestoreHandle.updateFirebaseTaskData(this.props.route.params.userEmail,
    //   googleTaskId, this.state.name, this.state.priority, 
    //   parseFloat(this.state.estTimeToComplete), 0, false);
    
    this.props.navigation.goBack();

    Alert.alert(output);

    /**
     * Suggestion:
     *    If when we go back to the home screen, the tasks do not render
     *    and you can't see the new Task Created...
     *      You need to figure out how to call the Calendar's renderTask() function.
     *  
     *      One way that I was able to do it for the ViewTaskModal was using navigate()
     *      function to pass in parameters (for example, how I pass in userEmail)
     *      You might want to look at ViewTaskModal and see how I pass in the function
     *      timeSpentHandler()
     * 
     *      However, this might be more complicated because I don't know how you can access 
     *      Calendar's function from the HomeScreen (which is like a box containing Calendar)
     *      In my case, I was able to do it because ViewTaskModal is called by a Task, and the
     *      Calendar is like a box containing Tasks). Therefore, it's easier to pass timeSpentHandler()
     *      from Calendar to Task then from Task to ViewTaskModal
     * 
     *      P.S: I'm sorry about the long paragraphs. I'm trying to leave as much information behind as
     *      possible really late a night lmao
     */
  }

  render() {
    // assigns this.state.date to the local constant date
    const {name} = this.state;
    const {dueDate} = this.state;
    const {priority} = this.state;
    const {estTimeToComplete} = this.state;
    
    // when we change the date in the dateTimePicker, we update the date 
    // with the selectedDate
    const onChangeDate = (event, selectedDate) => {
      this.setState({dueDate: selectedDate});
    };

    // options for priority
    let data = [
      {value: 'high'},
      {value: 'medium'},
      {value: 'low'}
    ];

  return (
    <View>
      {/* Entering name of the task */}
      <TextInput
              style={styles.input}
              onChangeText={(text)=>{
                this.setState({name:text});
              }}
              placeholder="name"
          />
      {/* Entering number of hours needed for the task */}
      <TextInput
          style={styles.input}
          onChangeText={(text)=>{
            this.setState({estTimeToComplete:text});
          }}
          // TODO: make sure the input is a number
          placeholder="Estimate hours needed"
      />
      {/* For selecting the due date
      <Text>Due Date</Text>
      <DateTimePicker 
        mode={'date'}
        value={ dueDate }
        onChange={onChangeDate} 
      /> */}

      {/* For selecting the priority */}
      <Dropdown
          label='Priority'
          data={data}
          onChangeText={(value)=>{
            this.setState({priority:value});
          }}
      />

      {/* Navigation buttons */}
      <View>
        <Button
            onPress = {() => this.props.navigation.goBack()}
            title = 'Cancel'/>
        <Button
            onPress={()=> this.state.googleHandle.createGoogleTask(this.state.name, this.props.route.params.accessToken)}
            title='Submit'/> 
            {/* this.formatOutput() */}
      </View>
    </View>
  );
  }
}

const styles = StyleSheet.create({
    input: {
        paddingLeft: 10,
        margin: 10,
        height: 50,
        borderColor: '#0E88E5',
        borderWidth: 4
    },
});
import React, {useState} from 'react';
import{ Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, 
    Alert, TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-material-dropdown';
import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';


export default class CreateTaskScreen extends React.Component {
  state = {
    name: "Empty",
    dueDate: new Date(1598051730000),
    priority: "medium",
    estTimeToComplete: 0,
    // a class to handle most of the firestore interfaces (eg. update time in firestore)
    firestoreHandle: new FirestoreHandle(),
  }


  // TODO: instead of this function, it would be a function that
  // create new task and returns back to the home page
  // Temporary function to check if text input and date picker worked
  formatOutput() {
    let temp = String(this.state.dueDate).split(' ');
    temp = " is due on " + temp[1]+ "-" + temp[2]+ "-" + temp[3];
    let output = String(this.state.name) + temp + " with " + this.state.priority + 
    " priority. You have " + String(this.state.estTimeToComplete) + " hours left!";

    this.state.firestoreHandle.updateFirebaseTaskData(this.props.route.params.userEmail,
      "TODO: actualGoolgeTaskId", this.state.name, this.state.priority, 
      this.state.estTimeToComplete, 0, false);
    
    Alert.alert(output);
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
      {/* For selecting the due date */}
      <Text>Due Date</Text>
      <DateTimePicker 
        mode={'date'}
        value={ dueDate }
        onChange={onChangeDate} 
      />

      {/* For selecting the priority */}
      <Dropdown
          label='Priority'
          data={data}
          onChangeText={(value)=>{
            this.setState({priority:value});
          }}
      />

      {/* For creating the task */}
      <Button
          onPress={()=> this.formatOutput()}
          title='Submit'/> 
          {/* this.formatOutput() */}
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
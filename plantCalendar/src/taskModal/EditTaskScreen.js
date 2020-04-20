import  React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import FirestoreHandle from '../dataHandlers/FirestoreHandle';
import GoogleHandle from '../dataHandlers/GoogleHandle.js';

export default class EditTaskModal extends React.Component {
  constructor(props) {
    super(props)
    this.taskRef = this.props.route.params.task;

    this.state = {
      googleHandle: new GoogleHandle(),
      firestoreHandle: new FirestoreHandle(),
      name: this.taskRef.name,
      taskId: this.taskRef.id,
      dueDate: this.taskRef.dueDate,
      taskListId: this.taskRef.taskListId,  // undefined until we implement support for multiple task lists
      priority: this.taskRef.priority, 
      esttimeToComplete: this.taskRef.estTimeToComplete,
      completed: this.taskRef.completed,  // undefined until we implement support for completing tasks
      timeSpent: this.taskRef.timeSpent,

      dateIsVisible: false,  // determines whether the datetimepicker modal is visible

      // used to access user's Google Calendar
      accessToken: this.taskRef.accessToken
    }
  }

  /*
  * \brief: This function calls functions to update the task based on the user's data, then 
  * navigates back to the home screen
  */
 async backTo() {

  // update the task in Google
  taskId = await this.state.googleHandle.updateGoogleTask(this.state.taskId, this.state.taskListId,
    this.state.name, this.state.dueDate, this.state.accessToken)

  // update the task in Firebase
  this.state.firestoreHandle.updateFirebaseTaskData(this.state.userEmail, taskId, this.state.name, 
    this.state.priority, this.state.estTimeToComplete, this.state.timeSpent, this.state.completed, this.state.dueDate);
  // call the renderCalendar function in HomeScreen to display the edited task
  this.props.route.params.renderCalendar();
  // Go back to the HomeScreen
  this.props.navigation.goBack();
}

  render() {
      // options for priority
      let data = [
        {value: 'high'},
        {value: 'medium'},
        {value: 'low'}
      ];

      // when we change the date in the datetimepicker, we update the date 
      // with the selectedDate
      const onChangeDate = (selectedDate) => {
        this.setState({dueDate: selectedDate,
                      dateIsVisible: false});
      };

      return (
        <View style = {styles.editScreen}> 
          <View style = {styles.header}>
            <View style = {styles.header}></View>
            <Text style = {styles.headerText}> Edit Task </Text>
          </View>  
          
          {/* Editing name of the task */}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Name:  </Text>
            <TextInput style = {styles.textBox}
              defaultValue = {this.state.name}
              onChangeText={(text)=>{
                this.setState({name:text});
              }}>
            </TextInput>
          </View>

          {/* Editing due date of the task
              TODO: find a better picker library and implement */}
          <View style = {styles.editView}>
            <Button title="Select Date" onPress={() => this.setState({dateIsVisible: true})} />
            <DateTimePickerModal
              isVisible={this.state.dateIsVisible}
              mode="datetime"
              onConfirm={(selectedDate) => onChangeDate(selectedDate)}
              onCancel={() => this.setState({dateIsVisible:false})}
            />
          </View> 

          {/* Editing time to complete of the task */}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Est. Time to Complete: </Text>
            <TextInput style = {styles.textBox} 
              defaultValue = {this.state.estTimeToComplete}
              onChangeText={(text)=>{
                this.setState({estTimeToComplete: text});
              }}> 
            </TextInput>
          </View>
          
          {/* Editing priority of the task 
              TODO: style*/}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Priority: </Text>
            <Dropdown
              label= {this.state.priority}
              data={data}
              onChangeText={(text)=>{
                this.setState({priority:text});
              }}
            />
          </View>
          
          {/* Navigation buttons */}
          <View style = {styles.botButtons}>
            <Button
              title = "Cancel"
              onPress = {() => this.props.navigation.goBack()}>
            </Button>
            <Button
              title = "Save"
              onPress = {() => this.backTo()}>
            </Button>
          </View>  

        </View>
      );
  }
}
  
const styles = StyleSheet.create({
  header: {
    flex: 2,
    backgroundColor: 'green',
    alignItems: 'center'
  },

  headerText: {
    flex: 1,
    fontWeight: 'bold',
    backgroundColor: 'green',
    alignItems: 'stretch'
  },
  
  editScreen: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch'
  },

  editView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },

  botButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  editText: {
    fontWeight: 'bold',
    alignItems: 'center'
  },

  textBox: {
    borderColor: 'green',
    borderWidth: 1

  },

  footer: {
    flex: 2,
    flexDirection: 'row'
  }
})
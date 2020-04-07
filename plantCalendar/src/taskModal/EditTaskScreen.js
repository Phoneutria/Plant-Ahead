import  React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import GoogleHandler from './GoogleHandler.js';

export default class EditTaskModal extends React.Component {
  constructor(props) {
    super(props)
    this.taskProps = this.props.route.params.task.props;

    this.state = {
      googleHandle: new GoogleHandler(),
      name: this.taskProps.name,
      taskId: this.taskProps.id,
      dueDate: this.taskProps.dueDate,
      taskListId: this.taskProps.taskListId,  // undefined until we implement support for multiple task lists
      priority: this.taskProps.priority, 
      esttimeToComplete: this.taskProps.estTimeToComplete,
      completed: this.taskProps.completed,  // undefined until we implement support for completing tasks

      // used to access user's Google Calendar
      accessToken: this.taskProps.accessToken
    }
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
      const onChangeDate = (event, selectedDate) => {
        this.setState({dueDate: selectedDate});
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
            <Text style = {styles.editText}> Due Date: </Text>
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
              onPress = {() => {this.state.googleHandle.updateGoogleTask(this.state.taskId, 
                this.state.taskListId, this.state.name, this.state.dueDate, this.state.completed, this.state.accessToken)}}>
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
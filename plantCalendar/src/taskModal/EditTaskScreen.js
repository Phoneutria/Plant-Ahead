import  React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import {updateTask} from '../home/Calendar.js';

export default class ViewTaskModal extends React.Component {
  state = {
    name: "Empty",
    taskId: "Empty",
    taskListId: "Empty",
    completion: false,
    dueDate: new Date(1598051730000),
    priority: "medium",
    estTimeToComplete: 0
  }
  
  render() {
      const taskProps = this.props.route.params.task.props;

      this.setState({name:taskProps.name, taskId:taskProps.taskId, dueDate:taskProps.dueDate,
        taskListId:taskProps.taskListId, priority:taskProps.priority, 
        esttimeToComplete:taskProps.estTimeToComplete});

      // options for priority
      let data = [
        {value: 'high'},
        {value: 'medium'},
        {value: 'low'}
      ];

      return (
        // TODO: Add option to update completion status
        <View style = {styles.editScreen}> 
          <View style = {styles.header}>
            <View style = {styles.header}></View>
            <Text style = {styles.headerText}> Edit Task </Text>
          </View>  
          
          {/* Editing name of the task */}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Name:  </Text>
            <TextInput style = {styles.textBox}
              defaultValue = {taskProps.name}>
                onChangeText={(text)=>{
                  this.setState({name:text});
                }}
            </TextInput>
          </View>

          {/* Editing due date of the task
              TODO: add date picker */}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Due Date: </Text>
            <Text> Old Due Date </Text>
          </View>

          {/* Editing time to complete of the task */}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Est. Time to Complete: </Text>
            <TextInput style = {styles.textBox} 
              defaultValue = {taskProps.estTimeToComplete}>
              onChangeText={(text)=>{
                this.setState({estTimeToComplete:text});
              }} 
            </TextInput>
          </View>
          
          {/* Editing priority of the task 
              TODO: style*/}
          <View style = {styles.editView}>
            <Text style = {styles.editText}> Priority: </Text>
            <Dropdown
              label= {taskProps.priority}
              data={data}
              onChangeText={(text)=>{
                this.setState({priority:text});
              }}
            />
          </View>
          
          {/* Navigation buttons 
              TODO: "Save" button should update database data*/}
          <View style = {styles.botButtons}>
            <Button
              title = "Cancel"
              onPress = {() => this.props.navigation.goBack()}>
            </Button>
            <Button
              title = "Save"
              onPress = {() => {updateTask(state.taskId, state.taskListId, state.name, state.dueDate, state.completion);
                                this.props.navigation.goBack()}}>
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
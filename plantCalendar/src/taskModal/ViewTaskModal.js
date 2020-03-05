import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Icon }  from 'react-native-elements';

export default class ViewTaskModal extends React.Component {
    render() {
      // get the props and states  of a task
      // this gets passed in when a Task Component navigates to ViewTaskModal
      const taskProps = this.props.route.params.taskProps;
      const taskStates = this.props.route.params.taskStates;
      // only display "estimate time to complete" "time spent" "time left"
      // if there is an estimated time
      const dispTime = taskProps.estTimeToComplete != null
      return (
        <View style = {styles.container} >
          <View style = {styles.modal}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress = {() => this.props.navigation.goBack()}>
              <Icon name='close'></Icon>
            </TouchableOpacity>
            {/* Edit Button to open the task editor modal */}
            <TouchableOpacity 
              style={styles.editButton}
              onPress = {() => this.props.navigation.navigate("EditTask")}>
              <Icon name='edit'></Icon>
            </TouchableOpacity>
            {/* Wrap a view around the Texts for easier styling */}
            <View style = {styles.taskTextBlock}>
              <Text style = {{...styles.taskText, fontWeight: 'bold'}}>
                Task Name: {taskProps.name}
              </Text>
              {/* toLocalString gives us date format: 23/01/2019, 17:23:42*/}
              <Text style = {styles.taskText}>
                Due Date: {taskProps.dueDate.toLocaleString()}
              </Text>
              <Text style = {styles.taskText}>
                Priority: {taskProps.priority}
              </Text>
              <Text style = {styles.taskText}>
                {dispTime? "Estimated Time to Complete (hours): " + taskProps.estTimeToComplete : null}
              </Text>
              <Text style = {styles.taskText}>
                {dispTime? "Time Spent (hours): " + taskStates.timeSpent : null}
              </Text>
              <Text style = {styles.taskText}>
                {dispTime? "Time Left (hours): " + taskStates.timeLeft : null }
              </Text>
            </View>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container:{
      // control how the children align horizontally
      alignItems: 'center',
      flex: 1, 
      justifyContent: 'center',
  },
  modal:{
      height: '50%', 
      width: '80%', 
      backgroundColor: "#F2F2F2",
      // alignItems: 'center',
      justifyContent: 'center',
  },
  taskTextBlock: {
    marginLeft: 25,
  },
  taskText: {
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute', 
    top: 5,
    left: 5,
  },
  editButton: {
    position: 'absolute', 
    top: 5,
    right: 5,
  },
});
   
import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Icon }  from 'react-native-elements';

export default class ViewTaskModal extends React.Component {
    state = {
      completeTaskAnimationTime: 550,
    }

    closeAndCompleteTask() {
      // close the modal
      this.props.navigation.goBack();

      // call the task's complete function
      // wait for a bit so the user can clear see 2 steps:
      //   1) close the modal
      //   2) delete the task
      setTimeout(()=>this.props.route.params.task.isCompleted(),
                     this.state.completeTaskAnimationTime);
    }

    render() {
      // get the props and states  of a task
      // this gets passed in when a Task Component navigates to ViewTaskModal
      const taskProps = this.props.route.params.task.props;
      const taskStates = this.props.route.params.task.state;
      
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
              {/* all the time related info for a task will only show if the task has
                  estimate time to complete */}
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
            {/* button to complete the task (same functionality as the checkbox for each task */}
            <TouchableOpacity 
              style = {styles.completeButton}
              onPress = {() => this.closeAndCompleteTask()}>
              <Text>COMPLETE</Text>
            </TouchableOpacity>
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
  completeButton: {
    position: 'absolute', 
    backgroundColor: '#65CCB8',
    width: '90%',
    height: '10%',
    marginLeft: 15,
    marginRight: 15,
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
   
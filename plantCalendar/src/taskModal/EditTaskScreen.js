import  React, { Component } from 'react';
import {View, Text, TextInput, StyleSheet, Button, TouchableOpacity} from 'react-native';
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
      userEmail: this.taskRef.userEmail,
      taskId: this.taskRef.id,
      dueDate: this.taskRef.dueDate,
      taskListId: this.taskRef.taskListId,  // undefined until we implement support for multiple task lists
      priority: this.taskRef.priority, 
      estTimeToComplete: this.taskRef.estTimeToComplete,
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
  let taskId = await this.state.googleHandle.updateGoogleTask(this.state.taskId, this.state.taskListId,
    this.state.name, this.state.dueDate, this.state.accessToken)

  // update the task in Firebase
  this.state.firestoreHandle.updateFirebaseTaskData(this.state.userEmail, taskId, this.state.name, 
    this.state.priority, this.state.estTimeToComplete, this.state.timeSpent, false, this.state.dueDate);
  // TODO: call the renderCalendar function in HomeScreen to display the edited task
  // this.props.route.params.renderCalendar();
  // Go back to the HomeScreen
  this.props.navigation.navigate("Home");
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
        <View style = {styles.container}> 

          <Text style = {styles.headerText}> Edit Task </Text>
          <View style = {styles.inputView}>
          {/* Editing name of the task */}
          <Text style={styles.text}>Task Name:</Text>
          <TextInput
            style={styles.input}
            defaultValue = {this.state.name}
              onChangeText={(text)=>{
                this.setState({name:text});
            }}
            placeholder='/'
          />
        </View>

        <View style = {styles.inputView}>
          {/* Entering number of hours needed for the task */}
          <Text style={styles.text}>
            Est. Time Needed (Hours): 
          </Text>
        <TextInput
            keyboardType='numeric'
            style={styles.input}
            defaultValue = {this.state.estTimeToComplete}
            onChangeText={(text)=>{
              this.setState({estTimeToComplete:text});
            }}
            placeholder='0'
        />
        </View>
          
          
          {/* Editing due date of the task */}
          <View style = {styles.inputView}>
            <Text style={styles.text}>Due date and time: </Text>
            <TouchableOpacity 
              onPress={() => this.setState({dateIsVisible: true})}>
              <Text style={{borderBottomWidth:2,borderBottomColor: '#8ccd82'}}>
                {this.state.dueDate.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={this.state.dateIsVisible}
              mode="datetime"
              onConfirm={(selectedDate) => onChangeDate(selectedDate)}
              onCancel={() => this.setState({dateIsVisible:false})}
            />
          </View> 

          
          {/* Editing priority of the task */}
          <View style = {styles.inputView}>
            <Text style = {styles.text}> Edit task Priority: </Text>
            <Dropdown
              label= {this.state.priority}
              data={data}
              onChangeText={(text)=>{
                this.setState({priority:text});
              }}
              containerStyle={{ width: 100}}
            />
          </View>
          
          {/* Navigation buttons */}
          <View style={styles.bottom}>
          <TouchableOpacity
                onPress = {() => this.props.navigation.goBack()}
                style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            <TouchableOpacity
                onPress={()=> {
                  this.backTo()
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

        </View>
      );
  }
}
  
const styles = StyleSheet.create({
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'black',
    fontSize:20,
    marginTop:50
  },
  container:{
    padding:10,
    flex:1,
    backgroundColor: 'white',
  },
  input: {
    marginLeft:10,
    
    borderColor: '#8ccd82',
    borderBottomWidth: 2,
    fontSize: 15,
  },
  inputView: {
    flex:1, 
    flexDirection:'row', 
    alignItems: 'flex-start',
    marginTop:10
  },
  text:{
    fontSize: 18,
    color: '#8ccd82',  
    // fontWeight:'bold'
  },
  button: {
    backgroundColor:'#8ccd82',
    padding:10,
    borderRadius:10,
    marginHorizontal:30,
    alignItems:'center',
    width:150
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#FFFFFF'
  },
  bottom: {
    flexDirection:'row',
    marginTop:70,
    marginBottom:400,
    justifyContent: 'center',
  },
    





})
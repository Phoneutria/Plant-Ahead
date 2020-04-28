import React, {useState} from 'react';
import{ Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, 
    Alert, TextInput, TouchableHighlightBase} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import FirestoreHandle from '../dataHandlers/FirestoreHandle';
import GoogleHandle from '../dataHandlers/GoogleHandle.js';
import DateTimePickerModal from "react-native-modal-datetime-picker";


export default class CreateTaskScreen extends React.Component {
  state = {
    name: "Empty",
    dueDate: new Date(1598051730000),
    dateDisplay: "Click here to select date and time",
    priority: "medium",
    estTimeToComplete: 0,
    // a class to handle most of the firestore interfaces (eg. update time in firestore)
    firestoreHandle: new FirestoreHandle(),
    googleHandle: new GoogleHandle(),
    userEmail: this.props.route.params.userEmail,

    //boolean to handle the datetimepicker
    dateIsVisible: false
  }


  /*
  * \breif: This function initiates the task by calling initateTask()
  * Then, it calls the renderCalendar function passed in as props from the 
  * HomeScreen so that the new task will be displayed. Finally, it 
  * navigates back to HomeScreen
  */
  async backTo() {
    
    // initate the task in both firebase and gogole
    await this.props.route.params.taskData.createTask(this.state.name, this.state.dueDate,
      this.state.priority, this.state.estTimeToComplete);
    // call the renderCalendar function in HomeScreen to display the new task
    this.props.route.params.renderCalendar();
    // Go back to the HomeScreen
    this.props.navigation.goBack();
  }

  /** \brief takes the user's input and creates a corresponding task in google calendar and firebase
   * 
   */
  async initiateTask() {
    // create task in google Task
    taskId = await this.state.googleHandle.createGoogleTask(this.state.name, this.state.dueDate, 
      this.props.route.params.accessToken);
    
    // initialize task in Firebase
    this.state.firestoreHandle.initFirebaseTaskData(this.state.userEmail, taskId, this.state.name);
    
    // update new task with user-entered data
    // the time spent on the task is zero by default
    // the task is not completed, by default
    this.state.firestoreHandle.updateFirebaseTaskData(this.state.userEmail, taskId, this.state.name, 
      this.state.priority, this.state.estTimeToComplete, 0, false, this.state.dueDate);
  }

  render() {
    
    // when we change the date in the datetimepicker, we update the date 
    // with the selectedDate
    const onChangeDate = (selectedDate) => {
      this.setState({dueDate: selectedDate, 
                    dateDisplay: this.state.dueDate.toLocaleString(),
                    dateIsVisible: false},
                   );
    };

    // options for priority
    let data = [
      {value: 'high'},
      {value: 'medium'},
      {value: 'low'}
    ];

  return (
    <View style={styles.container}>
      {/* Entering name of the task */}
      <TextInput
            style={styles.input}
            onChangeText={(text)=>{
              this.setState({name:text});
            }}
            placeholder="Name of new task"
        />
      {/* Entering number of hours needed for the task */}
      <TextInput
          keyboardType='numeric'
          style={styles.input}
          onChangeText={(text)=>{
            this.setState({estTimeToComplete:text});
          }}
          placeholder="Estimate hours needed"
      />
      {/* For selecting the due date */}
     <View>
      <TouchableOpacity 
      onPress={() => this.setState({dateIsVisible: true})}>
      <Text style={styles.text}>{this.state.dateDisplay}</Text>
     </TouchableOpacity>
      <DateTimePickerModal
        isVisible={this.state.dateIsVisible}
        mode="datetime"
        onConfirm={(selectedDate) => onChangeDate(selectedDate)}
        onCancel={() => this.setState({dateIsVisible:false})}
      />
    </View>

      {/* For selecting the priority */}
      <Dropdown
          label='Select priority here'
          
          data={data}
          onChangeText={(value)=>{
            this.setState({priority:value});
          }}
      />

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
            <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  input: {
      paddingLeft: 10,
      margin: 5,
      height: 50,
      borderColor: '#8ccd82',
      borderBottomWidth: 2,
      fontSize: 15,
  },
  text:{
    marginTop: 15,
    fontSize: 20,
    color: '#8ccd82',  
    alignSelf: 'center'
  },
  container:{
    marginTop: 15,
    padding:10,
    flex:1,
  },
  button: {
    textAlign: 'center',
    backgroundColor:'#8ccd82',
    padding:10,
    borderRadius:10,
    marginHorizontal:50
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color:'#FFFFFF'
  },
  bottom: {
    flexDirection:'row',
    marginTop:20,
    justifyContent: 'center',
  },
});
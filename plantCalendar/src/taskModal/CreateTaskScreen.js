import React, {useState} from 'react';
import{ Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, 
    Alert, TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class CreateTaskScreen extends React.Component {
  
  state = {
    name: "Empty",
    dueDate: new Date(1598051730000),
    priority: "medium",
    hoursLeft: 0 
  }

  render() {
    // assigns this.state.date to the local constant date
    const {name} = this.state;
    const {dueDate} = this.state;
    const {priority} = this.state;
    const {hoursLeft} = this.state;

    // when we change the date in the dateTimePicker, we update the date 
    // with the selectedDate
    const onChangeDate = (event, selectedDate) => {
      this.setState({dueDate: selectedDate});
    };

    const onChangeName = (event, updateName) => {
      this.setState({name: updateName});
    }

    const onChangeHours = (event, hours) => {

    }

    const onChangePriority = (event, priority) => {

    }

    // Tempporary function to check if text input and date picker worked
    const formatOutput = (name, dueDate, priority, hours) => {
      sdate = String(date).split(' ');
      sdate = " is due on " + date[1]+ "-" + date[2]+"-"+date[3];
      output = name + sdate + " with " + priority + ". You have " + hours + " left!";
      return output;
    }

  return (
    <View>
        <TextInput
                style={styles.input}
                onChangeText={name => onChangeName(name)}
                placeholder="name"
            />

            <TextInput
                style={styles.input}
                onChangeText={hours => onChangeHours(hours)}
                placeholder="Estimate hours needed"
            />

            <Text>Due Date</Text>
            {/* For selecting the due date */}
            <DateTimePicker 
              mode={'date'}
              value={ dueDate }
              onChange={onChangeDate} 
              />

            <Button
                onPress={()=> Alert.alert(formatOutput(date))}
                title='Submit'/> 
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
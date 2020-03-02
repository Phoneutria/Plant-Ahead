import React, {useState} from 'react';
import{ Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, 
    Alert, TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-material-dropdown';

export default class CreateTaskScreen extends React.Component {
  state = {
    name: "Empty",
    dueDate: new Date(1598051730000),
    priority: "medium",
    hoursLeft: 0 
  }
  // Tempporary function to check if text input and date picker worked
  formatOutput() {
    let temp = String(this.state.dueDate).split(' ');
    temp = " is due on " + temp[1]+ "-" + temp[2]+ "-" + temp[3];
    let output = String(this.state.name) + temp + " with " + this.state.priority + 
    " priority. You have " + String(this.state.hoursLeft) + " hours left!";
    return output;
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

    const onChangeHours = (event, updatehours) => {
      this.setState({hoursLeft: updatehours});
    }

    let data = [
      {value: 'high'},
      {value: 'medium'},
      {value: 'low'}
    ];

  return (
    <View>
        <TextInput
                style={styles.input}
                onChangeText={(text)=>{
                  this.setState({name:text});
                }}
                placeholder="name"
            />

            <TextInput
                style={styles.input}
                onChangeText={(text)=>{
                  this.setState({hoursLeft:text});
                }}
                placeholder="Estimate hours needed"
            />

            <Text>Due Date</Text>
            {/* For selecting the due date */}
            <DateTimePicker 
              mode={'date'}
              value={ dueDate }
              onChange={onChangeDate} 
            />
            <Dropdown
                label='Priority'
                data={data}
                onChangeText={(value)=>{
                  this.setState({priority:value});
                }}
            />

            <Button
                onPress={()=> Alert.alert(this.formatOutput())}
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
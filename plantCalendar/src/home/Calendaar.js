import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Task from '../home/Task';  // import task components

/**
 * Calendar Class
 *  \brief render each individual task
 *         Created by HomeScreen using HomeScreen's state's TaskData object and functions for updating and completing tasks 
 *  TODO: rename to Calendar after finished moving functions around
 * 
 */
export default class Calendaar extends React.Component {
    state = {
        taskArray: [],  // array for holding Task components
        dataInitiated: false  // turns true if TaskData prop has loaded data
    }

    /**
     * \brief After component has mounted, render tasks
     */
    componentDidMount() {
        console.log("Calendaar did mount");
        this.renderTask();
    }

    /**
     * \brief Initiates TaskData
     */
    initiateTasks = async() => {
        console.log("initiateTasks called");
        let taskJson = await this.props.taskData.initiate();
        console.log("initiateTasks taskJson");
        console.log(taskJson);
        this.renderTask(taskJson);
    }

    /**
     * \brief Translates TaskData into an array of Tasks
     */
    renderTask = async() => {
        let taskJson;
        if (this.state.dataInitiated == false) {
            taskJson = await this.props.taskData.initiate();
            this.setState({dataInitiated:true});
        } else {
            taskJson = this.props.taskData.getData();
        }
        console.log("Calendaar taskJson");
        console.log(taskJson);
        let tempTaskArray = [];
        for (let i = 0; i < taskJson.length; ++i) {
            tempTaskArray[i] =  
                <Task 
                    // --------------------------------variables-----------------------------
                    userEmail = {this.props.userEmail}
                    // compiler wants a "key" prop when the components are 
                    // rendered in an array
                    // this prop is there to just make the compiler happy
                    key = {taskJson[i].taskListId.concat(taskJson[i].id)}
                    // data for the task
                    id = {taskJson[i].id}
                    name={taskJson[i].name}
                    dueDate={new Date(taskJson[i].dueDateAndTime)}
                    priority={taskJson[i].priority}
                    estTimeToComplete={taskJson[i].estTimeToComplete}
                    timeSpent = {taskJson[i].timeSpent}
                    
                    currentMoney = {this.props.currentMoney}

                    // --------------------------------functions-----------------------------
                    taskData = {this.props.taskData}
                    renderCalendar = {this.props.renderCalendar}
                    
                    // pass in Calendar's deleteCompletedTask function
                    // so that when a task is completed, the task can call Calendar's function
                    // completeTask={(taskId) => this.deleteCompletedTask(taskId)}
                    // pass in the Calendar's renderTask function
                    // so that when a task and possibly the ViewTaskModal needs to re-render
                    //  all the task, they can call this function
                    updatedTaskHandler={() => this.updatedTaskHandler()}
                    // the updateMoneyDisplay function from the HomeScreen is passed to Task
                    updateMoneyDisplay={() => this.props.updateMoneyDisplay()}
                ></Task>
                ;
        // A sneaky way to make the rendering task work
            // this ensures that all the tasks will be added to the array
            //      before Calendar calls its render() function
            if (i == taskJson.length-1){
                // if (this.state.dataInitiated == false) 
                // setState will trigger Calender to call its render() function
                this.setState({taskArray: tempTaskArray});
            }
        }
        console.log("taskJsonData");
        console.log(taskJson);
        console.log("Calendar tempTaskArray");
        console.log(tempTaskArray);
        this.setState({taskArray: tempTaskArray});

        console.log("Calendaar taskArray");
        console.log(this.state.taskArray);
    }

    render() {
        let returnObject = null;
        if (this.state.dataInitiated == true) {
            returnObject = this.state.taskArray;
            }
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {returnObject}
                </ScrollView>
            </View>
            );
    }
}

const styles = StyleSheet.create({
    container:{
        // control how the children align horizontally
        alignItems: 'center',
        // make Flat List scrollable
        flex: 1,
    },
});
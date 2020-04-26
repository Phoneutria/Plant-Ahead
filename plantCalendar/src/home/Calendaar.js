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
    constructor(props) {
        super(props)
        state = {
            taskArray: []  // array for holding Task components
        }
    }

    /**
     * \brief After component has mounted, render tasks
     */
    componentDidMount() {
        this.renderTask();
    }

    /**
     * \brief Translates TaskData into an array of Tasks
     */
    renderTask() {
        let tempTaskArray = [];
        let taskJson = this.props.taskData.getData();  // array of objects with task data
        for (let i = 0; i < taskJson.length; ++i) {
            tempTaskArray[i] =  
                <Task 
                    // --------------------------------variables-----------------------------
                    // compiler wants a "key" prop when the components are 
                    // rendered in an array
                    // this prop is there to just make the compiler happy
                    key = {taskJson.taskListId + taskJson.id}
                    // data for the task
                    id = {taskJson.id}
                    name={taskJson.title}
                    dueDate={new Date(taskJson.dueDateAndTime)}
                    priority={taskJson.priority}
                    completed={taskJson.completed}
                    estTimeToComplete={taskJson.estTimeToComplete}
                    timeSpent = {taskJson.timeSpent}
                    
                    currentMoney = {this.props.currentMoney}

                    // --------------------------------functions-----------------------------
                    // TODO: pass in the right functions from the HomeScreen
                    // pass in Calendar's deleteCompletedTask function
                    // so that when a task is completed, the task can call Calendar's function
                    // completeTask={(taskId) => this.deleteCompletedTask(taskId)}
                    // pass in the Calendar's renderTask function
                    // so that when a task and possibly the ViewTaskModal needs to re-render
                    //  all the task, they can call this function
                    // updatedTaskHandler={() => this.updatedTaskHandler()}
                    // the updateMoneyDisplay function from the HomeScreen is passed to Task
                    // updateMoneyDisplay={() => this.props.updateMoneyDisplay()}
                ></Task>
        }
        console.log("taskJsonData");
        console.log(taskJson);
        console.log("Calendar tempTaskArray");
        console.log(tempTaskArray);
        this.setState({taskArray: tempTaskArray});
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.taskArray}
                </ScrollView>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container:{
        // control how the children align horizontally
        alignItems: 'center',
        // make Flat List scrollable
        flex: 1,
    },
});
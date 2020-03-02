import * as React from 'react';
import { StyleSheet, View, Alert, FlatList, TouchableHighlightBase } from 'react-native';
import Task from '../home/Task';  // import task components

/**
 * Calendar Class
 *  \brief render each individual task
 * 
 */
export default class Calendar extends React.Component {
    state = {
        taskArray: [],
        delete: false,
        // dummy data
        // an array of tasks (TODO: format might change later)
        taskJson:{
            "1": {
                name: "Task 1",
                dueDate: new Date("2/21/2022"),
                completed: false,
            }, 
            "2": {
                name: "Task 2",
                dueDate: new Date("3/01/2022"),
                priority: "high",
                completed: false,
            },
            "3": {
                name: "Task 3",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "4": {
                name: "Task 4",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "5": {
                name: "Task 5",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "6": {
                name: "Task 6",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "7": {
                name: "Task 7",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "8": {
                name: "Task 8",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "9": {
                name: "Task 9",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "10": {
                name: "Task 10",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "11": {
                name: "Task 11",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
            "12": {
                name: "Task 12",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
                completed: false,
            },
        }
    }

    /** 
     * \brief unmount (stop displaying) a task and complete the class on Google Calendar
     * \detail
     *      - TODO: animate a task being completed (fade away first and then disappear?)
     *      - TODO: in Google Calendar, set the task to be completed
     * @param {*} task TODO: currently passing the entire task (which includes props, states, etc)
    */
    deleteCompletedTask(taskId) {
        let newTaskJson = {... this.state.taskJson};
        newTaskJson[taskId].completed = true;
        console.log("new");
        console.log(newTaskJson);
        this.setState({taskJson: newTaskJson});
        console.log("did it change task.props?");
        console.log(this.state.taskJson);
    }

    /**
     * \brief render each task based on its information
     * \detail
     *      The parent (Calendar)'s deleteCompletedTask function gets passed down to
     *      the children (individual tasks)
     *      The children will call its this.props.completeTask function to delete itself
     * @param {*} taskInfo in JSON format
     *      {
     *          name: <string, required>,
     *          dueDate: <Date, required>,
     *          priority: <string>,
     *          hoursLeft: <number>,
     *      }
     */
    renderTask() {
        this.state.taskArray = [];
        for (var taskId in this.state.taskJson) {
            if (!this.state.taskJson[taskId].completed){
                console.log(taskId);
                console.log(this.state.taskJson[taskId].completed);
                this.state.taskArray.push(
                    <Task
                        id = {taskId}
                        name={this.state.taskJson[taskId].name}
                        dueDate={this.state.taskJson[taskId].dueDate}
                        priority={this.state.taskJson[taskId].priority}
                        hoursLeft={this.state.taskJson[taskId].hoursLeft}
                        completeTask={(taskId) => this.deleteCompletedTask(taskId)}
                        completed={this.state.taskJson[taskId].completed}
                    ></Task>
                );
            }
        }
    };

    render() {
        this.renderTask();
        return (
            <View style={styles.container}>
                {this.state.taskArray}
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

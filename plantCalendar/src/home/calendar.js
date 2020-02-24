import * as React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Task from '../home/task';  // import task components

/**
 * Calendar Class
 *  \brief render each individual task
 * 
 */
export default class Calendar extends React.Component {
    state = {
        // dummy data
        // an array of tasks
        tasks: [
            {
                id: 0,
                name: "First Task",
                dueDate: new Date("2/21/2022"),
            },
            {
                id: 1,
                name: "Second Task",
                dueDate: new Date("3/01/2022"),
                priority: "high",
            },
            {
                id: 2,
                name: "Third Task",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
        ]
    }

    deleteCompletedTask(taskId) {
        var filtered = this.state.tasks.filter( item => item.id !== id);
        // this.setState({ tasks: this.state.tasks.filter( item => item.id !== id)});
        console.log(filtered);
    }

    renderTask() {
        let renderedTaskArr = [];
        for (taskInfo of this.state.tasks) {
            renderedTaskArr.push(
                <Task
                    id = {taskInfo.id}
                    name={taskInfo.name}
                    dueDate={taskInfo.dueDate}
                    priority={taskInfo.priority}
                    hoursLeft={taskInfo.hoursLeft}
                    completeTask={(id) => this.deleteCompletedTask(id)}
                ></Task>
            );
        };
        return renderedTaskArr;
    }

    render() {
        return (
            <View style={styles.container}>
                {/* Tempory Dummy Task to display basic function*/}
                {this.renderTask()}
            </View>
        );
    };
}

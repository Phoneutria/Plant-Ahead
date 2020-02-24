import * as React from 'react';
import { StyleSheet, View, Alert, FlatList } from 'react-native';
import Task from '../home/task';  // import task components

/**
 * Calendar Class
 *  \brief render each individual task
 * 
 */
export default class Calendar extends React.Component {
    state = {
        // dummy data
        // an array of tasks (TODO: format might change later)
        tasks: [
            {
                name: "Task 1",
                dueDate: new Date("2/21/2022"),
            },
            {
                name: "Task 2",
                dueDate: new Date("3/01/2022"),
                priority: "high",
            },
            {
                name: "Task 3",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 4",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 5",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 6",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 7",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 8",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 9",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 10",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 11",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
            {
                name: "Task 12",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                hoursLeft: 3, 
            },
        ]
    }

    /** 
     * \brief unmount (stop displaying) a task and complete the class on Google Calendar
     * \detail
     *      - TODO: animate a task being completed (fade away first and then disappear?)
     *      - TODO: in Google Calendar, set the task to be completed
     * @param {*} task TODO: currently passing the entire task (which includes props, states, etc)
    */
    deleteCompletedTask(task) {
        Alert.alert(task.props.name + " is completed!");
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
    renderTask(taskInfo){
        return <Task
                    name={taskInfo.item.name}
                    dueDate={taskInfo.item.dueDate}
                    priority={taskInfo.item.priority}
                    hoursLeft={taskInfo.item.hoursLeft}
                    completeTask={(task) => this.deleteCompletedTask(task)}
                ></Task>;
    };

    render() {
        return (
            <View style={styles.container}>
                {/* Flat List renders a scrolling list of similarily structured data */}
                <FlatList
                    data={this.state.tasks}
                    renderItem={(item) => this.renderTask(item)}
                />
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

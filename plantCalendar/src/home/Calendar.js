import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
        rerenderTaskWaitTime: 150,
        /**
         * dummy data
         * Json format
         *  right now, we use the task id (int) to identify which task's
         *  data we want to edit
         *  TODO: this format might be different once we integrate with 
         *  Google Calendar
         *  TODO:
         *      Right now, when we go to a differnt page, the taskData will
         *      get refreshed (the completed one will appear again). This is 
         *      because every time the homeScreen is mounted, Calendar will get
         *      created again. Should be able to fix it once we integrate with Google Calendar
         */
        taskData:{
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
                completed: false,
            },
            "4": {
                name: "Task 4",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "5": {
                name: "Task 5",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "6": {
                name: "Task 6",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "7": {
                name: "Task 7",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "8": {
                name: "Task 8",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                estTimeToComplete: 2,
                completed: false,
            },
            "9": {
                name: "Task 9",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                estTimeToComplete: 3,
                completed: false,
            },
            "10": {
                name: "Task 10",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "11": {
                name: "Task 11",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                estTimeToComplete: 4,
                completed: false,
            },
            "12": {
                name: "Task 12",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "13": {
                name: "Task 13",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
            "14": {
                name: "Task 14",
                dueDate: new Date("4/05/2022"),
                priority: "low",
                completed: false,
            },
        }
    }

    getUserTasksList = async () => {
        // request the list of task lists
        // a task list contains many tasks, think of "a task list" as a calendar
        let taskLists = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: { Authorization: `Bearer ${this.props.accessToken}`},
        }).catch(error => console.log("error message: " + error));
        // have to parse what we receive from the server into a json
        let taskListJson = await taskLists.json();
        let taskId = "https://www.googleapis.com/tasks/v1/lists/" + taskListJson.items[0].id + "/tasks";
        
        console.log(taskId);
        let tasks = await fetch(taskId, {
            headers: { Authorization: `Bearer ${this.props.accessToken}`},
        }).catch(error => console.log("error message: " + error));
        
        let tasksJson = await tasks.json();
       
        console.log(tasksJson);

        return tasksJson;
    }

    parseTaskJson = async () => {
        let taskJson = await this.getUserTasksList();
        const taskArray = taskJson.items;
        console.log(taskArray);
        for (let i = 0; i < taskArray.length; ++i){
            const task = taskArray[i];
            console.log(i);
            console.log(task.title);
        }
    }

    /** 
     * \brief modify this.props.taskData and mark a task (specified by taskId) as completed
     * \detail
     *      - TODO: in Google Calendar, set the task to be completed
     * @param {*} task TODO: currently passing the entire task (which includes props, states, etc)
    */
    deleteCompletedTask(taskId) {
        let newtaskData = {... this.state.taskData};
        newtaskData[taskId].completed = true;
        // need to use setState to change to trigger rendering
        // use a setTimeout so the task does not re-render too quickly,
        //     and the animation look smoother 
        setTimeout(()=> this.setState({taskData: newtaskData}),
                     this.state.rerenderTaskWaitTime);
    }

    /**
     * \brief render each task based on its information
     * \detail
     *      The parent (Calendar)'s deleteCompletedTask function gets passed down to
     *      the children (individual tasks)
     *      The children will call its this.props.completeTask function to delete itself
     * @param {*} taskId a string that represent the taskId (each task has an unique task Id)
     */
    renderTask() {
        // Have to clear the array so that after the tasks re-render, there isn't just a blank space
        // left for the deleted task
        this.state.taskArray = [];
        for (var taskId in this.state.taskData) {
            this.state.taskArray.push(
                <Task
                    id = {taskId}
                    name={this.state.taskData[taskId].name}
                    dueDate={this.state.taskData[taskId].dueDate}
                    priority={this.state.taskData[taskId].priority}
                    completed={this.state.taskData[taskId].completed}
                    estTimeToComplete={this.state.taskData[taskId].estTimeToComplete}
                    // pass in Calendar's deleteCompletedTask function
                    // so that when a task is completed, it can call Calendar's function
                    completeTask={(taskId) => this.deleteCompletedTask(taskId)}
                ></Task>
            );
        }
    };

    render() {
        this.renderTask();
        this.parseTaskJson();
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

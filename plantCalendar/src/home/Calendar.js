import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Task from '../home/Task';  // import task components

import * as firebase from 'firebase';

import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';
import { FlatList } from 'react-native-gesture-handler';

/**
 * Calendar Class
 *  \brief render each individual task
 * 
 */
export default class Calendar extends React.Component {
    state = {
        // a class to handle most of the firestore interfaces (eg. update data in firestore)
        firestoreHandle: new FirestoreHandle(),
        taskArray: [],
        renderDone: false,
        delete: false,
        rerenderTaskWaitTime: 50,
    }

    /**
     * \brief return a json of all the task from user's Google Task
     * \warning assume that the user only has one task list (and all the tasks are stored in that list)
     */
    getUserTasksJson = async () => {
        // request the list of task lists
        // a task list contains many tasks, think of "a task list" as a calendar
        let taskLists = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: { Authorization: `Bearer ${this.props.accessToken}`},
        }).catch(error => console.log("error message: " + error));
        // have to parse what we receive from the server into a json
        let taskListJson = await taskLists.json();

        // assume that all tasks from the user is stored in task list 1
        // directly set the task list id
        let taskListId = "https://www.googleapis.com/tasks/v1/lists/" + taskListJson.items[0].id + "/tasks";

        let tasks = await fetch(taskListId, {
            headers: { Authorization: `Bearer ${this.props.accessToken}`},
        }).catch(error => console.log("error message: " + error));
        
        let tasksJson = await tasks.json();

        return tasksJson;
    }

    getUserTasksArray = async () => {
        // gets the json of all the task data from Google Task
        const taskJson = await this.getUserTasksJson();

        const taskArray = taskJson.items;
        return taskArray;
    }

    /**
     * \brief gets the list of tasks from Google Task, initialize all the task in firestore
     * \details gets called when the Calendar gets mounted on HomeScreen (Only get called once)
     */
    initAllTasksInFirebase = async () => {
        // gets the json of all the task data from Google Task
        const taskJson = await this.getUserTasksJson();
        const taskArray = taskJson.items;

        for (let i = 0; i < taskArray.length; ++i){
            const task = taskArray[i];

            // call the firestore handler function to initialize the data in firestore if it hasn't
            // been created. 
            this.state.firestoreHandle.initFirebaseTaskData(this.props.userEmail, 
                task.id, task.title);
            // testing update Firebase Task Data
            // this.state.firestoreHandle.updateFirebaseTaskData(this.props.userEmail, 
            //     task.id, task.title, 'middle', 2, 0);
        }
    }

    componentDidMount() {
        this.initAllTasksInFirebase();
        
        this.renderTask();
    }

    /** 
     * \brief modify this.props.taskData and mark a task (specified by taskId) as completed
     * \detail
     *      - TODO: in Google Calendar, set the task to be completed
     * @param {*} task TODO: currently passing the entire task (which includes props, states, etc)
    */
    deleteCompletedTask(taskId) {
        this.state.firestoreHandle.setTaskCompleteInFirebase(this.props.userEmail, 
            taskId, true);
        
        // re-render the tasks
        this.renderTask();
    }

    /**
     * \brief render each task based on its information
     * \detail
     *      The parent (Calendar)'s deleteCompletedTask function gets passed down to
     *      the children (individual tasks)
     *      The children will call its this.props.completeTask function to delete itself
     * @param {*} taskId a string that represent the taskId (each task has an unique task Id)
     */
    renderTask = async () => {
        let currentTaskArray = [];
        
        // gets the json of all the task data from Google Task
        const taskJson = await this.getUserTasksJson();
        const taskDataArray = taskJson.items;
        
        const collectionRef = firebase.firestore().collection('users').doc(this.props.userEmail).
                    collection('tasks');
                    
        collectionRef.onSnapshot(() => {
            for (let i = 0; i < taskDataArray.length; ++i){
                const task = taskDataArray[i];

                const taskRef = firebase.firestore().collection('users').doc(this.props.userEmail).
                    collection('tasks').doc(task.id);

                taskRef.get().then(thisTask => {      
                    let taskFbData = thisTask.data();
                    console.log("Should have updated time spent " + i);
                    console.log(taskFbData.timeSpent);
                    currentTaskArray[i]=
                            <Task
                                userEmail = {this.props.userEmail}
                                key = {task.id}
                                id = {task.id}
                                name={task.title}
                                dueDate={new Date(task.due)}
                                priority={taskFbData.priority}
                                completed={taskFbData.completed}
                                estTimeToComplete={taskFbData.estTimeToComplete}
                                timeSpent = {taskFbData.timeSpent}
                                // pass in Calendar's deleteCompletedTask function
                                // so that when a task is completed, it can call Calendar's function
                                completeTask={(taskId) => this.deleteCompletedTask(taskId)}
                            ></Task>
                    ;             

                    if (i == taskDataArray.length-1){
                        console.log("i still satisfied the condition");
                        this.setState({renderDone: true, taskArray: currentTaskArray});
                    }
                });
            }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {console.log("rendering is killing me")}
                    {console.log(this.state.taskArray)}
                    {this.state.renderDone? this.state.taskArray: null}
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

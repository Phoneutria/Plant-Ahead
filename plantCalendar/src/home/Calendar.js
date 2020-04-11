import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Task from '../home/Task';  // import task components

import * as firebase from 'firebase';

import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';

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
     * \warning 
     *      - REQUIRED: use this format (use await!) to call this function and get the data properly
     *           const taskJson = await this.getUserTasksJson();
     *      - assume that the user only has exactly one task list (and all the tasks are stored in that list
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

    /**
     * \brief initialize any task that needs to be added to Firestore, then render all tasks
     * \details Called after Calendar is rendered
     */
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
     * \brief a handler function that allow other React Components to call Calendar's renderTask
     * \detail this function gets passed into other React Components as props
     *          so that if other components need to re-render the tasks, they can call this function
     *         example usage:
     *          - ViewTaskModal needs to re-render the task in order to update timeSpent for a task
     *              properly, so it needs to call this function
     */
    updatedTaskHandler() {
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
        let tempTaskArray = [];
        
        // gets the json of all the task data from Google Task
        const taskJson = await this.getUserTasksJson();
        const googleTaskDataArray = taskJson.items;
        
        const tasksCollectionRef = firebase.firestore().collection('users').doc(this.props.userEmail).
                    collection('tasks');

        // onSnapshot() allows us to listen for changes in the firebase
        // if any tasks get updated, the function inside onSnapshot() will run
        //     so we can re-render the tasks
        tasksCollectionRef.onSnapshot(() => {
            // iterate throught the data from google Task and 
            // render each task
            for (let i = 0; i < googleTaskDataArray.length; ++i){
                const taskGoogleData = googleTaskDataArray[i];

                // reference to the task document in firestore
                const taskRef = firebase.firestore().collection('users').doc(this.props.userEmail).
                    collection('tasks').doc(taskGoogleData.id);

                // get the data from firestore, then create the tasks
                taskRef.get().then(thisTask => {      
                    let taskFbData = thisTask.data();
                   
                    // create an arrays of Task React Components
                    tempTaskArray[i]=
                            <Task
                                userEmail = {this.props.userEmail}
                                // compiler wants a "key" prop when the components are 
                                // rendered in an array
                                // this prop is there to just make the compiler happy
                                key = {taskGoogleData.id}
                                // data for the task
                                id = {taskGoogleData.id}
                                name={taskGoogleData.title}
                                dueDate={new Date(taskGoogleData.due)}
                                priority={taskFbData.priority}
                                completed={taskFbData.completed}
                                estTimeToComplete={taskFbData.estTimeToComplete}
                                timeSpent = {taskFbData.timeSpent}
                                // pass in Calendar's deleteCompletedTask function
                                // so that when a task is completed, the task can call Calendar's function
                                completeTask={(taskId) => this.deleteCompletedTask(taskId)}
                                // pass in the Calendar's renderTask function
                                // so that when a task and possibly the ViewTaskModal needs to re-render
                                //      all the task, they can call this function
                                updatedTaskHandler={() => this.updatedTaskHandler()}
                            ></Task>
                    ;             

                    // A sneaky way to make the rendering task work
                    // this ensures that all the tasks will be added to the array
                    //      before Calendar calls its render() function
                    if (i == googleTaskDataArray.length-1){
                        // setState will trigger Calender to call its render() function
                        this.setState({taskArray: tempTaskArray});
                    }
                });
            }
        });
    };

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

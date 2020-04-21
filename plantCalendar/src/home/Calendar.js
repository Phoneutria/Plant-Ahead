import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Task from '../home/Task';  // import task components

import * as firebase from 'firebase';

import FirestoreHandle from '../dataHandlers/FirestoreHandle';
import GoogleHandle from '../dataHandlers/GoogleHandle';


// TODO: efficiency thoughts
// after loading taskArray, we should not be getting the data from the servers again
// we should not be loading complete tasks from Firebase. it is less intensive to ask google if they're done 
// than it is to grab them from firebase

/**
 * Calendar Class
 *  \brief render each individual task
 * 
 */
export default class Calendar extends React.Component {
    state = {
        // a class to handle most of the firestore interfaces (eg. update data in firestore)
        firestoreHandle: new FirestoreHandle(),
        // a class to update data in Google Tasks
        googleHandle: new GoogleHandle(),
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
     * \details 
     *      Updates both Firebase and the user's Google Calendar
     * @param {*} taskId a string that represent the taskId (each task has an unique taskId)
    */
    deleteCompletedTask(taskId) {
        this.state.firestoreHandle.setTaskCompleteInFirebase(this.props.userEmail, 
            taskId, true);
        
        // TODO: taskListId is currently undefined. Update when adding support for multiple task lists
        this.state.googleHandle.completeGoogleTask(taskId, undefined, this.props.accessToken);
        
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
     * \brief Sorts tasks by date, with the tasks that are due first at the top
     */
    sortByDate() {
        let sortedTaskArray = this.state.taskArray;
        sortedTaskArray.sort( (a, b) => {
            return a.props.dueDate - b.props.dueDate;
        })

        // updates state variable and triggers Calendar to call render() method
        this.setState({taskArray: sortedTaskArray});
        console.log(this.state.taskArray);
    }

    /**
     * \brief Sorts tasks by priority, with the highest priority tasks at the top
     */
    // TODO: store priority as a number?
    sortByPriority() {
        let sortedTaskArray=this.state.taskArray;
        sortedTaskArray.sort ( (a, b) => {
            let aPriority = a.props.priority;
            let bPriority = b.props.priotiy;
            if (aPriority != bPriority ) {
                if (aPriority == "high") {
                    if (bBriority == "low") {
                        return 2;  // a is high, b is low
                    } else {
                        return 1;  // a is high, b is medium
                    }
                } else if (aPriority == medium) {
                    if (bPriority == "high") {
                        return -1;  // a is medium, b is high
                    } else if (bPriority == "low") {
                        return 1;  // a is medium, b is low
                    }
                } else if (aPriority == "low") {
                    if (bPriority == "high") {
                        return -2;  // a is low, b is high
                    } else if (bPriority == "medium") {
                        return -1  // a is low, b is medium
                    }
                }
            } else {
                return 0;  // same priority level
            }
        })

        // updates state variable and triggers Calendar to call render() method
        this.setState({taskArray: sortedTaskArray});
    }

    /**
     * \brief render each task based on its information
     * \detail
     *      The parent (Calendar)'s deleteCompletedTask function gets passed down to
     *      the children (individual tasks)
     *      The children will call its this.props.completeTask function to delete itself
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

                    let dueDateAndTime = taskGoogleData.due;
                    // build the correct due date and time by combining Google and Firebase data
                    // if due time entry doesn't exist in Firebase, skip this step
                    if (taskFbData.dueTime) {
                        let dueDate = taskGoogleData.due.substring(0, 10);
                        dueDateAndTime = dueDate + taskFbData.dueTime;
                    } 
                   
                    // create an arrays of Task React Components
                    tempTaskArray[i]=
                            <Task
                                // --------------------------------variables-----------------------------
                                userEmail = {this.props.userEmail}
                                // compiler wants a "key" prop when the components are 
                                // rendered in an array
                                // this prop is there to just make the compiler happy
                                key = {taskGoogleData.id}
                                // data for the task
                                id = {taskGoogleData.id}
                                name={taskGoogleData.title}
                                dueDate={new Date(dueDateAndTime)}
                                priority={taskFbData.priority}
                                completed={taskFbData.completed}
                                estTimeToComplete={taskFbData.estTimeToComplete}
                                timeSpent = {taskFbData.timeSpent}
                                accessToken = {this.props.accessToken}
                                currentMoney = {this.props.currentMoney}

                                // --------------------------------functions-----------------------------
                                // pass in Calendar's deleteCompletedTask function
                                // so that when a task is completed, the task can call Calendar's function
                                completeTask={(taskId) => this.deleteCompletedTask(taskId)}
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
                    if (i == googleTaskDataArray.length-1){
                        // setState will trigger Calender to call its render() function
                        this.setState({taskArray: tempTaskArray});
                    }
                });
            }
        });
    };

    render() {
        console.log("calendar's render called");
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

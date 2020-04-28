/**
 * TaskData Class
 *  \brief stores user's task data for internal use
 * 
 *  \details Holds an internal copy of the task data which is updated when the app updates it
 *           Also passes these changes to the external databases (Firebase, Google Tasks)
 *           Loads all of the task data from Google Calendar and stores the relevant information as a JSON state variable
 */

import * as firebase from 'firebase';

import FirestoreHandle from '../dataHandlers/FirestoreHandle';
import GoogleHandle from '../dataHandlers/GoogleHandle';

 export default class TaskData {
    constructor(accessToken, userEmail) {
        this.accessToken = accessToken,
        this.userEmail = userEmail,
        this.taskArray = []  // array of JSON objects, each of which represents a task
        this.firestoreHandle = new FirestoreHandle();  // class for manipulating Firebase
        this.googleHandle - new GoogleHandle();  // class for manipulating Google Tasks
        this.initiated = false;
    }

     /**
      * \brief gets user's Task information from Google Tasks and adds it to taskArray
      * 
      * \details does not get completed tasks from Google Tasks 
      *         after calling this function, taskArray should be a collection of the following objects: 
      *     { 
      *         name
      *         id
      *         taskListId
      *         dueDay      
      *      }
      *     name is the name of the task
      *     id is the task's id
      *     taskListId is the id of the task's task list 
      *     dueDay is the day that the task is due, stored as an RFC1339 timestamp
      *
      */

      getGoogleData = async() => {
        console.log("getGoogledata called");
        let tempTaskArray = [];
        let k = 0;  // counter to tell us where to put the task in tempTaskArray

        // get task list data from server
        // each task list contains a bunch of tasks
        let taskLists = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: { Authorization: `Bearer ${this.accessToken}`},
        }).catch(error => console.log("error message: " + error));

        // parse what we receive from the server into a json
        let taskListJson = await taskLists.json();

        for (let i = 0; i < taskListJson.items.length; ++i) {
            // get task information from Google for each task list
            let taskUrl = "https://www.googleapis.com/tasks/v1/lists/" + taskListJson.items[i].id + "/tasks";
            
            let rawTasks = await fetch (taskUrl, {
                headers: { Authorization: `Bearer ${this.accessToken}`},
            }).catch(error => console.log("error message: " + error));
            
            let taskJson = await rawTasks.json();

            for (j = 0; j < taskJson.items.length; ++j) {
                let task = taskJson.items[j];

                // only save uncompleted tasks
                if (task.status != "completed") {
                    let newTask = {
                        name: task.title,
                        id: task.id, 
                        taskListId: taskListJson.items[i].id,
                        dueDay: task.due
                    }
                    tempTaskArray[k] = newTask;
                    ++k;
                }
            }
        }
        this.taskArray = tempTaskArray;
        console.log("taskArray at the end of google");
        console.log(this.taskArray);
      }

      /**
       * \brief gets user's task data from Firebase and adds it to taskArray
       * 
       * \details this function MUST be called after getGoogleData(); it uses the existing information in the taskArray to 
       *            get data from Firebase
       *          after calling this function, taskArray should be a collection of the following JSON objects:
       *          { 
      *             name
      *             id
      *             taskListId
      *             dueDate
      *             priority
      *             estTimeToComplete
      *             timeSpent
      *             }
      *     name is the name of the task
      *     id is the task's id
      *     taskListId is the id of the task's task list 
      *     dueDate is the day and time that the task is due, stored as an RFC1339 timestamp
      *     priority is the priority of the task, "low", "medium", or "high"
      *     estTimeToComplete is how much time the user thinks the task will take to finish
      *     timeSpent is the time the user has spent on the task
      * 
      *     if it can't find the data in Firebase, it adds a new entry to Firebase with the updated data
       */
    getFirebaseData = async() => {
        console.log(this.taskArray);
        for (let i = 0; i < this.taskArray.length; ++i){
            const task = this.taskArray[i];

            // call the firestore handler function to initialize the data in firestore if it hasn't
            // been created. 
            this.firestoreHandle.initFirebaseTaskData(this.userEmail, task.id, task.name);
        }

        const tasksCollectionRef = firebase.firestore().collection('users').
            doc(this.userEmail).collection('tasks');


        for (let i = 0; i < this.taskArray.length; ++i) {
            const taskRef = tasksCollectionRef.doc(this.taskArray[i].id);
            
            // get the data from firestore, then edit the tasks
            let thisTask = await taskRef.get();     
            let taskFbData = thisTask.data();
            console.log("taskFbData");
            console.log(taskFbData);

            let dueDateAndTime = this.taskArray[i].dueDay;
            // build the correct due date and time by combining Google and Firebase data
            // if due time entry doesn't exist in Firebase, skip this step
            if (taskFbData.dueTime) {
                let dueDate = this.taskArray[i].dueDay.substring(0, 10);
                dueDateAndTime = dueDate + taskFbData.dueTime;
            }
            this.taskArray[i].priority = taskFbData.priority;
            this.taskArray[i].estTimeToComplete = taskFbData.estTimeToComplete;
            this.taskArray[i].timeSpent = taskFbData.timeSpent;
            this.taskArray[i].dueDateAndTime = dueDateAndTime;
            delete this.taskArray[i].dueDay;
            }    
        console.log("Got stuff from Firebase:");
        console.log(this.taskArray);
    }    
        // let k = 0;
        // onSnapshot() allows us to listen for changes in the firebase
        // if any tasks get updated, the function inside onSnapshot() will run
        //     so we can re-render the tasks    
        // tasksCollectionRef.onSnapshot(() => {
            // iterate through the data from taskArray and add firebase data to it
        //     for (let i = 0; i < this.taskArray.length; ++i) {
        //         const taskRef = firebase.firestore().collection('users').doc(this.userEmail).
        //             collection('tasks').doc(this.taskArray[i].id);
                
        //         // get the data from firestore, then edit the tasks
        //         taskRef.get().then(thisTask => {      
        //             let taskFbData = thisTask.data();
        //             console.log("taskFbData");
        //             console.log(taskFbData);

        //             let dueDateAndTime = this.taskArray[i].dueDay;
        //             // build the correct due date and time by combining Google and Firebase data
        //             // if due time entry doesn't exist in Firebase, skip this step
        //             if (taskFbData.dueTime) {
        //                 let dueDate = this.taskArray[i].dueDay.substring(0, 10);
        //                 dueDateAndTime = dueDate + taskFbData.dueTime;
        //             }
        //             this.taskArray[i].priority = taskFbData.priority;
        //             this.taskArray[i].estTimeToComplete = taskFbData.estTimeToComplete;
        //             this.taskArray[i].timeSpent = taskFbData.timeSpent;
        //             ++k;
        //         });    
        //     }});
        //     console.log("Got stuff from Firebase:");
        //     console.log(this.taskArray);
        //     return new Promise((resolve, reject) => {
        //         if (k==this.taskArray.length) {
        //             console.log(this.taskArray);
        //             resolve(this.taskArray);
        //         }
        //     })
        // }

     /**
      * \brief Gets task data from Google and Firebase and stores it in taskArray
      * 
      * \details Only stores uncompleted tasks
      *          Returns a Promise that resolves to taskArray when finished
      */

      initiate = async() => {
        // console.log("Calling getGoogleData()");
        //     await this.getGoogleData();
        //     console.log("Calling getFirebaseData()");
        //     await this.getFirebaseData();
        // return this.state.taskArray;

        await this.getGoogleData();
        await this.getFirebaseData();
        return this.taskArray;

        // return new Promise((resolve, reject) => {
        //     this.getGoogleData()
        //     .then(this.getFirebaseData())
        //     .then(resolve(this.taskArray))
        //     .catch(reject("Could not load data"));
            // console.log("Calling getGoogleData()");
            // await this.getGoogleData();
            // console.log("Calling getFirebaseData()");
            // await this.getFirebaseData();

            // if (this.initiated == true) {
            //     resolve(this.state.taskArray);
            // } else {
            //     reject("Could not load data");
            // }
        //})
      }

      /**
       * \brief Creates a task in Google Tasks, taskArray, and Firebase
       */
      createTask = async() => {
        return 0;
      }

      /**
       * \brief Updates taskArray, Firebase, and Google Tasks depending on the user's input
       */
      updateTask = async() => {
        return 0;
      }

      /**
       * \brief Completes in the externally stored task data and deletes it from taskArray
       */
      completeTask = async() => {
        return 0;
      }

      /**
       * \brief Returns the locally stored task data, taskJson
       * 
       * \details Should not be called to get the data for the first time
       */
      getData() {
          console.log("getData called");
          console.log(this.taskArray);
          return this.taskArray;
      }


 }
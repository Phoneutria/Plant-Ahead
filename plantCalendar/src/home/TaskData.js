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
     state = {
         taskJson = []  // array of JSON objects, each one corresponding to a task
     }


     /**
      * \brief gets user's Task information from Google Tasks and adds it to taskJson
      * 
      * \details does not get completed tasks from Google Tasks 
      *         after calling this function, taskJson should be a collection of the following objects: 
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

      getGoogleTasks = async(accessToken) => {
          return 0;
      }

      /**
       * \brief gets user's task data from Firebase and adds it to taskJson
       * 
       * \details this function MUST be called after getGoogleTasks; it uses the existing information in the taskJson to 
       *            get data from Firebase
       *          after calling this function, taskJson should be a collection of the following objects:
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
      getFirebaseTasks = async(userEmail) => {
          return 0;
      }

     /**
      * \brief Gets task data from Google and Firebase and stores it in taskJson
      * 
      * \details Only stores uncompleted tasks
      */

      initiate = async () => {
        return 0;
      }

      /**
       * \brief Creates a task in Google Tasks, taskJson, and Firebase
       */
      createTask = async() => {

      }

      /**
       * \brief Updates taskJson, Firebase, and Google Tasks depending on the user's input
       */
      updateTask = async () => {

      }

      /**
       * \brief Completes in the externally stored task data and deletes it from taskJson
       */
      completeTask = async () = {

      }

      /**
       * \brief Returns the locally stored task data, taskJson
       */
      getData() {
          return this.state.taskJson;
      }


 }
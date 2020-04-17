import * as firebase from 'firebase';
import 'firebase/firestore';
import "./FirestoreSetup";

/**
 * FirestoreHandle class
 * 
 * \brief Provide helper function to handle data update, delete etc in 
 *      firebase's database: firestore
 * \details
 *      to use, you should import this class
 *          import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';
 *      and create an instance of it in the React Component's state:
 *          state = {
 *              ... other states ...
 *              firestoreHandle: new FirestoreHandle(),
 *              ... other states ...
 *          }
 *      if you want to get data from firebase, you need to also import firebase:
 *          import * as firebase from 'firebase';
 */
export default class FirestoreHandle {

    // --------------------------User Related Functions --------------------------
    /**
     * \brief Create the user (specified by userEmail parameter) in firestore with 
     * data (specified by name, money parameters). Default creates a plant in for the user.
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} name user's fullname, includes first name and last name
     * @param {*} money integer that keeps tracks of how much money a user has
     * @param {*} plantName name of the plant (default "plant 1")
     * 
     * This function is called by the createUserDataInFirestore function from the LoginScreen.js
     */
    initFirebaseUserData(userEmail, name, money, plantName) {
        firebase.firestore().collection('users').doc(userEmail).set(
            {
                name: name,
                money: money,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
        // calls this function to initialize a plant for the new user with the default plantName
        this.initFirebasePlantData(userEmail, plantName);
    }

    /**
     * \brief update the user's money in firestore
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} money integer that keeps track of how money the user has
     */
    updateUserMoneyFirebase(userEmail, money) {
        firebase.firestore().collection('users').doc(userEmail).set(
            {
                money: money,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

// --------------------------Task Related Functions --------------------------
    /**
     * \brief Initialize a given task data specified by its task id in firestore
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} taskId task's unique id from google Task's data
     * @param {*} taskName task's name (storing it so it's easier to debug)
     */
    initFirebaseTaskData(userEmail, taskId, taskName) {
        const taskRef = firebase.firestore().collection('users').doc(userEmail).
            collection('tasks').doc(taskId);
        
        taskRef.get().then(thisTask => {
            // only initialize the task data with default values if it doesn't exist
            if (!thisTask.exists) {
                this.updateFirebaseTaskData(userEmail, taskId, taskName, 
                    'medium', 2, 0, false);
            }
        });
    }

    /**
     * \brief Update a given task specified by its task id in firestore
     * 
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} taskId task's unique id from google Task's data, used to identify task in firestore
     * @param {*} taskName task's name (storing it so it's easier to debug)
     * @param {*} priority string, options: 'low', 'middle', 'high'
     * @param {*} estTimeToComplete double, how long the user estimates to complete this task
     * @param {*} timeSpent double, how long the user has spent on this task
     * @param {*} completed boolean, whether this task has been completed
     */
    updateFirebaseTaskData(userEmail, taskId, taskName, priority, estTimeToComplete, timeSpent, completed) {
        const taskRef = this.taskRef(userEmail, taskId);
        
        taskRef.set(
            {
                name: taskName,
                priority: priority,
                estTimeToComplete: estTimeToComplete,
                timeSpent: timeSpent,
                completed: completed,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

    /**
     * \brief update the timeSpent for a given task specified by its task id in firestore
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} timeSpent double, how long the user has spent on this task
     */
    updateTimeSpentInFirebase(userEmail, taskId, timeSpent) {
        const taskRef = this.taskRef(userEmail, taskId);
        taskRef.set(
            {
                timeSpent: timeSpent,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

    /**
     * \brief complete a given task specified by its task id in firestore
     * 
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} taskId task's unique id from google Task's data, used to identify task in firestore
     * @param {*} completed boolean, whether this task has been completed
     */
    setTaskCompleteInFirebase(userEmail, taskId, completed) {
        const taskRef = this.taskRef(userEmail, taskId);
        taskRef.set(
            {
                completed: completed,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

    /**
     * A helper function that defined taskRef in firestore, called in all functions
     * that are task related in FirestoreHandle.js
     * @param {*} userEmail 
     * @param {*} plantName 
     */
    taskRef(userEmail, taskId) {
        const taskRef = firebase.firestore().collection('users').doc(userEmail).
        collection('tasks').doc(taskId);
        return taskRef;
    }
    
// --------------------------Plant Related Functions --------------------------
    /**
     * A helper function that defined plantRef in firestore, called in all functions
     * that are plant related in FirestoreHandle.js
     * @param {*} userEmail 
     * @param {*} plantName 
     */
    plantRef(userEmail, plantName) {
        var plantRef;
        plantRef = firebase.firestore().collection('users').doc(userEmail).collection('plants').doc(plantName);
        return plantRef;
    }
    /**
     * \brief create a plant and its data in firestore
     * \details
     *      This function is first called in by the initFirebaseUserData
     *      In this specific case, it will generate a collection called 'plants', and 
     *      create one plant called 'plant 1' in the collection.
     *      After that, every time this function is called again, a new plant will be
     *      added to the same 'plants' collection.
     *      It default initialzes the growth point to 0, stage to 0, and fullyGrown to false
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} plantName plant's name
     */
    
    initFirebasePlantData(userEmail, plantName) {
        const plantRef = this.plantRef(userEmail, plantName)
        plantRef.get().then(thisPlant => {
            // only initialize the task data with default values if it doesn't exist
            if (!thisPlant.exists) {
                // this.updateFirebasePlantData(userEmail, plantName);
                plantRef.set(
                    {
                        name: plantName,
                        growthPoint: 0,
                        stage: 0,
                        fullyGrown: false,
                    },
                    // merge: true will update the fields in the document of create it if it doesn't exist
                    {merge: true}
                ).catch(
                    error => console.log(error)
                );
                console.log("A plant is initialized")
            }
        });
    }

    /**
     * \brief update the growthPoint for a plant specified by its name
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} plantName name of plant
     * @param {*} growthPoint an integer that keeps track of the plant's progress
     * @param {*} fullyGrown a boolean that indicates whether the plant is fully grown
     * @param {*} stage an integer that indicates the new stage of a plant
     * 
     */
    updatePlant(userEmail, plantName, growthPoint, fullyGrown, stage) {
        plantRef = this.plantRef(userEmail, plantName);
        plantRef.set(
            {
                growthPoint: growthPoint,
                fullyGrown: fullyGrown,
                stage: stage,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }
    
// --------------------------Example of Getting data from Firebase --------------------------
    /**
     * \warning DO NOT CALL THIS FUNCTION! 
     * \brief an example of how to get data from firebase and use that data to do something
     * @param {*} userEmail 
     * @param {*} taskId 
     */
    exampleOfGettingFirebaseTaskData(userEmail, taskId) {
        const taskRef = firebase.firestore().collection('users').doc(userEmail).
            collection('tasks').doc(taskId);

        taskRef.get().then(thisTask => {
            // an example of using the the task

            let taskData = thisTask.data();
            // setting a task's prority to be the priority stored in firestore
            // the left side "task.priority" is not right, this is just an example
            task.priority = taskData.priority;

            // Warning: Don't return anything in "then()"!
        });
    }
}

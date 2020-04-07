import * as firebase from 'firebase';
import 'firebase/firestore';
import "./FirestoreSetup";

/**
 * FirestoreHandle class
 * 
 * \brief Provide helper function to handle data update, delete etc in 
 *      firebase's database: firestore
 */
export default class FirestoreHandle {
    /**
     * \brief Update the firestore with data (specified by name, growthPoint parameters) for a given
     *      user (specified by userEmail parameter)
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} name user's fullname, includes first name and last name
     * @param {*} growthPoint integer
     */
    updateFirebaseUserData(userEmail, name, growthPoint) {
        firebase.firestore().collection('users').doc(userEmail).set(
            {
                name: name,
                growthPoint: growthPoint,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

    updateUserGrowthPointFirebase(userEmail, growthPoint) {
        firebase.firestore().collection('users').doc(userEmail).set(
            {
                growthPoint: growthPoint,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

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
        })
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
        const taskRef = firebase.firestore().collection('users').doc(userEmail).
            collection('tasks').doc(taskId);
        
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

    updateTimeSpentInFirebase(userEmail, growthPoint) {
        const taskRef = firebase.firestore().collection('users').doc(userEmail).
        collection('tasks').doc(taskId);

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
        const taskRef = firebase.firestore().collection('users').doc(userEmail).
            collection('tasks').doc(taskId);
        
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

    // TODO: Test this function (I'm too dead to test)
    
    createPlantDataInFirebase(userEmail, plantName) {
        const plantsCollectionRef = firebase.firestore().collection('users').doc(userEmail).
            collection('plants');
        
        plantsCollectionRef.set(
            {
                name: plantName,
                plantPoint: 0,
                stage: 0,
                fullyGrown: false,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
        );
    }

    updatePlantGrowthPoint(userEmail, plantId, plantPoint) {
        const plantRef = firebase.firestore().collection('users').doc(userEmail).
        collection('plants').doc(plantId);
    
        plantsCollectionRef.set(
            {
                plantPoint: plantPoint,
            },
            // merge: true will update the fields in the document of create it if it doesn't exist
            {merge: true}
        ).catch(
            error => console.log(error)
    );
    }

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

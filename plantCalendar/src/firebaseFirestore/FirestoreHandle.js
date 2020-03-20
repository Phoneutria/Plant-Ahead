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
     * \brief Update the firebase the data (specified by name, growthPoint parameters) for a given
     *      user (specified by userEmail parameter)
     * @param {*} userEmail gmail, used as unique id to identify user's data in firestore
     * @param {*} name user's fullname, includes first name and last name
     * @param {*} growthPoint integer
     */
    updateFirebaseUserData(userEmail, name, growthPoint) {
        firebase.firestore().collection('users').doc(userEmail).set({
            name: name,
            growthPoint: growthPoint,
        }).catch(
            error => console.log(error)
        );
    }
}
import * as React from 'react';
// TODO: remove Alert when we don't need it anymore
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import * as Google from 'expo-google-app-auth';

import * as firebase from 'firebase';
import 'firebase/firestore';
import "../dataHandlers/FirestoreSetup";

import FirestoreHandle from '../dataHandlers/FirestoreHandle';

import {iosClientId} from '../../credentials/iosClientId';
import {androidClientId} from '../../credentials/androidClientId';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * LogInScreen Class
 * 
 * \brief Generate the view for login screen
 */
export default class LogInScreen extends React.Component { 

    state = {
        defaultPwd: "password",
        userEmail: "",
        userName: "",
        firestoreHandle: new FirestoreHandle(),
    }
    
    /**
     * \brief pop up a webpage for Google default sign in,
     *          calls firebase sign up if user logs into google successfully
     * \detail use Expo Google: https://docs.expo.io/versions/latest/sdk/google/
     */
    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: androidClientId,
                behavior: 'web',
                iosClientId: iosClientId,
                scopes: ['https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
                'https://www.googleapis.com/auth/tasks',
                ],
            });

            if (result.type === 'success') {
                this.setState({userEmail: result.user.email, userName: result.user.name});
                this.firebaseSignUpSignIn(result.accessToken);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    /**
     * \brief if the user's account (associated with the google email) does not exist on firebase, sign up
     *          else, sign in the user
     */
    firebaseSignUpSignIn = (accessToken) => {
        // attempt to create the user first for signin firsts
        firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.defaultPwd)
        .then( userCredentials => {
            this.createUserDataInFirestore();
            this.props.navigation.navigate('Home', {accessToken: accessToken});
            return userCredentials.user.updateProfile({
                displayName: this.state.userName
            });
        })
        .catch(signUpError => {
            // if sign up failed, and the error message is "the account already exists"
            // then we can sign in the user
            if (signUpError.code == "auth/email-already-in-use"){
                firebase.auth().signInWithEmailAndPassword(this.state.userEmail, "password")
                .then(() => {  
                        this.props.navigation.navigate('Home', {accessToken: accessToken, userEmail: this.state.userEmail});
                    }
                )
                .catch(
                    logInError => Alert.alert(logInError)
                );
            }
        });
    }

    /**
     * \brief create the user's data on firebase's database: firestore if this user's data does not exist in firebase
     * \details call the function from FirestoreHandle class, which is responsible for handling data updates
     *      and other mechanisms in firestore
     */
    createUserDataInFirestore() {
        // firestore does not have direct method to check if data exist
        // have to try to get the data first and use if !exist
        firebase.firestore().collection('users').doc(this.state.userEmail).get().then(thisUser => {
            if (!thisUser.exists){
                // takes in user's email, name, growth point (default starting with 0 growth point), and
                // the plant name (default starting with "plant 1")
                this.state.firestoreHandle.initFirebaseUserData(this.state.userEmail, this.state.userName, 0, "plant 1");
            }
        }).catch(error => console.log(error));
    }

    render () {  
        return (
            <View style={styles.container}>
                 <LinearGradient
                // white '#ffffff'
                // light green '#b0e099'
                // green '#8ccd82'
                // brown '#c06318'
                // redish pink '#e37957'
                // brain pink  '#dc9b9b'
                // yellow #fff8d4'
                    colors={['#ffffff','#72a669']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 900,
                    }}
                    />
                <Image
                    style={styles.logo}
                    source={require('../../assets/Picture1.png')}/>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.signInWithGoogleAsync()}>
                    <Text style={styles.text}> Login With Google</Text>
                </TouchableOpacity>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container:{
        // control how the children align horizontally
        flex: 1,
        alignItems: 'center',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#72a669'//'#fdd8c0'
    },
    logo: {
        width: 200,
        height: 200,
        marginLeft:30,
    },
    button: {
        marginTop:30,
        marginBottom:100,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:40,
        marginRight:30,
        borderRadius:10,
        padding: 20,
        backgroundColor: '#8ccd82'
    },
    text: {
        color: '#ffffff',
        fontFamily: "Cochin",
        fontSize: 25,
        fontWeight: "bold"
    }
});


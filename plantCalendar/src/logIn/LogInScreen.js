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
import { AppLoading } from 'expo';

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
        fontsLoaded: false,
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
                //for loading screen purposes, reference _cacheResourcesAsync() desicription below
                isReady: false,
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

    /**
     * \brief: returns a promise after the image is loaded so that the Login screen can replace
     * the loading screen
     */
    async _cacheResourcesAsync() {
        const images = [require('../../assets/Picture1.png')];
    
        const cacheImages = images.map(image => {
          return Assets.fromModule(image).downloadAsync();
        }); 
        return Promise.all(cacheImages);
    }

    render () {  
        // Tells the loading screen to appear until _cacheResourcesAsync returns a promise
        // updates the state variable isReady to true
        if (!this.state.isReady) {
            return (
              <AppLoading
                startAsync={this._cacheResourcesAsync}
                onFinish={() => this.setState({ isReady: true })}
                onError={console.warn}
              />
            );
        }
            
        return (
            <View style={styles.container}>
                <Text style={styles.headingText}>Welcome To Plant Ahead!</Text>
                <Image
                    style={styles.logo}
                    source={require('../../assets/Picture1.png')}/>
                <TouchableOpacity
                style={styles.button}
                onPress={() => this.signInWithGoogleAsync()}>
                    <Text style={styles.buttonText}> Login With Google</Text>
                </TouchableOpacity>
            </View>
        );
    }  
}


const styles = StyleSheet.create({
    container:{
        // control how the children align horizontally
        flex: 1,
        alignItems: 'center',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#ffffff'//'#fdd8c0'
    },
    logo: {
        width: 200,
        height: 200,
        marginLeft:20,
        marginTop:20,
    },
    button: {
        marginTop:30,
        marginBottom:100,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        borderRadius:10,
        padding: 20,
        backgroundColor: '#eebaba'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: "bold"
    },
    headingText:{
        color: '#8ccd82',
        fontSize: 30,
        fontWeight: "bold",
    }
});

// TODO: these are the colors that might be used, delete later
// white '#ffffff'
// light green '#b0e099'
// green '#8ccd82'
// brown '#c06318'
// redish pink '#e37957'
// brain pink  '#dc9b9b'
// yellow #fff8d4'
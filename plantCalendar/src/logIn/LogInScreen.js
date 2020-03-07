import * as React from 'react';
// TODO: remove Alert when we don't need it anymore
import { StyleSheet, View, Text, Button, Image, Alert} from 'react-native';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import {iosClientId} from '../../credentials/iosClientId';
import {androidClientId} from '../../credentials/androidClientId';

/**
 * logInScreen Class
 * TODO: We might not need a class if we are generating the view?
 *       Do we need any other feature (member function)?
 * 
 * \brief Generate the view for login screen
 */
export default class LogInScreen extends React.Component { 
    state = {
        defaultPwd: "password",
        userEmail: "",
        userName: "",
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
                ],
            });

            if (result.type === 'success') {
                this.setState({userEmail: result.user.email, userName: result.user.name});
                this.getUsersCalendarList(result.accessToken);
                // this.firebaseSignUp();
                
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    getUsersCalendarList = async (accessToken) => {
        console.log(accessToken);
        let calendarsList = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: { Authorization: `Bearer ${accessToken}`},
        }).catch(error => console.log(error));
        let json = await calendarsList.json();
        console.log(await calendarsList.json());
        
        return calendarsList;
    }

    /**
     * \brief if the user's account (associated with the google email) does not exist on firebase, sign up
     *          else, sign in the user
     */
    firebaseSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.userEmail, this.state.defaultPwd)
        .then( userCredentials => {
            this.props.navigation.navigate('Home');
            return userCredentials.user.updateProfile({
                displayName: this.state.userName
            });
        })
        .catch(signUpError => {
            // if sign up failed, and the error message is "the account already exists"
            // then we can sign in the user
            if (signUpError.code == "auth/email-already-in-use"){
                firebase.auth().signInWithEmailAndPassword(this.state.userEmail, "password")
                .then(
                    this.props.navigation.navigate('Home')
                )
                .catch(
                    logInError => Alert.alert(logInError)
                );
            }
        });
    }

    render () {       
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/loginLogo.png')}/>
                <Button
                    title="Continue With Google"
                    onPress={() => this.signInWithGoogleAsync()}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container:{
        // control how the children align horizontally
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
    },
});

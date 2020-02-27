import * as React from 'react';
// TODO: remove Alert when we don't need it anymore
import { StyleSheet, View, Text, Button, Image, Alert} from 'react-native';

/**
 * logInScreen Class
 * TODO: We might not need a class if we are generating the view?
 *       Do we need any other feature (member function)?
 * 
 * \brief Generate the view for login screen
 */
export default class LogInScreen extends React.Component { 
    /**
     * TODO: Discuss placement of this function
     *  Do we want to put this function as a member function? 
     *  Or we can put this function in a separate file and export it
     */
    logInWithGoogle ()  {
        // TODO: remove this when we actually implement login with google
        // alert the user that this button is clicked
        // App seems laggy when alert and navigate tries to run at the same time
        Alert.alert("Continue to Google button clicked!");

        this.props.navigation.navigate('Home');
    };

    render () {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/loginLogo.png')}/>
                <Button
                    title="Continue With Google"
                    onPress={() => this.logInWithGoogle()}/>
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

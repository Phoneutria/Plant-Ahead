import * as React from 'react';
import {View, Text, Button} from 'react-native';

export default class logInScreen extends React.Component {
    render () {
        return (
            <View>
                <Text>Login Screen</Text>
                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('Home')}/>
            </View>
        );
    };
}
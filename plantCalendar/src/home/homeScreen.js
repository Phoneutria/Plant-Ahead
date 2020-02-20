import * as React from 'react';
import {View, Text, Button} from 'react-native';

export default class homeScreen extends React.Component {

    render () {
        return (
            <View>
                <Text>Home Screen</Text>
                <Button
                    title="Go to Garden"
                    onPress={() => this.props.navigation.navigate('Garden')}/>
                <Button
                    title="Go to Friends"
                    onPress={() => this.props.navigation.navigate('Friends')}/>
                <Button
                    title="Go to Login"
                    onPress={() => this.props.navigation.navigate('Login')}/>
            </View>
        );
    };
}
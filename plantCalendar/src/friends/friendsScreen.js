import * as React from 'react';
import {View, Text, Button} from 'react-native';

export default class FriendsScreen extends React.Component {
    render () {
        return (
            <View>
                <Text>Friends Screen</Text>
                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('Home')}/>
            </View>
        );
    };
}
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';

/**
 * Task Class
 *  TODO: Currently inside the home folder, might need to move it later?
 *  When you check off a task, it will just disappear?
 * 
 */

export default class Task extends React.Component {
    state = {
        completed: false,
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style = {styles.task}>
                    <Text>Task name</Text>
                    <Text>Due date</Text>
                </TouchableOpacity>
                <CheckBox 
                    checked = {this.state.completed}
                    onPress = {() => this.setState({completed: !this.state.completed})}
                />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
    },
    task:{
        backgroundColor: '#afeeee',
    },
});
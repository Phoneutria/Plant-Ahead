import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

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

    isCompleted() {
        this.setState({completed: !this.completed});
        Alert.alert(this.props.name + " is completed!");
        /**
         * TODO: Discuss
         * - We can't unmount a child on its own, need to do it from the parent
         * - Probably need to use the parent class to unmount it
         */
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style = {styles.task}
                    onPress = {() => Alert.alert("more details about: " + this.props.name)}
                >
                    <Text>{this.props.name}</Text>
                    <Text>{this.props.dueDate.toString()}</Text>
                    <Text>{this.props.priorityLevel}</Text>
                    <Text>{this.props.hoursLeft}</Text>
                </TouchableOpacity>
                <CheckBox 
                    checked = {this.state.completed}
                    onPress = {() => this.isCompleted()}
                />
            </View>
        );
    };
}

/**
 * Use PropTypes library to typecheck inputted props
 * and make sure required props are inputted
 */
Task.propTypes = {
    name: PropTypes.string.isRequired,
    dueDate: PropTypes.instanceOf(Date).isRequired,
    priorityLevel: PropTypes.oneOf(['low', 'medium', 'high']),
    hoursLeft: PropTypes.number
};

/**
 * Give default value for some props
 */
Task.defaultProps = {
    priorityLevel: 'medium',
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
    },
    task:{
        backgroundColor: '#afeeee',
    },
});
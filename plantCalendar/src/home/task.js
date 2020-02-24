import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import PropTypes from 'prop-types';

/**
 * Task Class
 *  \brief render each individual task
 * 
 */
export default class Task extends React.Component {
    state = {
        completed: false,
    };

    /**
     * \brief check the checkbox and call parent (Calendar Class)'s function to
     *      complete this task
     */
    isCompleted() {
        this.setState({completed: !this.state.completed});
        /**
         * TODO: Discuss
         * - We can't unmount a child on its own, need to do it from the parent
         * - Probably need to use the parent class to unmount it
         */
        this.props.completeTask(this);
    };

    render() {
        return (
            <View style={styles.container}>
                {/** 
                 * Create a clickable rectangle that displays info about a task 
                 *  once it's clicked, it will call the task viewer (a modal)
                 */}
                <TouchableOpacity 
                    style = {styles.task}
                    onPress = {() => Alert.alert("more details about: " + this.props.name)}
                >
                    <Text>{this.props.name}</Text>
                    <Text>{this.props.dueDate.toString()}</Text>
                    <Text>{this.props.priority}</Text>
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
    priority: PropTypes.oneOf(['low', 'medium', 'high']),
    hoursLeft: PropTypes.number
};

/**
 * Give default value for some props
 */
Task.defaultProps = {
    priority: 'medium',
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
    },
    task:{
        backgroundColor: '#afeeee',
    },
});

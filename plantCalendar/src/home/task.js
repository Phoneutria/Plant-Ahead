import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style = {styles.task}>
                    <Text>{this.props.name}</Text>
                    <Text>{this.props.dueDate.toString()}</Text>
                    <Text>{this.props.priorityLevel}</Text>
                    <Text>{this.props.hoursLeft}</Text>
                </TouchableOpacity>
                <CheckBox 
                    checked = {this.state.completed}
                    onPress = {() => this.setState({completed: !this.state.completed})}
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
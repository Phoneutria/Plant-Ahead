import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Animated } from 'react-native';
import { CheckBox } from 'react-native-elements';
// allow react native to check the input props for Task Class
import PropTypes from 'prop-types';
// allow a child component (not a Screen) to use the "navigation"
// in this case, allow a Task component to open the ViewTaskModal
import { useNavigation } from '@react-navigation/native';

/**
 * Task Class
 *  \brief render each individual task
 * 
 */
class Task extends React.Component {
    
    state = {
        fadeValue: new Animated.Value(1),
        checked: false,
    };

    /**
     * \brief check the checkbox and call parent (Calendar Class)'s function to
     *      complete this task
     */
    isCompleted() {
        this.setState({checked: !this.state.checked});
        this.animateUnmount();
        /**
         * TODO: Discuss
         * - We can't unmount a child on its own, need to do it from the parent
         * - Probably need to use the parent class to unmount it
         */
        setTimeout(()=>this.props.completeTask(this.props.id), 400);
    };

    animateUnmount() {
        Animated.timing(this.state.fadeValue, {
            toValue: 0,
            duration: 400
        }).start();
    }

    render() {
        if (!this.props.completed) {
            return(
            <Animated.View style={{
                flexDirection: 'row',
                opacity: this.state.fadeValue,
            }}>
                {/** 
                 * Create a clickable rectangle that displays info about a task 
                 *  once it's clicked, it will call the task viewer (a modal)
                 */}
                <TouchableOpacity 
                    style = {styles.task}
                    // when the Task component calls the ViewTaskModal
                    //  it passes in its props so that ViewTaskModal can display this task's information
                    //  TODO: We might only pass selected props instead of all the props in the future
                    onPress = {() => this.props.navigation.navigate("ViewTaskModal", {taskProps: this.props})}
                >
                    <Text>{this.props.name}</Text>
                    <Text>{this.props.dueDate.toLocaleString()}</Text>
                </TouchableOpacity>
                <CheckBox 
                    checked = {this.state.checked}
                    onPress = {() => this.isCompleted()}
                />
            </Animated.View>
        );} else {
            return null;
        }
    };
}

/**
 * wrap the class component Task in a function in order to use "useNavigation"
 * 
 * useNavigation allows a component to use the "navigation" object without requiring
 *  the screen that the component is in (HomeScreen in this case) to pass "navigation" in
 * However, useNavigation cannot be used inside a class, so we have to wrap the Task class
 *  with a funciton and pass in the "navigation"
 * See react navigation doc: https://reactnavigation.org/docs/use-navigation/
 **/ 
export default function(props) {
    const navigation = useNavigation();

    return <Task {...props} navigation={navigation} />;
};

/**
 * Use PropTypes library to typecheck inputted props
 * and make sure required props are inputted
 */
Task.propTypes = {
    name: PropTypes.string.isRequired,
    // dueDate: PropTypes.instanceOf(Date).isRequired,
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
        width:'70%',  // make all the boxes for Task have the same width
    },
});

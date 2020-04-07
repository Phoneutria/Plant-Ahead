import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { CheckBox } from 'react-native-elements';
// allow react native to check the input props for Task Class
import PropTypes from 'prop-types';
// allow a child component (not a Screen) to use the "navigation"
// in this case, allow a Task component to open the ViewTaskModal
import { useNavigation } from '@react-navigation/native';
// import * as firebase from 'firebase';

import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';

/**
 * Task Class
 *  \brief render each individual task
 * 
 */
class Task extends React.Component {
    constructor(props) {
        super(props);
        this.isCompleted = this.isCompleted.bind(this);
    }

    state = {
        // for animation
        fadeAnimationTime: 250,
        fadeValue: new Animated.Value(1),
        // for the checkbox
        checked: false,
        // // for estimated time left
        // timeSpent: 0,
        timeLeft: this.props.estTimeToComplete-this.props.timeSpent,
        // a class to handle most of the firestore interfaces (eg. update time in firestore)
        firestoreHandle: new FirestoreHandle(),
    };

    /**
     * \brief check the checkbox, animate fading out, and call parent (Calendar Class)'s 
     *      function to complete this task
     */
    isCompleted() {
        this.setState({checked: !this.state.checked});  // check the checkbox
        this.animateUnmount();
        // setTimeout allow the task to finish fading away, then
        // it calls the parent(Calendar Class)'s function to complete the task
        setTimeout(()=>this.props.completeTask(this.props.id),
                     this.state.fadeAnimationTime);
    };

    /**
     * \brief Animate the task fading away by changing its opacity
     */
    animateUnmount() {
        Animated.timing(this.state.fadeValue, {
            toValue: 0,
            duration: this.state.fadeAnimationTime,
        }).start();
    }


    componentDidUpdate(prevProps) {
        console.log("re-render?");
        if (this.props.timeSpent !== prevProps.timeSpent) {
            console.log("re-render");
            // after we change the timeSpent, we need to call setState again and change time left
            this.setState ( () => {
                let newTimeLeft = parseFloat(this.props.estTimeToComplete) - parseFloat(this.props.timeSpent);
                // if the time spent exceed estimated time, time left should just be 0
                if (newTimeLeft < 0) {
                    newTimeLeft = 0;
                }
                return {timeLeft: newTimeLeft};
            });

            this.props.navigation.setParams({
                task: this
            });
        }
    }

    componetDidMount() {
        console.log("Please tell me you have the right time spent: " + this.props.timeSpent);
    }
    
    render() {
        // only render the task if it is not completed
        if (!this.props.completed) {
            return(
                <Animated.View style={{
                    marginBottom: 5,
                    flexDirection: 'row',
                    opacity: this.state.fadeValue,  // allow animation to change opacity and animate fading away
                }}>
                    {/** 
                     * Create a clickable rectangle that displays info about a task 
                     *  once it's clicked, it will call the task viewer (a modal)
                     */}
                    <TouchableOpacity 
                        style = {styles.task}
                        // when the Task component calls the ViewTaskModal
                        //  it passes in itself so that ViewTaskModal can display this task's information
                        onPress = {() => {
                            console.log("Should have the newest");
                            console.log(this.props.timeSpent);
                            this.props.navigation.navigate("ViewTaskModal", {
                                task: {
                                    name: this.props.name,
                                    id: this.props.id,
                                    dueDate: this.props.dueDate,
                                    priority: this.props.priority,
                                    estTimeToComplete: this.props.estTimeToComplete,
                                    timeSpent: this.props.timeSpent,
                                    timeLeft: this.state.timeLeft,
                                    completedHandler: this.isCompleted,
                                },
                                userEmail: this.props.userEmail,
                            });}}
                    >
                        <Text>{this.props.name}</Text>
                        <Text>{this.props.dueDate.toLocaleString()}</Text>
                    </TouchableOpacity>
                    <CheckBox 
                        checked = {this.state.checked}
                        onPress = {() => this.isCompleted()}
                    />
                </Animated.View>
            );
        } else {
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
    task:{
        backgroundColor: '#97CAEF',
        width:'70%',  // make all the boxes for Task have the same width
    },
});

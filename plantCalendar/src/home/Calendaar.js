import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Task from '../home/Task';  // import task components

import * as firebase from 'firebase';

import FirestoreHandle from '../dataHandlers/FirestoreHandle';
import GoogleHandle from '../dataHandlers/GoogleHandle';

/**
 * Calendar Class
 *  \brief render each individual task
 *         Created by HomeScreen using HomeScreen's state's TaskData object and functions for updating and completing tasks 
 *  TODO: rename to Calendar after finished moving functions around
 * 
 */
export default class Calendaar extends React.Component {
    constructor(props) {
        super(props)
        state = {
            taskArray: []
        }
    }

    /**
     * \brief After component has mounted, render tasks
     */
    componentDidMount() {
        this.renderTask();
    }

    /**
     * \brief Translates TaskData into an array of Tasks
     */
    renderTask() {
        return 0;
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.taskArray}
                </ScrollView>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container:{
        // control how the children align horizontally
        alignItems: 'center',
        // make Flat List scrollable
        flex: 1,
    },
});
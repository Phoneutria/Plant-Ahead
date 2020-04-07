import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, 
        StyleSheet, Alert, Image} from 'react-native';
import * as Progress from 'react-native-progress';
import SpriteSheet from 'rn-sprite-sheet';

import * as firebase from 'firebase';

export default class GardenScreen extends React.Component {
    /* TODO: currently the growthpoints is a state variable
    this means that when you go from homeScreen to other
    screens and come back, growthPoints will be restored 
    to 0. In the future, it should be a global variable 
    that is taking data from Firebase or other place */
    constructor(props) {
        super(props);
        // have to do this, so the array "plantAnimationFunctions" can work
        this.playStage0 = this.playStage0.bind(this);
        this.playStage1 = this.playStage1.bind(this);
        this.playStage2 = this.playStage2.bind(this);
        this.state = {
            growthPoints: 0,
            // TODO: temporary solution to animate base on stage
            // the "stage" of the plant act as the index to pick which function to call
            plantAnimationFunctions: [this.playStage0, this.playStage1, this.playStage2],
        };

        this.plantRef = null;
    };

    /**
     * TODO: this function is probably incomplete, a rough way of how you will animate based on plant's stage
     * \brief animate the plant based on its stage stored in firebase
     */
    playPlant() {
        const plantCollectionRef = firebase.firestore().collection('users').doc(this.props.route.params.userEmail).
            collection('plants');
        
        // Warning: assume that there is only one plant that we are currently growing
        //      so that only one plant data has fullyGrown == false
        plantCollectionRef.where("fullyGrown", "==", false).onSnapshot( (querySnapShot) => {
            // get the plant that is not fullyGrown
            querySnapShot.forEach(doc => {
                const plantData = doc.data();
                
                // use the stage as index to figure out which animation function to call
                let animationFunc = this.state.plantAnimationFunctions[plantData.stage];
                animationFunc();
            });
        })
        
    }
    // TODO: make logo bigger (when ever I change the height or width,
    // the logo just gets cut off)
    progressAdded() {
        if(this.state.growthPoints < 1){
            this.setState({ growthPoints: this.state.growthPoints+0.1 });
            Alert.alert("adding points!");
        } else {
            Alert.alert("Your tree is done growing!");
        }
    }

    playStage0() {
        this.plant.play({
            type: "stage0", // (required) name of the animation (name is specified as a key in the animation prop)
            fps: 7, // frames per second
            loop: true, // if true, replays animation after it finishes
            resetAfterFinish: false, // if true, the animation will reset back to the first frame when finished; else will remain on the last frame when finished
            onFinish: () => {}, // called when the animation finishes; will not work when loop === true
          });
    }

    playStage1() {
        console.log("stage1");
        this.plant.play({
            type: "stage1", // (required) name of the animation (name is specified as a key in the animation prop)
            fps: 7, // frames per second
            loop: true, // if true, replays animation after it finishes
            resetAfterFinish: false, // if true, the animation will reset back to the first frame when finished; else will remain on the last frame when finished
            onFinish: () => {}, // called when the animation finishes; will not work when loop === true
          });
          
    }
    
    playStage2() {
        console.log("stage2");
        this.plant.play({
            type: "stage2", // (required) name of the animation (name is specified as a key in the animation prop)
            fps: 7, // frames per second
            loop: true, // if true, replays animation after it finishes
            resetAfterFinish: false, // if true, the animation will reset back to the first frame when finished; else will remain on the last frame when finished
            onFinish: () => {}, // called when the animation finishes; will not work when loop === true
          });
    }

    render () {
        return (
        <View>
            <View style={styles.container}>
                {/* Testing how to import and use a sprite sheet */}
                
                <SpriteSheet
                    ref={ref => (this.plant = ref)} // declare the reference to this sprite as a data member of Garden Class
                    source={require('./plants/sunflower.png')}
                    columns={3}
                    rows={3}
                    height={300} // set either, none, but not both
                    // width={200}
                    imageStyle={{ marginTop: -1 }}
                    // refer to the sprite sheet for sunflower
                    animations={{
                        stage0: [0, 1, 2, 1],
                        stage1: [3, 4, 5, 4],
                        stage2: [6, 7, 8, 7],
                    }}
                />
                <Button
                    title="play"
                    onPress={() => this.playPlant()}/>
                <Button
                    title="Water"
                    onPress={this.progressAdded.bind(this)}/>
                <Button
                    title="Fertilize"
                    onPress={this.progressAdded.bind(this)}/>
                <Button
                    title="Shop"
                    onPress={this.progressAdded.bind(this)}/>
                <Text
                    style={{fontSize:20, color:'#0E88E5', marginBottom: 20}}>
                    You currently have  [   
                    {/*.toFixed(1) rounds the number to 1 decimal place for */}
                    <Text>{this.state.growthPoints.toFixed(1)}</Text>
                    ] growthPoints!
                </Text>
            </View>
            <Progress.Bar 
                progress={this.state.growthPoints} 
                width={300} 
                height={20}
                style={styles.progressBar}
                />
         </View>
        )
    }
};

styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        color:'#0E88E5',
        marginBottom: 10
    },
    progressBar:{
        left: 40,
    },
    logo: {
        marginTop: 50,
        width: 150,
        height: 150,
    },
    container:{
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
});

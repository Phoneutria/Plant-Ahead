import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, 
        StyleSheet, Alert, Image} from 'react-native';
import * as Progress from 'react-native-progress';
import SpriteSheet from 'rn-sprite-sheet';

import * as firebase from 'firebase';
import FirestoreHandle from '../firebaseFirestore/FirestoreHandle';

export default class GardenScreen extends React.Component {
    /* TODO: currently the growthpoints is a state variable
    this means that when you go from homeScreen to other
    screens and come back, growthPoints will be restored 
    to 0. In the future, it should be a global variable 
    that is taking data from Firebase or other place */
    constructor(props) {
        super(props);
        // have to do this, so the array "plantAnimationFunctions" can work
        // this.playStage0 = this.playStage0.bind(this);
        // this.playStage1 = this.playStage1.bind(this);
        // this.playStage2 = this.playStage2.bind(this);
        // this.playPlant = this.playPlant.bind(this);
        this.state = {
            firestoreHandle: new FirestoreHandle,
            // TODO: temporary solution to animate base on stage
            // the "stage" of the plant act as the index to pick which function to call
            // plantAnimationFunctions: [this.playStage0, this.playStage1, this.playStage2],
        };
        
        this.plantRef = null;
    };

    /**
     * TODO: this function is can only animate the first plant, need to be able to check if 
     * the plant if fully grown. If yes, then create a new plant
     * 
     * TODO: currently, this function is called if you press the play button
     * We want to eventually make it such that it plays all the time??? (undecided)
     * 
     * \brief animate the plant based on its stage stored in firebase (no parameters necessary)
     * This function calls the getStage() method from the FirestoreHandle class, by passing
     * the class the userEmail and the name of the plant. Then the method returns the stage
     * of the current plant, and passed this as an argument to call playStage() 
     * function
     */
    async getPlantName() {
        // Warning: assume that there is only one plant that we are currently growing
        //      so that only one plant data has fullyGrown == false
        const plantCollectionRef = firebase.firestore().collection('users').doc(this.props.route.params.userEmail).
            collection('plants');
        return plantCollectionRef.where("fullyGrown", "==", false).get().then((querySnapShot) => {
            // get the plant that is not fullyGrown
            // querySnapShot.forEach(doc => {
            //     // get the name of the plant 
            //     console.log(doc.get("name"))
            //     return doc.get("name");
            // });
            return querySnapShot.docs[0].get("name");
        })
        .catch(err => {
            console.log("error getting plants", err);
        })
       
    }
    
    /**
     * \breif: This function, base on the stage of the plant, animates the sprite accordingly
     * \detail: First this function calls the getPlantName function to get the plant name of 
     * the plant that has not fully grown yet. Then it calls the getStage function to get the 
     * stageof the specific plant. The stage determimes the type (a string of the plant), 
     * which is then used to animate the plant 
     */
    playPlant() {
        // not that since both getPlantName and getStage are asynchronus functions, need to use
        // then to await the promise
        this.getPlantName().then((plantName)=> {
            this.state.firestoreHandle.getStage(this.props.route.params.userEmail, plantName).then(stage => {
                var type = ""
                if (stage == 0) {
                    type = "stage0";
                } else if (stage == 1) {
                    type = "stage1";
                } else {
                    type = "stage2";
                }
                this.plant.play({
                    type: type, // (required) name of the animation (name is specified as a key in the animation prop)
                    fps: 7, // frames per second
                    loop: true, // if true, replays animation after it finishes
                    resetAfterFinish: false, // if true, the animation will reset back to the first frame when finished; else will remain on the last frame when finished
                    onFinish: () => {}, // called when the animation finishes; will not work when loop === true
                });
            });
                
        });
    }

    // TODO: make logo bigger (when ever I change the height or width,
    // the logo just gets cut off)
    progressAdded() {
        // userEmail = this.props.route.params.userEmail;
        // plantName = this.getPlantName();
        // this.state.firestoreHandle.getStage(userEmail, plantName).then(stage);
        // this.state.firestoreHandle.getGrowthPoint(userEmail, plantName).then(growthPoint)
        // console.log(growthPoints)
        // console.log(stage)
        console.log("test")
        // threshold = [50, 70, 100]
        // if(growthPoints < threshold[stage]){
        //     growthPoints += 10;
        //     this.firestoreHandle.updatePlantGrowthPoint(this.props.route.params.userEmail, plantName, growthPoints);
        //     if (action == 0) {
        //         Alert.alert("You just watered your plants!");
        //     } else {
        //         Alert.alert("You just fertilized your plants!");
        //     }
        // } else {
        //     if (stage < 2) {
        //         Alert.alert("Congratulations! Your plant can move to the next stage.Press play to see.");
        //     } else {
        //         this.firestoreHandle.updatePlantFullyGrown(userEmail, plantName);
        //         // TODO: instead of giving a default name, there will be a pop-up that prompts
        //         // users to enter a new name for the plant
        //         this.firestoreHandle.initFirebasePlantData(userEmail, "plant 2") 
        //         Alert.alert("Your plant is done growing! You will be given a new plant.");
        //     }
        // }
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
                    onPress={() => this.progressAdded()}/>
                <Button
                    title="Fertilize"
                    onPress={() => this.progressAdded()}/>
                <Text
                    style={{fontSize:20, color:'#0E88E5', marginBottom: 20}}>
                    You currently have  [   
                    {/*.toFixed(1) rounds the number to 1 decimal place for */}
                    {/* <Text>{this.state.growthPoints.toFixed(1)}</Text> */}
                    ] growthPoints!
                </Text>
            </View>
            <Progress.Bar 
                progress={0} 
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

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
        this.state = {
            firestoreHandle: new FirestoreHandle,
            plantName: "temp",
            growthPoint: -1,
            stage: -1,
            userEmail: this.props.route.params.userEmail,
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
        const plantCollectionRef = firebase.firestore().collection('users').doc(this.state.userEmail).
            collection('plants');
        return plantCollectionRef.where("fullyGrown", "==", false).get().then((querySnapShot) => {
            // get the plant that is not fullyGrown
            this.setState({plantName: querySnapShot.docs[0].get("name")})
        })
        .catch(err => {
            console.log("error getting plants", err);
        })
       
    }
      /**
     * \brief get the stage of a plant
     * @param {*} plantName
     */
    getPlantInfo(plantName) {
        // var plantRef = this.plantRef(userEmail, plantName);
        const plantRef = firebase.firestore().collection('users').doc(this.state.userEmail).
        collection('plants').doc(plantName);
        return plantRef.get().then(thisPlant => {
            this.setState({stage: thisPlant.data().stage});
            this.setState({growthPoint: thisPlant.data().growthPoint});
        });
    }
    
    /**
     * \breif: This function, base on the stage of the plant, animates the sprite accordingly
     * \detail: First this function calls the getPlantName function to get the plant name of 
     * the plant that has not fully grown yet. Then it calls the getStage function to get the 
     * stage of the specific plant. The stage determimes the type (a string of the plant), 
     * which is then used to animate the plant 
     */
    async playPlant() {
        // not that since both getPlantName and getStage are asynchronus functions, need to use
        // then to await the promise
        await this.getPlantName();
        await this.getPlantInfo(this.state.plantName);
        
        var type = ""
        if (this.state.stage == 0) {
            type = "stage0";
        } else if (this.state.stage == 1) {
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
    }

  

    /**
     * /brief: updates plant info whenever user waters or fertilizes the plant
     * @param {*} action an integer that indicates whether the user watered or fertilized the plant
     * This function is called whenever the water or fertilize button is pressed. It first gets the 
     * current stats by calling the playPlant function. Then, it updates the stats depending on 
     * the current stats, by calling the updatePlant in the FirestoreHandle class.
     * threshold is an array that holds 3 integers to indicate how many growth points each stage needs
     * to move to the next one.
     * If growth point is less than the threshold during that stage, 10 growth points will be added
     * If plant is in stage 0 or 1 and growth point achieves threshold, plant moves to next stage
     * If plant is in stage 2 and growth point achieves threshold, new plant is created in database
     * (calls initFirebasePlantData in the FirestoreHandle class)
     */
    progressAdded(action) {
        this.playPlant();

        let threshold = [50, 70, 100]
        if(this.state.growthPoint < threshold[this.state.stage]){
            this.state.firestoreHandle.updatePlant(this.state.userEmail, this.state.plantName, 
                this.state.growthPoint+10, false, this.state.stage);
            if (action == 0) {
                Alert.alert("You just watered your plants! 10 points added.");
            } else {
                Alert.alert("You just fertilized your plants! 10 points added.");
            }
        } else {
            if (this.state.stage < 2) {
                this.state.firestoreHandle.updatePlant(this.state.userEmail, this.state.plantName, 
                    0, false, this.state.stage+1);
                Alert.alert("Congratulations! Your plant can move to the next stage. Press play to see.");
            } else {
                this.state.firestoreHandle.updatePlant(this.state.userEmail, this.state.plantName, 
                    this.state.growthPoint+10, true, this.state.stage+1);
                // TODO: instead of giving a default name, there will be a pop-up that prompts
                // users to enter a new name for the plant
                this.state.firestoreHandle.initFirebasePlantData(userEmail, "plant 2") 
                Alert.alert("Your plant is done growing! You will be given a new plant.");
            }
        }
        this.playPlant();
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
                    onPress={() => this.progressAdded(0)}/>
                <Button
                    title="Fertilize"
                    onPress={() => this.progressAdded(1)}/>
                <Text
                    style={{fontSize:20, color:'#0E88E5', marginBottom: 20}}>
                    You currently have  [   
                    <Text>{this.state.growthPoint}</Text>
                    ] growthPoints!
                </Text>
            </View>
            <Progress.Bar 
                progress={this.state.growthPoint/100.0} 
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

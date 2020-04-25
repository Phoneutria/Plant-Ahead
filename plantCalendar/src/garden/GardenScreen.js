import  React, { Component } from 'react';
import {View, Text, Button, TouchableOpacity, 
        StyleSheet, Alert, Image} from 'react-native';
import * as Progress from 'react-native-progress';
import SpriteSheet from 'rn-sprite-sheet';

import * as firebase from 'firebase';
import FirestoreHandle from '../dataHandlers/FirestoreHandle';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

export default class GardenScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firestoreHandle: new FirestoreHandle,
            plantName: "temp",
            growthPoint: -1,
            stage: -1,
            userEmail: this.props.route.params.userEmail,
            money: this.props.route.params.money,
        };
        this.plantRef = null;
    };

    /**
     * \brief: get the name of the current plant(the one that is not fully grown) from Firebase
     * \detail: This function is called in the playPant and progressAdded function
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
     * \brief: get and update the stage and growth point of a plant
     * @param {*} plantName name of the plant
     */
    async getPlantInfo(plantName) {
        const plantRef = firebase.firestore().collection('users').doc(this.state.userEmail).
        collection('plants').doc(plantName);
        // get information from firebase and return a promise
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
        // get name of the plant
        await this.getPlantName();
        // update stage and growth point state variables
        await this.getPlantInfo(this.state.plantName);
        // updates money state variable
        await this.getUserMoney();
        // type determines the stage of the plant in the animation
        var type = ""
        if (this.state.stage == 0) {
            type = "stage0";
        } else if (this.state.stage == 1) {
            type = "stage1";
        } else {
            type = "stage2";
        }
        // animate plant moving
        this.plant.play({
            // (required) name of the animation (name is specified as a key in the animation prop)
            type: type, 
            // frames per second
            fps: 7,    
            // if true, replays animation after it finishes
            loop: true, 
            // if true, the animation will reset back to the first frame when finished; 
            // else will remain on the last frame when finished
            resetAfterFinish: false,  
            // called when the animation finishes; will not work when loop === true
            onFinish: () => {},
        });
    }

    /**
     * \brief: updates plant info whenever user waters or fertilizes the plant
     * @param {*} cost an integer that indicates whether the user watered(1) or fertilized(2) the plant
     * \details: This function is called whenever the water or fertilize button is pressed. 
     * It calls the updateUserMoneyFirebase function to update money field in Firebase.
     * Then, it updates the plant stats depending on by calling the updatePlant in 
     * the FirestoreHandle class.
     * threshold is an array that holds 3 integers to indicate 
     */
    progressAdded(cost) {
        // growth point threshold for different stages(how many growth points each stage needs to move 
        // to the next one.)
        let threshold = [50, 70, 100]
        // local variables to handle updating growth point, and state
        let newGP = this.state.growthPoint + cost*10;

        // update money in Firebase
        this.state.firestoreHandle.updateUserMoneyFirebase(this.state.userEmail, this.state.money-cost);
        
        // if after adding the points, growth point is less than threshold, it will update in Firebase
        // with the new growth point
        if(newGP < threshold[this.state.stage]){
            this.state.firestoreHandle.updatePlant(this.state.userEmail, this.state.plantName, 
                newGP, false, this.state.stage);
        } else {
            // If plant is in stage 0 or 1 and growth point achieves threshold, plant moves to next stage
            // and the plant starts with the old growth point subtract by the threshold
            if (this.state.stage < 2) {
                this.state.firestoreHandle.updatePlant(this.state.userEmail, this.state.plantName, 
                    newGP-threshold[this.state.stage], false, this.state.stage+1);
                Alert.alert("Congratulations! Your plant can move to the next stage.");
            } 
            //  If plant is in stage 2 and growth point achieves threshold, new plant is created in database
            else {
                this.state.firestoreHandle.updatePlant(this.state.userEmail, this.state.plantName, 
                    threshold[oldStage], true, this.state.stage+1);
                // TODO: instead of giving a default name, there will be a pop-up that prompts
                // users to enter a new name for the plant
                this.state.firestoreHandle.initFirebasePlantData(userEmail, "plant 2") 
                Alert.alert("Your plant is done growing! You will be given a new plant.");
            }
        }
        // updates variables with new stats
        this.playPlant();
    }

    /**
     * \breif: This method updates the state variable money with the field in Firebase
     */
    async getUserMoney() {
        const userRef = firebase.firestore().collection('users').doc(this.state.userEmail);
        // get information from firebase
        return userRef.get().then(user => {
            this.setState({money: user.data().money});
        });
    }

    /**
     * \breif: Automatically called whenever the page is opened. Updates all state variables.
     */
    componentWillMount (){
        this.playPlant();
    }

    render () {
         // configuration for swiping the screen
         const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          };
        return (
        // If the user swipe to the right, the screen will navigate to Home
        <GestureRecognizer
            onSwipe={(direction, state) => {
                const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
                if (direction == SWIPE_RIGHT) {
                    this.props.navigation.navigate('Home');
                } 
            }}
            config={config}
            style={{
                flex: 1,
            }}
        >
        <View>
            <View style={styles.container}>
            <Text>You currently have ${this.state.money}</Text>
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
                    title="Water (Cost 1 coin)"
                    onPress={() => {
                        if (this.state.money >= 1) {
                            Alert.alert("You just watered your plants! 10 points added.");
                            this.progressAdded(1);
                        } else {
                            Alert.alert("Oops! You don't have enough money right now.\
                            Try again after more tasks are completed");
                        }}
                    }/>
                <Button
                    title="Fertilize (Cost 2 coins)"
                    onPress={() => {
                        if (this.state.money >= 2) {
                            Alert.alert("You just fertilized your plants! 20 points added.");
                            this.progressAdded(2);
                        } else {
                            Alert.alert("Oops! You don't have enough money right now.\
                            Try again after more tasks are completed");
                        }}
                    }/>
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
         </GestureRecognizer>
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

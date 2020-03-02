import * as React from 'react';
// TODO: remove Alert when we don't need it anymore
import { StyleSheet, View, Text, Button, Image, Alert, Animated} from 'react-native';

export default class Testing extends React.Component {
    constructor(props) {
        super(props)
        this.transitionEnd = this.transitionEnd.bind(this)
        this.mountStyle = this.mountStyle.bind(this)
        this.unMountStyle = this.unMountStyle.bind(this)
        this._start = this._start.bind(this)
        this.state ={ //base css
          show: true,
          fadeValue: new Animated.Value(1),
        };
    };

    _start () {
        console.log("called start");
        Animated.timing(this.state.fadeValue, {
          toValue: 0,
          duration: 1000
        }).start();
    };

    componentDidUpdate(newProps) { // check for the mounted props
        if(!newProps.mounted){
            this._start();// call outro animation when mounted prop is false
        } else {
            // this.setState({ // remount the node when the mounted prop is true
            //     show: true
            // })
            // setTimeout(this.mountStyle, 10) // call the into animation
        }
    };
    
    unMountStyle() { // css for unmount animation
        // this.setState({
        //     style: {
        //     fontSize: 60,
        //     opacity: 0,
        //     transition: 'all 1s ease',
        //     }
        // })
        console.log("bad");
        Animated.timing(this.state.fadeValue, {
            toValue: 1,
            duration: 5
          }).start();
        //  this.setState({
        //     style: {
        //     fontSize: 60,
        //     opacity: 0,
        //     transition: 'all 1s ease',
        //     }
        // })
    }
    
    mountStyle() { // css for mount animation
        this.setState({
            style: {
            fontSize: 60,
            opacity: 1,
            transition: 'all 1s ease',
            }
        })
    }
    
    componentDidMount(){
        setTimeout(this.mountStyle, 5) // call the into animation
    }
    
    transitionEnd(){
        if(!this.props.mounted){ // remove the node on transition end when the mounted prop is false
            this.setState({
                show: false
            })
        }
    }
    
    render() {
        if (this.state.show){
            return(
            <Animated.View style={{
                opacity: this.state.fadeValue,
                margin: 5,
                borderRadius: 12,
                backgroundColor: "#347a2a",
                justifyContent: "center",
              }} onTransitionEnd={this.transitionEnd}><Text>Hello</Text></Animated.View>);
            }
    }
}
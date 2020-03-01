// import  React, {useState} from 'react';

// import DateTimePicker from '@react-native-community/datetimepicker';



    
//     render() {
        
//         return (
//             <View>
            
//             

//             <View>
//                 <DateTimePicker
//                     testID="dateTimePicker"
//                     timeZoneOffsetInMinutes={0}
//                     value={'test'}
//                     mode={'date'}
//                     is24Hour={true}
//                     display="default"
//                     // onChange={onChange}
//                 />
//             </View>
//                 {/* name: PropTypes.string.isRequired,
//                 dueDate: PropTypes.instanceOf(Date).isRequired,
//                 priority: PropTypes.oneOf(['low', 'medium', 'high']),
//                 hoursLeft: PropTypes.number */}
           
//             </View>
//         )
       
//     }
// };



import React, {useState} from 'react';
import{ Component } from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet, 
    Alert, TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// export default class CreateTaskScreen extends React.Component {
const CreateTaskScreen = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <View>
        <TextInput
                style={styles.input}
                onChangeText={text => onChangeText(text)}
                placeholder="name"
            />

            <TextInput
                style={styles.input}
                onChangeText={text => onChangeText(text)}
                placeholder="Estimate hours needed"
            />

            <Text>Due Date</Text>
            <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={date}
            is24Hour={true}
            display="default"
            onChange={onChange}
            />

            <Button
                onPress={()=> Alert.alert("Submitted!")}
                title='Submit'/> 
    </View>
  );
};

export default CreateTaskScreen;

const styles = StyleSheet.create({
    input: {
        paddingLeft: 10,
        margin: 10,
        height: 50,
        borderColor: '#0E88E5',
        borderWidth: 4
     },
});
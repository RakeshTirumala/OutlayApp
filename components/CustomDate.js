import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal} from "react-native";
import { darkColor1, secondaryColor, whiteSmoke } from "../constants";
import DatePicker from "react-native-modern-datepicker";

export default function CustomDate(){
    const initialDate = new Date().toLocaleDateString('en-US', { day: 'numeric' }); 
    const [selectedDate, setSelectedDate] = useState(initialDate)
    const [visibilityOfModal, setVisibilityOfModal] = useState(false)
    const handleVisibility=()=>{
        setVisibilityOfModal(!visibilityOfModal)
    }
    const handleDateChange=(date)=>{
        console.log(date)
        date = date.split("/")[2]
        setSelectedDate(date)
    }

    return(
        <TouchableOpacity style={styles.dateBtn} onPress={handleVisibility}>
            <Text style={styles.dateTxt}>{selectedDate}</Text>
            <Modal
            animationType='fade'
            transparent={true}
            visible={visibilityOfModal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DatePicker
                        mode="calendar"
                        selected={selectedDate}
                        onDateChange={(date)=>handleDateChange(date)}
                        options={{
                            backgroundColor: "#080516",
                            textHeaderColor: secondaryColor,
                            textDefaultColor: whiteSmoke,
                            selectedTextColor: 'black',
                            mainColor: secondaryColor,
                            textSecondaryColor: "#FFFFFF",
                            borderColor: "rgba(122, 146, 165, 0.1)",
                        }}
                        />
                        <TouchableOpacity onPress={handleVisibility}>
                            <Text 
                            style={{ color: "white",
                             fontSize:14,
                             fontWeight:"bold"}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    dateBtn:{
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor:'white',
        borderColor:darkColor1,
        borderWidth:1.5,
        elevation:10, 
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor:darkColor1,
        shadowColor: darkColor1 , // Add shadow color (iOS only)
        shadowOffset: { width: 0, height: 2 }, // Add shadow offset (iOS only)
        shadowOpacity: 0.3, // Add shadow opacity (iOS only)
        margin:10,
    },
    dateTxt:{
        fontSize:18,
        fontWeight:'bold',
        color:'black'
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      modalView: {
        margin: 20,
        backgroundColor: "#080516",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        padding: 35,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
})
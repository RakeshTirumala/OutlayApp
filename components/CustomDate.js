import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal} from "react-native";
import { darkColor1, secondaryColor, whiteSmoke } from "../constants";
import DatePicker from "react-native-modern-datepicker";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CustomDate(){
    // const initialDate = new Date().toLocaleDateString('en-US', { day: 'numeric' }); 
    const dateTostoreInDb = new Date().toLocaleDateString('en-US')
    console.log("initialdate:", dateTostoreInDb)
    const [bgThemeColor, setBGThemeColor] = useState(styles.lightBGColor);
    const [fontThemeColor, setFontThemeColor] = useState(styles.lightThemeFontColor);
    // setDateToLocalDB(dateTostoreInDb, 'initialDate');
    // const [selectedDate, setSelectedDate] = useState(initialDate)
    // const [visibilityOfModal, setVisibilityOfModal] = useState(false)

    // const handleVisibility=()=>{
    //     setVisibilityOfModal(!visibilityOfModal)
    // }
    
    // const handleDateChange=(date)=>{
    //     console.log("Selected date:",date)
    //     let temp = date
    //     temp = temp.split("/")[2]
    //     setSelectedDate(temp)
    //     // setDateToLocalDB(date, 'selectedDate');
    // }
    async function setTheme(){
        const t = await AsyncStorage.getItem('theme')
        setBGThemeColor((t==='true')?styles.darkBGColor:styles.lightBGColor)
        setFontThemeColor((t==='true')?styles.darkThemeFontColor:styles.lightThemeFontColor)
    }

    setTheme()

    return(
        <TouchableOpacity style={[styles.dateBtn, bgThemeColor]}>
            <Text style={[styles.dateTxt, fontThemeColor]}>{dateTostoreInDb}</Text>
            <Ionicons name="calendar-outline" size={24} style={[fontThemeColor]} />
            {/* <Modal
            animationType='slide'
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
            </Modal> */}
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    dateBtn:{
        width: 150,
        height: 50,
        borderRadius: 5,
        backgroundColor:'white',
        elevation:3, 
        justifyContent: 'center',
        alignItems: 'center',
        // shadowColor:darkColor1,
        // shadowColor: darkColor1 , // Add shadow color (iOS only)
        // shadowOffset: { width: 0, height: 2 }, // Add shadow offset (iOS only)
        // shadowOpacity: 0.3, // Add shadow opacity (iOS only)
        margin:10,
        flexDirection:'row',
        gap:10
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
    darkBGColor:{
        backgroundColor:'#36393e'
    },
    lightBGColor:{
        backgroundColor:'#FFFFFF'
    },
    darkThemeFontColor:{
        color:'white',
    },
    lightThemeFontColor:{
        color:'black'
    },
})
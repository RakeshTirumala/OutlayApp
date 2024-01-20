import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActionSheetIOS} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dataSyncParah, dummyEmail, primaryColor, secondaryColor } from "../constants";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function PreferencesScreen(){
    const [isEnabled, setIsEnabled] = useState(false);
    const [theme, setTheme] = useState('Light Theme');
    const [currentMO, setCurrentMO] = useState('Month')
    const [dataSync, setDataSync] = useState("Don't sync")
    const [dataSyncEnabled, setDataSyncEnabled] = useState(false)
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const getDataFromLocal=async()=>{
        const email = await AsyncStorage.getItem('userEmail');
        const theme = await AsyncStorage.getItem('theme');
        const mo = await AsyncStorage.getItem('mo');
        setEmail(email);
        setIsEnabled((theme==="true")?true:false);
        setTheme((theme==="true")?'Dark Theme':'Light Theme')
        setCurrentMO(mo);
    }
    getDataFromLocal()

    const toggleSwitch = () => {
        setIsEnabled((previousState) => !previousState);
        setTheme((previousTheme) => (previousTheme === 'Light Theme' ? 'Dark Theme' : 'Light Theme'));
    };
    

    // const dataToggleSwitch=()=>{
    //     setDataSyncEnabled(previousState => !previousState)
    //     if(!dataSyncEnabled) setDataSync('Sync!')
    //     else setDataSync("Don't sync")
    //  }


    const handleLogout=async()=>{
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userEmail');
        navigation.navigate('Login');
    }
    return(
        <View style={styles.preferenceScreen}>
            <View style={styles.preferencesTitle}>
                <View style={{flexDirection:'row', gap:5}}>
                    <Text style={{fontSize:20}}>Preferences</Text>
                    <MaterialCommunityIcons name="account-cog-outline" size={24} color="black" style={{paddingTop:2}}/>
                </View>
            </View>
            <View style={styles.preferencesView}>
                {/* Email ID View */}
                <View style={styles.preferenceIDView}>
                    <View style={{flexDirection:'row', gap:5, paddingLeft:20,}}>
                        <Text style={styles.preferenceScreenTxtStyle}>Email ID:</Text>
                        <Text style={styles.preferenceScreenTxtStyle}>{email}</Text>
                    </View>
                </View>
                {/* Theme view */}
                <View style={styles.themeView}>
                    <View style={{flexDirection:'row',paddingLeft:20}}>
                        <Text style={styles.preferenceScreenTxtStyle2}>{theme}</Text>
                        <Switch
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        trackColor={{true:primaryColor}}
                        thumbColor={isEnabled?'lightgrey':'lightgrey'}
                        style={{width:230,transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                        />
                    </View>
                </View>
                {/* Month and Overall View  */}
                <View style={styles.monthOverallView}>
                    <View style={{flexDirection:'column', paddingLeft:20}}>
                        <Text style={styles.preferenceScreenTxtStyle}>Month/Overall</Text>
                        <View style={{marginTop:5}}>
                            <RadioButtonGroup
                            containerStyle={{ marginBottom: 20}}
                            selected={currentMO}
                            onSelected={(value) => setCurrentMO(value)}
                            radioBackground={secondaryColor}
                            >
                                <RadioButtonItem value="Month" label=" Month" style={styles.radioButton}/>
                                <RadioButtonItem value="Overall" label=" Overall" style={styles.radioButton}/>
                            </RadioButtonGroup>
                        </View>
                    </View>
                </View>
                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutView}>
                    <Text style={{paddingLeft:20, color:'grey', fontSize:16}} onPress={handleLogout}>Logout</Text>
                </TouchableOpacity>
                {/* Data Controls */}
                {/* <View style={styles.dataControlsView}>
                    <View style={{flexDirection:'row',paddingLeft:20}}>
                        <Text style={styles.preferenceScreenTxtStyle2}>{dataSync}</Text>
                        <Switch
                        onValueChange={dataToggleSwitch}
                        value={dataSyncEnabled}
                        trackColor={{true:primaryColor}}
                        thumbColor={dataSyncEnabled?'lightgrey':'lightgrey'}
                        style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                        />
                    </View>
                    <Text 
                    style={{color:'grey', 
                    textAlign:'justify', lineHeight:16, 
                    marginLeft:20, marginRight:5, 
                    marginBottom:20}}>{dataSyncParah}</Text>
                </View> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    preferenceScreen:{
        flex:1,
        backgroundColor:'white'
    },
    preferencesTitle:{
        backgroundColor:'white',
        height:50,
        justifyContent:"center",
        paddingLeft:25,
        borderBottomColor:'black',
        borderWidth:0.5,
        alignContent:'flex-start',
        alignItems:'flex-start',
        textAlign:'right'
    },
    preferencesView:{
        flex:1,
        backgroundColor:"white"
    },
    preferenceIDView:{
        backgroundColor:'white',
        gap:5,
        margin:5,
        borderRadius:5,
        height:50,
        justifyContent:"center",
        elevation:5
    },
    preferenceScreenTxtStyle:{
        color:'grey',
        fontSize:16,
    },
    preferenceScreenTxtStyle2:{
        color:'grey',
        fontSize:16,
        paddingTop:12.5
    },
    themeView:{
        backgroundColor:'white',
        gap:5,
        margin:5,
        borderRadius:5,
        height:50,
        justifyContent:"center",
        elevation:5
    },
    monthOverallView:{
        backgroundColor:'white',
        gap:5,
        margin:5,
        borderRadius:5,
        justifyContent:"center",
        elevation:5
    },
    radioButton:{
        marginVertical:4,
        transform:[{ scaleX: 0.8 }, { scaleY: 0.8 }]
    },
    dataControlsView:{
        backgroundColor:'white',
        gap:5,
        margin:5,
        borderRadius:5,
        justifyContent:"center",
        elevation:5
    },
    logoutView:{
        backgroundColor:'white',
        gap:5,
        margin:5,
        borderRadius:5,
        height:50,
        justifyContent:"center",
        elevation:5
    }
})
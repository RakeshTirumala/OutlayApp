import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActionSheetIOS} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkThemeBGColor, dataSyncParah, dummyEmail, lightThemeBGColor, primaryColor, secondaryColor } from "../constants";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function PreferencesScreen(){
    const [isEnabled, setIsEnabled] = useState(false);
    const [theme, setTheme] = useState('Light Theme');
    const [currentMO, setCurrentMO] = useState('')
    // const [dataSync, setDataSync] = useState("Don't sync")
    // const [dataSyncEnabled, setDataSyncEnabled] = useState(false)
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [bgThemeColor, setBGThemeColor] = useState(styles.lightBGColor);
    const [fontThemeColor, setFontThemeColor] = useState(styles.lightThemeFontColor);

    //FETCHING & SETTING EMAIL 
    const getnSetEmailFromLocal=async()=>{
        let emailid = await AsyncStorage.getItem('userEmail')
        setEmail(emailid);
    }
    //FETCHING & SETTING THEME
    const getnSetThemeFromLocal=async()=>{
        let t = await AsyncStorage.getItem('theme')
        setTheme(t==="true"?'Dark Theme':'Light Theme');
        setIsEnabled((t==="true")?true:false);
    }
    //FETCHING & SETTING MO
    const getnSetMOFromLocal=async()=>{
        let mo = await AsyncStorage.getItem('mo');
        setCurrentMO(mo);
    }
    //FETCHING AND SETTING BG THEME
    const setBGTheme=async()=>{
        const t = await AsyncStorage.getItem('theme')
        setBGThemeColor((t==='true')?styles.darkBGColor:styles.lightBGColor)
        setFontThemeColor((t==='true')?styles.darkThemeFontColor:styles.lightThemeFontColor)

    }

    //ToggleHandling
    const toggleSwitch = async() => {
        await AsyncStorage.setItem('theme', `${!isEnabled}`)
        const token = await AsyncStorage.getItem('token');
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_THEME_URL_GOOGLE, {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json', 
                    'authorization': `Bearer ${token}`},
                body:JSON.stringify({email:email,theme:!isEnabled})
            })
            if(response.ok){
                Toast.show({
                    'type':'success',
                    'text1':'Success!'
                })
                getnSetThemeFromLocal()
                setBGTheme()
            }
        }catch(error){
            console.log('Error', error);
            Toast.show({
                type:'error',
                text1:'Try again!'
            })
        }

    };
    
    //RadioButtonHandling
    const setMOHandling=async(mo)=>{
        await AsyncStorage.setItem('mo', mo)
        const token = await AsyncStorage.getItem('token');
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_MO_URL_GOOGLE, {
                method:'PUT',
                headers:{
                    'Content-Type':'application/json', 
                    'authorization': `Bearer ${token}`
                },
                body:JSON.stringify({email:email, mo:mo})
            })

            if(response.ok){
                Toast.show({
                    'type':'success',
                    'text1':'Success!'
                })
                getnSetMOFromLocal()
            }

        }catch(error){
            console.log(error)
            Toast.show({
                type:'error',
                text1:'Try Again!'
            })
        }
    }

    // const dataToggleSwitch=()=>{
    //     setDataSyncEnabled(previousState => !previousState)
    //     if(!dataSyncEnabled) setDataSync('Sync!')
    //     else setDataSync("Don't sync")
    //  }

    //HANDLING LOGOUT
    const handleLogout=async()=>{
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userEmail');
        navigation.navigate('Login');
    }
    setBGTheme();

    useEffect(()=>{
        getnSetEmailFromLocal();
        getnSetThemeFromLocal();  
        getnSetMOFromLocal();  
    })

    return(
        <View style={[styles.preferenceScreen, bgThemeColor]}>
            <View style={[styles.preferencesTitle, bgThemeColor]}>
                <View style={{flexDirection:'row', gap:5}}>
                    <Text style={[styles.titleFont, fontThemeColor]}>Preferences</Text>
                    <MaterialCommunityIcons name="account-cog-outline" size={24} style={[fontThemeColor, styles.iconStyle]}/>
                </View>
            </View>
            <View style={[styles.preferenceView, bgThemeColor]}>
                {/* Email ID View */}
                <View style={[styles.preferenceIDView, bgThemeColor]}>
                    <View style={{flexDirection:'row', gap:5, paddingLeft:10,}}>
                        <Text style={[styles.preferenceScreenTxtStyle, fontThemeColor]}>Email ID:</Text>
                        <Text style={[styles.preferenceScreenTxtStyle, fontThemeColor]}>{email}</Text>
                    </View>
                </View>
                {/* Theme view */}
                <View style={[styles.themeView, bgThemeColor]}>
                    <View style={{flexDirection:'row',paddingLeft:10}}>
                        <Text style={[styles.preferenceScreenTxtStyle2, fontThemeColor]}>{theme}</Text>
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
                <View style={[styles.monthOverallView, bgThemeColor]}>
                    <View style={{flexDirection:'column', paddingLeft:10}}>
                        <Text style={[styles.preferenceScreenTxtStyle, fontThemeColor]}>Month/Overall</Text>
                        <View style={{marginTop:5, marginLeft:10}}>
                            <RadioButtonGroup
                            containerStyle={{ marginBottom: 20}}
                            selected={currentMO}
                            onSelected={(value) => setMOHandling(value)}
                            radioBackground={secondaryColor}
                            >
                                <RadioButtonItem 
                                value="Month" 
                                label={<Text style={fontThemeColor}>Month</Text>}
                                style={styles.radioButton}/>
                                <RadioButtonItem 
                                value="Overall" 
                                label={<Text style={fontThemeColor}>Overall</Text>}
                                style={styles.radioButton}/>
                            </RadioButtonGroup>
                        </View>
                    </View>
                </View>
                {/* Logout Button */}
                <TouchableOpacity style={[styles.logoutView, bgThemeColor]} onPress={handleLogout}>
                    <Text style={[styles.logoutBtn, fontThemeColor]}>Logout</Text>
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
    logoutBtn:{
        color:'grey', 
        fontSize:16
    },
    iconStyle:{
        paddingTop:2
    },
    titleFont:{
        fontSize:20
    },
    preferenceScreen:{
        flex:1
    },
    preferencesTitle:{
        backgroundColor:'white',
        height:50,
        justifyContent:"center",
        paddingLeft:25,
        alignContent:'flex-start',
        alignItems:'flex-start',
        textAlign:'right',
        elevation:3
    },
    preferenceView:{
        flex:1,
        elevation:3
    },
    preferenceIDView:{
        backgroundColor:'white',
        gap:5,
        height:50,
        justifyContent:"center",
        elevation:3,
        margin:2
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
        margin:2,
        height:50,
        justifyContent:"center",
        elevation:3
    },
    monthOverallView:{
        backgroundColor:'white',
        gap:5,
        margin:2,
        justifyContent:"center",
        elevation:3,
        paddingTop:8
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
        margin:2,
        height:50,
        justifyContent:"center",
        elevation:3,
        borderRadius:5,
        alignItems:'center'
    },
    darkBGColor:{
        backgroundColor:'#36393e'
    },
    lightBGColor:{
        backgroundColor:'#FFFFFF'
    },
    darkThemeFontColor:{
        color:'white'
    },
    lightThemeFontColor:{
        color:'black'
    }
})
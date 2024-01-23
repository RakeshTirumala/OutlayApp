import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import CustomDate from "../components/CustomDate";
import { darkColor1, darkColor4, primaryColor, secondaryColor, whiteSmoke } from "../constants";
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

export default function AddScreen(){
    const [expense, setExpense] = useState('');
    const [category, setCategory] = useState('');
    const navigation = useNavigation();
    const dateTostoreInDb = new Date().toLocaleDateString('en-US') 
    const [bgThemeColor, setBGThemeColor] = useState(styles.lightBGColor);
    const [fontThemeColor, setFontThemeColor] = useState(styles.lightThemeFontColor);

    //FETCHING AND SETTING BG THEME
    const setTheme=async()=>{
        const t = await AsyncStorage.getItem('theme')
        setBGThemeColor((t==='true')?styles.darkBGColor:styles.lightBGColor)
        setFontThemeColor((t==='true')?styles.darkThemeFontColor:styles.lightThemeFontColor)
    }
    useEffect(()=>{
        const themePollingInterval = setInterval(setTheme, 1);
        return () => {
            clearInterval(themePollingInterval);
        };
    })
    // setTheme()


    const handleSync=async()=>{
        console.log("Expense:", expense, "Category:", category, "Date:", dateTostoreInDb)
        const token = await AsyncStorage.getItem('token');
        const email = await AsyncStorage.getItem('userEmail');
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_EXPENSE_URL_GOOGLE, {
                method:'POST',
                headers:{
                'Content-Type':'application/json', 
                'authorization': `Bearer ${token}`
                },
                body:JSON.stringify({
                    email:email,
                    date:dateTostoreInDb,
                    expense:expense,
                    category:category
                })
            })
            const statusCode = response.status;
            console.log(statusCode)
            switch(statusCode){
                case 201:
                    // await ToastAndroid.show('Expense Added!', ToastAndroid.BOTTOM);
                    Toast.show({
                        type:'success',
                        text1:'Expense Added!'
                    })
                    break;
                case 401:
                    // await ToastAndroid.show('Null!', ToastAndroid.BOTTOM)
                    Toast.show({
                        type:'info',
                        text1:'Null!'
                    });
                    break;
                case 403:
                    // await ToastAndroid.show('Invalid Authorization', ToastAndroid.BOTTOM);
                    Toast.show({
                        type:'error',
                        text1:'Invalid Authorization'
                    })
                    break;
                case 500:
                    // await ToastAndroid.show('Internal Error!', ToastAndroid.BOTTOM)
                    Toast.show({
                        type:'error',
                        text1:'Internal Error!'
                    })
                    break;
                default:
                    console.log("ISSUE:, The Respone:\n", response)
            }
        }catch(error){
            // await ToastAndroid.show('Failed!', ToastAndroid.BOTTOM)
            Toast.show({
                type:'error',
                text1:'Failed!'
            })
            console.log(error)
        }
        setCategory('')
        setExpense('')
    }
    const handleCancel=()=>{
        setCategory('')
        setExpense('')
        navigation.navigate("Outlay")
    }
    
    return(
        <View style={[styles.addscreen, bgThemeColor]}>
            <View style={[styles.dateComponentViewHolder, bgThemeColor]}>
                <CustomDate/>
            </View>
            <View style={[styles.expenseComp, bgThemeColor]}>
                <View style={[styles.expenseHeader, bgThemeColor]}>
                    <Text style={[styles.expenseHeaderTxt, fontThemeColor]}>Add Expense</Text>
                    <MaterialIcons name="payment" size={24} color="black" style={[styles.iconStyle, fontThemeColor]}/>
                </View>
                <View style={[styles.inputView, bgThemeColor]}>
                    <View style={[styles.expenseView, bgThemeColor]}>
                        <View style={[styles.iconHolder, bgThemeColor]}>
                            <Foundation name="dollar" size={34} style={[fontThemeColor]}/>
                        </View>
                        <TextInput 
                            style={[styles.Input, bgThemeColor,fontThemeColor,{borderBottomColor:'lightgrey'}]}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor={(fontThemeColor.color==='white')?'white':'grey'}
                            selectionColor="grey"
                            activeUnderlineColor={(fontThemeColor.color==='white')?'white':'black'}
                            value={expense}
                            onChangeText={exp=>setExpense(exp)}
                            cursorColor={fontThemeColor}
                        />
                    </View>
                </View>
                <View style={[styles.inputView, bgThemeColor]}>
                    <View style={[styles.categoryView, bgThemeColor]}>
                        <View style={[styles.iconHolderCategory, bgThemeColor]}>
                            <MaterialIcons name="category" size={32} style={[fontThemeColor]} />
                        </View>
                        <TextInput 
                            style={[styles.Input, bgThemeColor,fontThemeColor,{ borderBottomColor:'lightgrey'}]}
                            placeholder="Enter a category"
                            placeholderTextColor={(fontThemeColor.color==='white')?'white':'grey'}
                            cursorColor={fontThemeColor}
                            selectionColor="grey"
                            activeUnderlineColor={(fontThemeColor.color==='white')?'white':'black'}
                            value={category}
                            onChangeText={cat=>setCategory(cat)}
                        />
                    </View>
                </View>
                <View style={styles.btnsView}>
                    <TouchableOpacity style={[styles.syncBtn, bgThemeColor]} onPress={handleSync}>
                        <Text style={[fontThemeColor, {fontSize:16}]}>Sync</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cancelBtn, bgThemeColor]} onPress={handleCancel}>
                        <Text style={[fontThemeColor, {fontSize:16}]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconStyle:{
        marginTop:5
    },
    addscreen:{
        flex: 1,
        backgroundColor: 'white',
    },
    dateComponentViewHolder:{
        flexDirection:'row-reverse',
    },
    expenseComp:{
        backgroundColor:'white',
        borderRadius:10,
        margin:10,
        elevation:3,
        minHeight:500
    },
    expenseHeader:{
        marginLeft:35,
        marginRight:35,
        marginTop:25,
        borderRightColor:'transparent',
        borderLeftColor:'transparent',
        borderTopColor:'transparent',
        flexDirection:'row',
        gap:5
    },
    expenseHeaderTxt:{
        fontSize:22,
    },
    inputView:{
        marginTop:25
    },
    expenseView:{
        marginStart:35,
        marginEnd:35,
        flexDirection:'row',
        marginTop:20,
        borderRadius:5,
        width:250,
        height:45,
        gap:5
    },
    categoryView:{
        marginStart:35,
        marginEnd:35,
        flexDirection:'row',
        marginTop:20,
        borderRadius:5,
        width:250,
        height:45,
        gap:5
    }
    ,
    iconHolder:{
        backgroundColor:'white',
        width:50,
        paddingLeft:18,
        paddingTop:5,
        borderRadius:5,
        elevation:3
    },
    iconHolderCategory:{
        backgroundColor:'white',
        width:50,
        paddingLeft:9,
        paddingTop:5,
        borderRadius:5,
        elevation:3
    },
    Input:{
        minWidth:245,
        fontSize:18,
        borderBottomWidth:0.5,
    },
    syncBtn:{
        backgroundColor:'white',
        height:50,
        width:250,
        justifyContent:'center',
        alignItems:"center",
        borderRadius:50,
        elevation:3,
    },
    cancelBtn:{
        backgroundColor:'black',
        height:50,
        width:250,
        justifyContent:'center',
        alignItems:"center",
        borderRadius:50,
        elevation:3,
        marginTop:10
    },
    btnsView:{
        justifyContent:"center",
        alignItems:"center",
        margin:80
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
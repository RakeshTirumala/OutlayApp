import React, {useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { decode, encode } from 'base-64';
import Toast from 'react-native-toast-message';

async function checkLoggedInUser(navigation){
    const token = await AsyncStorage.getItem('token');   
    if(token!==null){
        console.log("Token:", token)
        console.log("Checking token expiry date")
        if (!global.btoa) global.btoa = encode;
        if (!global.atob) global.atob = decode;
        const decodeToken = jwtDecode(token);
        console.log("decoded Token:", decodeToken)
        if (decodeToken.exp * 1000 >= Date.now()) navigation.navigate('Main');
    }else navigation.navigate('Login')
}

export default function LoginScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    checkLoggedInUser(navigation);

    const storeUserDataToLocalDB=async(token, theme, mo)=>{
        try{
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('theme', theme.toString());
            await AsyncStorage.setItem('mo', mo);
            console.log("Saved data!");
        }catch(error){
            console.log("Error saving the data:", error);
        }
    }


    const handleLogin=async()=>{
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_LOGIN_URL_GOOGLE, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    email:email,
                    password:password
                })
            })
            const statusCode = response.status 
            const data = await response.json()
            switch(statusCode){
                case 201:
                    storeUserDataToLocalDB(data.token, data.theme, data.mo)
                    // await ToastAndroid.show('Login Success!', ToastAndroid.BOTTOM);
                    Toast.show({
                        type:'success',
                        text1:'Success!',
                        text2:'Successfully logged in!'
                    })
                    console.log(data.token)
                    navigation.navigate('Main');
                    break;
                case 401:
                    // await ToastAndroid.show('Invalid email or password!', ToastAndroid.BOTTOM);
                    Toast.show({
                        type:'info',
                        text1:'Invalid!',
                        text2:'Invalid email or password'
                    })
                    break;
                case 500:
                    // await ToastAndroid.show('Internal Error!', ToastAndroid.BOTTOM)
                    Toast.show({
                        type:'error',
                        text1:'Error!',
                        text2:'Internal Issue, Try again!'
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
        }
    }

    const handleSignUp=()=>{
        navigation.navigate('Signin')
    }
    return(
        <View style={styles.loginScreen}>
            <View style={styles.loginComponent}>
                <View style={{flexDirection:'row', paddingBottom:20}}>
                    <Text style={styles.loginTxtStyle}>Log In</Text>
                    <MaterialIcons name="login" size={24} color="black" style={{marginTop:5, marginLeft:5}}/>
                </View>
                {/* Email View */}
                <View style={styles.inputView}>
                    <View style={styles.emailView}>
                        <View style={styles.iconHolder}>
                            <Entypo name="email" size={24} color="black" />
                        </View>
                        <TextInput 
                        style={styles.Input}
                        placeholder="Email ID"
                        cursorColor="black"
                        selectionColor="grey"
                        activeUnderlineColor="black"
                        keyboardType="email-address"
                        textContentType='emailAddress'
                        autoCapitalize="none"
                        autoComplete="email"
                        value={email}
                        onChangeText={em=>setEmail(em)}
                        />
                    </View>
                </View>
                {/* Password View */}
                <View style={styles.inputView}>
                    <View style={styles.passwordView}>
                        <View style={styles.iconHolder}>
                            <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" />
                        </View>
                        <TextInput 
                        style={styles.Input}
                        placeholder="password"
                        cursorColor="black"
                        selectionColor="grey"
                        activeUnderlineColor="black"
                        value={password}
                        onChangeText={psd=>setPassword(psd)}
                        secureTextEntry={true}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={{color:'white', fontSize:16}}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignUp}>
                    <Text>No Account? <Text style={{textDecorationLine:'underline'}}>Sign Up!</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    )
} 

const styles = StyleSheet.create({
    loginScreen:{
        flex:1,
        backgroundColor:'white',
        justifyContent:"center",
    },
    loginTxtStyle:{
        fontSize:24,
        fontWeight:'bold',
    },
    loginComponent:{
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'white',
        margin:10

    },
    inputView:{
        marginTop:20
    },
    emailView:{
        marginStart:35,
        marginEnd:35,
        flexDirection:'row',
        marginTop:10,
        borderRadius:5,
        width:280,
        height:45,
        gap:5
    },
    passwordView:{
        marginStart:35,
        marginEnd:35,
        flexDirection:'row',
        marginTop:10,
        borderRadius:5,
        width:280,
        height:45,
        gap:5
    },
    iconHolder:{
        backgroundColor:'white',
        padding:10,
        borderRadius:5,
        borderWidth:0.5
    },
    Input:{
        backgroundColor:'transparent',
        minWidth:230,
        fontSize:16,
        borderColor:'black',
        borderBottomWidth:1
    },
    loginBtn:{
        backgroundColor:'black',
        width:280,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        marginTop:50,
        marginLeft:50,
        marginRight:50,
        marginBottom:10,
        elevation:3
    }
})
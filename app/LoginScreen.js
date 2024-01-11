import React, {useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { darkColor1, primaryColor } from "../constants";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();


    const handleLogin=async()=>{
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_LOGIN_URL, {
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
                    await ToastAndroid.show('Login Success!', ToastAndroid.BOTTOM);
                    console.log(data.token)
                    navigation.navigate('Main');
                    break;
                case 401:
                    await ToastAndroid.show('Invalid email or password!', ToastAndroid.BOTTOM);
                    break;
                case 500:
                    await ToastAndroid.show('Internal Error!', ToastAndroid.BOTTOM)
                    break;
                default:
                    console.log("ISSUE:, The Respone:\n", response)
            }
        }catch(error){
            await ToastAndroid.show('Failed!', ToastAndroid.BOTTOM)
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
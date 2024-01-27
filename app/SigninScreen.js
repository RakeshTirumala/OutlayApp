import React, {useState} from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";

export default function SigninScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleSignin=async()=>{
        if (password.trim() === '' || confirmPassword.trim() === '') {
            Toast.show({ type: 'error', text1: "Password fields can't be empty" });
            return;
        }
        if(password!==confirmPassword){
            Toast.show({type:'error', text1:"Passwords don't match"});
            setConfirmPassword('');
            setPassword('');
            return;
        }
        try{
            const response = await fetch(process.env.EXPO_PUBLIC_SIGNIN_URL_GOOGLE, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })
            const statusCode = response.status 
            switch(statusCode){
                case 201:
                    // await ToastAndroid.show('Account Created!', ToastAndroid.BOTTOM);
                    Toast.show({
                        type:'success',
                        text1:'Account Created!'
                    })
                    navigation.navigate('Login')
                    break;
                case 400:
                    // await ToastAndroid.show('Account already exists!', ToastAndroid.BOTTOM);
                    Toast.show({
                        type:'info',
                        text1:'Account already exists!'
                    })
                    navigation.navigate('Login')
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
        }catch{
            // await ToastAndroid.show('Failed!', ToastAndroid.BOTTOM)
            Toast.show({
                type:'error',
                text1:'Failed!'
            })
        }
    }
    const handleLogin=()=>{
        navigation.navigate('Login')
    }
    return(
        <View style={styles.signinScreen}>
            <View style={styles.signinComponent}>
                <View style={{flexDirection:'row', paddingBottom:20}}>
                    <Text style={styles.signinTxtStyle}>Sign Up</Text>
                    <MaterialCommunityIcons 
                    name="account-plus-outline" 
                    size={24} color="black" 
                    style={{marginTop:5, marginLeft:5}}/>
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
                        placeholder="Password"
                        cursorColor="black"
                        selectionColor="grey"
                        activeUnderlineColor="black"
                        value={password}
                        onChangeText={psd=>setPassword(psd)}
                        secureTextEntry={true}
                        />
                    </View>
                </View>
                {/* Confirm Password */}
                <View style={styles.inputView}>
                    <View style={styles.passwordView}>
                        <View style={styles.iconHolder}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="black" />
                        </View>
                        <TextInput 
                        style={styles.Input}
                        placeholder="Confirm password"
                        cursorColor="black"
                        selectionColor="grey"
                        activeUnderlineColor="black"
                        value={confirmPassword}
                        onChangeText={cpsd=>setConfirmPassword(cpsd)}
                        secureTextEntry={true}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.signinBtn} onPress={handleSignin}>
                    <Text style={{color:'white', fontSize:16}}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogin}>
                    <Text>Have an Account? <Text style={{textDecorationLine:'underline'}}>Log In!</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    signinScreen:{
        flex:1,
        backgroundColor:'white',
        justifyContent:"center",
    },
    signinTxtStyle:{
        fontSize:24,
        fontWeight:'bold',
    },
    signinComponent:{
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
    signinBtn:{
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
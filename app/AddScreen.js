import React, {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CustomDate from "../components/CustomDate";
import { darkColor1, darkColor4, primaryColor, secondaryColor, whiteSmoke } from "../constants";
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AddScreen(){
    const [expense, setExpense] = useState('');
    const [category, setCategory] = useState('');
    const navigation = useNavigation();

    const handleSync=()=>{
        console.log("Expense:", expense, "Category:", category)
    }
    const handleCancel=()=>{
        setCategory('')
        setExpense('')
        navigation.navigate("Outlay")
    }
    
    return(
        <View style={styles.addscreen}>
            <View style={styles.dateComponentViewHolder}>
                <CustomDate/>
            </View>
            <View style={styles.expenseComp}>
                <View style={styles.expenseHeader}>
                    <Text style={styles.expenseHeaderTxt}>Add Expense</Text>
                </View>
                <View style={styles.inputView}>
                    <View style={styles.expenseView}>
                        <View style={styles.iconHolder}>
                            <Foundation name="dollar" size={42} color="black" />
                        </View>
                        <TextInput 
                        style={styles.Input}
                        keyboardType="numeric"
                        placeholder="0.00"
                        cursorColor="black"
                        selectionColor="grey"
                        activeUnderlineColor="black"
                        value={expense}
                        onChangeText={exp=>setExpense(exp)}
                        />
                    </View>
                </View>
                <View style={styles.inputView}>
                    <View style={styles.categoryView}>
                        <View style={styles.iconHolderCategory}>
                            <MaterialIcons name="category" size={38} color="black" />
                        </View>
                        <TextInput 
                        style={styles.Input}
                        placeholder="Enter a category"
                        cursorColor="black"
                        selectionColor="grey"
                        activeUnderlineColor="black"
                        value={category}
                        onChangeText={cat=>setCategory(cat)}
                        />
                    </View>
                </View>
                <View style={styles.btnsView}>
                    <TouchableOpacity style={styles.syncBtn} onPress={handleSync}>
                        <Text style={{fontSize:18,}}>Sync</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                        <Text style={{fontSize:18, color:'white'}}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    addscreen:{
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    dateComponentViewHolder:{
        flexDirection:'row-reverse',
    },
    expenseComp:{
        backgroundColor:whiteSmoke,
        borderRadius:25,
        margin:5,
        elevation:5,
        borderColor:darkColor1,
        borderWidth:1.5,
        minHeight:500
    },
    expenseHeader:{
        marginLeft:35,
        marginRight:35,
        marginTop:25,
        borderBottomColor:darkColor4,
        borderWidth:1.5,
        borderRightColor:'transparent',
        borderLeftColor:'transparent',
        borderTopColor:'transparent'
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
        height:45
    },
    categoryView:{
        marginStart:35,
        marginEnd:35,
        flexDirection:'row',
        marginTop:20,
        borderRadius:5,
        width:250,
        height:45
    }
    ,
    iconHolder:{
        backgroundColor:'white',
        width:50,
        paddingLeft:15,
        borderRadius:5,
        borderWidth:2
    },
    iconHolderCategory:{
        backgroundColor:'white',
        width:50,
        paddingLeft:5,
        borderRadius:5,
        borderWidth:2
    },
    Input:{
        backgroundColor:'transparent',
        minWidth:245,
        fontSize:18,
        borderColor:'transparent',
        borderBottomWidth:0
    },
    syncBtn:{
        backgroundColor:'white',
        height:50,
        width:250,
        justifyContent:'center',
        alignItems:"center",
        borderRadius:50,
        borderWidth:2,
        elevation:3,
    },
    cancelBtn:{
        backgroundColor:'black',
        height:50,
        width:250,
        justifyContent:'center',
        alignItems:"center",
        borderRadius:50,
        borderWidth:2,
        elevation:3,
        marginTop:10
    },
    btnsView:{
        justifyContent:"center",
        alignItems:"center",
        margin:80
    }
})
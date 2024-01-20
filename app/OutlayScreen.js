import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { darkColor1, primaryColor } from "../constants";
import CustomDate from "../components/CustomDate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import PieChart from "react-native-pie-chart";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function OutlayScreen(){
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [colors, setColors]= useState([]);
    const [percentages, setPercentages] = useState([]);
    const [combinedData, setCombineData] = useState([]);
    const monthYear = `${new Date().getMonth()+1}_${new Date().getFullYear()}`
    const [refreshing, setRefreshing] = useState(true);
    const widthAndHeight = 250
    //FETCHING DATA FROM THE DB
    const fetchDataFromMongoDB=async()=>{
        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_OUTLAY_MONTH_URL_GOOGLE}?email=${email}&monthYear=${monthYear}`, {
                method:'GET',
                headers:{ 
                'authorization': `Bearer ${token}`},
            })
            const data = await response.json()
            if(response.ok){
                setCategories(data.categories);
                setExpenses(data.expenses);
                setColors(data.colors);
                setPercentages(data.percentages);
                setCombineData(data.combinedData);
                setRefreshing(false)
            }else{
                Toast.show({type:'error', text1:'Issue!'})
            }
        }catch(error){
            console.log("Failed!")
            console.log("Error:", error)
            Toast.show({type:'error', text1:'Failed to fetch!'})
        }
    }
    useEffect(()=>{
        async function fetchTokenEmail(){
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('userEmail');
            return {token, email};
        }
        fetchTokenEmail().then(({token, email})=>{
            setToken(token);
            setEmail(email);
            fetchDataFromMongoDB();
        });
    },[token, email, monthYear])

    console.log('Categories:', categories)
    console.log('expenses', expenses)
    console.log('colors', colors)
    console.log('percentages', percentages)
    console.log('combinedData', combinedData)
    let total = (expenses===undefined)?0:expenses.reduce((accumulator, currentValue)=>accumulator+(parseFloat(currentValue)), 0)
    return (
        <View style={styles.outlayscreen}>
            <View style={{flexDirection:'row', gap:65}}>
                <View style={{
                    width:120, backgroundColor:'white', 
                    height:50, borderWidth:0.5, borderColor:'black',
                    justifyContent:'center', alignItems:'center', 
                    margin:10, borderRadius:5, elevation:10,
                    flexDirection:'row', gap:10}}>
                    <FontAwesome5 name="coins" size={24} color="black" />
                    <Text style={{fontWeight:'bold', fontSize:16}}>{total.toFixed(2)}</Text>
                </View>
                <View style={styles.dateComponentViewHolder}>
                    <CustomDate/>
                </View>
            </View>
            {
                expenses=== undefined || colors === undefined ||
                expenses.length === 0 || colors.length === 0 ? (
                    <View style={{
                        backgroundColor:'white', 
                        margin:20, 
                        alignItems:"center",
                        padding:25,
                    }}>
                        <MaterialCommunityIcons name="cloud-braces" size={250} color="black" />
                        <Text>No Data!</Text>
                    </View>
                ) : (
                    <View style={{  
                    backgroundColor:'white', 
                    borderRadius:10, 
                    borderWidth:0.5,
                    margin:10, 
                    alignItems:"center",
                    padding:25,
                    elevation:3
                    }}>
                        {expenses.length === colors.length ? (
                            <PieChart widthAndHeight={widthAndHeight} series={expenses} sliceColor={colors}/>
                        ) : (
                            <Text>Error: Lengths of expenses and colors arrays do not match</Text>
                        )}
                    </View>
                )
            }
            {refreshing?<ActivityIndicator/>:null}
            <ScrollView 
            style={styles.scrollViewCategories}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchDataFromMongoDB} />
            }
            >
                {
                    (combinedData===undefined)?
                    (
                        null
                    )
                    :(
                        combinedData.map((ctg)=>(
                            <CategoryComp key={ctg.category} item={ctg}/>
                        ))
                    )
                }
            </ScrollView>
        </View>
    );    
}

const CategoryComp=(props)=>{
    return(
        <View style={{
            backgroundColor:'white', 
            flexDirection:"row", 
            alignContent:"center",
            alignItems:"center",
            margin:10,
            width:'auto',
            paddingLeft:20,
            height:60,
            borderRadius:10,
            gap:20,
            borderWidth:0.5,
            elevation:3
            }}>
            <View style={{width:25, height:25, backgroundColor:props.item.color}}/>
            <Text style={{fontWeight:'500'}}>{props.item.category}</Text>
            <Text style={{position:'absolute', right:100, fontWeight:'500'}}>{props.item.percentage}</Text>
            <Text style={{position:'absolute', right:20, fontWeight:'500'}}>$ {props.item.expense.toFixed(2)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    outlayscreen:{
        flex:1,
        backgroundColor:'white'
    },
    scrollViewCategories:{
        backgroundColor:'white',
        flex:1
    },
})

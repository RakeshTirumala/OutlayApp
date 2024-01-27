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


export default function MonthViewComp(){
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [colors, setColors]= useState([]);
    const [percentages, setPercentages] = useState([]);
    const [combinedData, setCombineData] = useState([]);
    const monthYear = `${new Date().getMonth()+1}_${new Date().getFullYear()}`
    const [refreshing, setRefreshing] = useState(true);
    const [bgThemeColor, setBGThemeColor] = useState(styles.lightBGColor);
    const [fontThemeColor, setFontThemeColor] = useState(styles.lightThemeFontColor);

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
                Toast.show({type:'success', text1:'Success!'})
            }else{
                // Toast.show({type:'error', text1:'Issue!'})
                console.log("Error!")
            }
        }catch(error){
            console.log("Failed!")
            console.log("Error:", error)
            Toast.show({type:'error'    , text1:'Failed to fetch!'})
        }
    }

    //FETCHING AND SETTING BG THEME
    async function setTheme(){
        const t = await AsyncStorage.getItem('theme')
        setBGThemeColor((t==='true')?styles.darkBGColor:styles.lightBGColor)
        setFontThemeColor((t==='true')?styles.darkThemeFontColor:styles.lightThemeFontColor)
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

        const themePollingInterval = setInterval(setTheme, 1);

        return () => {
            clearInterval(themePollingInterval);

        };  

    },[token, email, monthYear])
    

    // console.log('Categories:', categories)
    // console.log('expenses', expenses)
    // console.log('colors', colors)
    // console.log('percentages', percentages)
    // console.log('combinedData', combinedData)
    let total = (expenses===undefined)?0:expenses.reduce((accumulator, currentValue)=>accumulator+(parseFloat(currentValue)), 0)
    return (
        <View style={[styles.outlayscreen, bgThemeColor]}>
            <View style={{flexDirection:'row', gap:65}}>
                <View style={[styles.totalView, bgThemeColor]}>
                    <FontAwesome5 name="coins" size={24} style={[fontThemeColor]} />
                    <Text style={[styles.totalViewTxt, fontThemeColor]}>$ {formatExpense(total.toFixed(2))}</Text>
                </View>
                <View style={styles.dateComponentViewHolder}>
                    <CustomDate/>
                </View>
            </View>
            {refreshing?<ActivityIndicator/>:null}
            <ScrollView 
            style={[styles.scrollViewCategories, bgThemeColor]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchDataFromMongoDB} />
            }
            >
                {
                    expenses=== undefined || colors === undefined ||
                    expenses.length === 0 || colors.length === 0 ? (
                        <View style={{
                            backgroundColor:bgThemeColor, 
                            margin:20, 
                            alignItems:"center",
                            padding:25,
                        }}>
                            <MaterialCommunityIcons name="cloud-braces" size={150} style={[fontThemeColor]}/>
                            <Text style={[fontThemeColor]}>No Data!</Text>
                        </View>
                    ) : (
                        <View style={[styles.pieChartView, bgThemeColor]}>
                            {expenses.length === colors.length ? (
                                <PieChart widthAndHeight={widthAndHeight} series={expenses} sliceColor={colors}/>
                            ) : (
                                <Text>Error: Lengths of expenses and colors arrays do not match</Text>
                            )}
                        </View>
                    )
                }
                {
                    (combinedData===undefined)?
                    (
                        null
                    )
                    :(
                        combinedData.map((ctg)=>(
                            <CategoryComp 
                            key={ctg.category} 
                            item={ctg} 
                            bgThemeColor={bgThemeColor} 
                            fontThemeColor={fontThemeColor}/>
                        ))
                    )
                }
            </ScrollView>
        </View>
    );
}

function formatExpense(value) {
    const billion = 1000000000;
    const million = 1000000;
    const thousand = 1000;

    if (value >= billion) {
        return (value / billion).toFixed(1) + 'B';
    } else if (value >= million) {
        return (value / million).toFixed(1) + 'M';
    } else if (value >= thousand) {
        return (value / thousand).toFixed(1) + 'K';
    } else {
        return value.toLocaleString();
    }
}

const CategoryComp=(props)=>{

    const expense = formatExpense(props.item.expense.toFixed(2))

    return(
        <View style={[styles.categoriesComp, props.bgThemeColor]}>
            <View style={{width:25, height:25, backgroundColor:props.item.color}}/>
            <Text style={[styles.categoriesCompCat, props.fontThemeColor]}>{props.item.category}</Text>
            <Text style={[styles.categoriesCompPercent, props.fontThemeColor]}>{props.item.percentage}</Text>
            <Text style={[styles.categoriesCompExp, props.fontThemeColor]}>$ {expense}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    totalViewTxt:{
        fontWeight:'bold', 
        fontSize:16
    },
    totalView:{
        width:120,  
        height:50, 
        borderColor:'black',
        justifyContent:'center', 
        alignItems:'center', 
        margin:10, 
        borderRadius:5, 
        elevation:3,
        flexDirection:'row', 
        gap:10
    },
    categoriesCompCat:{
        fontWeight:'500' 
    },
    categoriesCompPercent:{
        position:'absolute', 
        right:100, 
        fontWeight:'500'
    },
    categoriesCompExp:{
        position:'absolute', 
        right:20, 
        fontWeight:'500'
    },
    categoriesComp:{
        flexDirection:"row", 
        alignContent:"center",
        alignItems:"center",
        margin:10,
        width:'auto',
        paddingLeft:20,
        height:60,
        borderRadius:10,
        gap:20,
        elevation:3
    },
    pieChartView:{
        borderRadius:10, 
        margin:10, 
        alignItems:"center",
        padding:25,
        elevation:3
    },
    outlayscreen:{
        flex:1
    },
    scrollViewCategories:{
        backgroundColor:'white',
        flex:1,
        elevation:3,
        maxHeight:'auto'
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
    piechartdarkbgTheme:{
        backgroundColor:'#363535'
    },
    piechartlightbgTheme:{
        backgroundColor:'white'
    }
})
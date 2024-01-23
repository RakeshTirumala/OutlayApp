import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Toast from "react-native-toast-message";
import { BarChart, LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";


export default function OverallViewComp(){
    const [bgThemeColor, setBGThemeColor] = useState(styles.lightBGColor);
    const [fontThemeColor, setFontThemeColor] = useState(styles.lightThemeFontColor);
    const [bgForBarGraph, setBgForBarGraph] = useState(styles.lightBGColor)
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [months, setMonths] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState([]);
    const [T, setT] = useState('true')
    const [refreshing, setRefreshing] = useState(false);

    //FETCHING AND SETTING BG THEME
    async function setTheme(){
        const t = await AsyncStorage.getItem('theme')
        setT(t);
        setBGThemeColor((t==='true')?styles.darkBGColor:styles.lightBGColor)
        setFontThemeColor((t==='true')?styles.darkThemeFontColor:styles.lightThemeFontColor)
        setBgForBarGraph((t==='true')?styles.darkViewForBarGraph:styles.lightBGColor)
    }
    //FETCHING DATA FROM MONGODB
    const fetchOverallDataFromMongDB=async()=>{
        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_OUTLAY_OVERALL_URL_GOOGLE}?email=${email}`, {
                method:'GET',
                headers:{ 
                'authorization': `Bearer ${token}`},
            })
            const data = await response.json()
            console.log("The fetched data:",data)
            if(response.ok){
                setMonths(data.months);
                setTotalExpenses(data.totalExpenses);
                console.log('Success!')
                Toast.show({type:'success', text1:'Success!'})
            }else{
                // Toast.show({type:'error', text1:'Issue!'})
                console.log("Error!")
            }

        }catch(error){
            Toast.show({type:'error', text1:'Failed to fetch!'})
        }
    }

    //USEFFECT FOR BAR GRAPH DATA FETCH AND 
    //MANAGING THEME
    useEffect(()=>{
        async function fetchTokenEmail(){
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('userEmail');
            return {token, email};
        }
        fetchTokenEmail().then(({token, email})=>{
            setToken(token);
            setEmail(email);
            fetchOverallDataFromMongDB();
            console.log("Fetching Done!")
        });

        const pollingInterval = setInterval(setTheme, 1);
        return()=>{
            clearInterval(pollingInterval)
        } 
    }, [token, email])

    const data = {
        labels: months,
        datasets: [
          {
            data: totalExpenses
          }
        ]
      };
    const chartConfig = {
        backgroundGradientFrom: (T==='true')?"#1e2124":"#FFFFFF",
        backgroundGradientFromOpacity: 1.0,
        backgroundGradientTo: (T==='true')?"#1e2124":"#FFFFFF",
        backgroundGradientToOpacity: 1.0,
        color: (opacity = 10) => (T==='true')?`rgba(147,171,255, ${opacity})`:`rgba(0,0,0,${opacity})`, 
        barPercentage: 0.8,
        useShadowColorFromDataset: false // optional
    };

    return(
        <View style={[styles.overallScreen, bgThemeColor]}>
            {
                (months===undefined || totalExpenses===undefined||months.length===0||totalExpenses.length===0)?
                (
                    <View style={{
                        backgroundColor:bgThemeColor, 
                        margin:20, 
                        alignItems:"center",
                        padding:25, 
                    }}>
                        <MaterialCommunityIcons name="cloud-braces" size={250} style={[fontThemeColor]}/>
                        <Text>No Data!</Text>
                    </View>
                )
                :(
                    <ScrollView 
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOverallDataFromMongDB} />}>
                        {refreshing?<ActivityIndicator/>:null}
                            <View style={[bgThemeColor]}>
                            {months.length === totalExpenses.length ? (
                                <View style={[styles.bargraphView, bgForBarGraph]}>
                                    <BarChart
                                        style={[bgThemeColor]}
                                        data={data}
                                        width={330}
                                        height={330}
                                        yAxisLabel="$"
                                        chartConfig={chartConfig}
                                        withInnerLines={true}
                                        fromZero={true}
                                        showBarTops={true}
                                        showValuesOnTopOfBars={false}
                                    />
                                    <LineChart
                                        data={data}
                                        width={330}
                                        height={330}
                                        chartConfig={chartConfig}
                                        fromZero={true}
                                        bezier
                                    />
                            </View>
                            ) : (
                                <Text>Error!</Text>
                            )}
                            </View>
                    </ScrollView>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    bargraphView:{
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5, 
        margin:10, 
        alignItems:"center",
        padding:10,
        elevation:3,
    },
    overallScreen:{
        flex:1,
        // justifyContent:'center',
        // alignItems:'center',
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
    darkViewForBarGraph:{
        backgroundColor:'#1e2124'
    }
})
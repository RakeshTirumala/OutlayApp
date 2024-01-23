import React, { useEffect, useState } from "react";
import MonthViewComp from "../components/MonthViewComp";
import OverallViewComp from "../components/OverallViewComp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

export default function OutlayScreen(){
    const [mo, setMO] = useState('Month')

    async function maintainMO(){
        const moValue = await AsyncStorage.getItem('mo');
        setMO(moValue)
    }
    useEffect(()=>{
        const pollingInterval = setInterval(maintainMO, 1);
        return()=>{
            clearInterval(pollingInterval)
        }
    })
    return(
        (mo==='Month')?
        (
            <MonthViewComp/>
        ):(
            <OverallViewComp/>
        )
    )  
}



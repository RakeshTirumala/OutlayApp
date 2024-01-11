import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { darkColor1, darkColor3, iconColor, primaryColor, secondaryColor } from "../constants";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import OutlayScreen from "./OutlayScreen";
import AddScreen from "./AddScreen";
import PreferencesScreen from "./Preferences";
import { Ionicons } from '@expo/vector-icons';  
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


export default function MainScreen(){
  const Tab = createMaterialBottomTabNavigator() 
  return(
    <Tab.Navigator 
    initialRouteName="Outlay" 
    barStyle={{backgroundColor:secondaryColor}}
    >
      <Tab.Screen 
      name="Add"
      component={AddScreen}
      options={{
        tabBarIcon:()=>(
          <Ionicons name="add-circle" size={24} color={iconColor} />
        ),
      }}
      />
      <Tab.Screen 
      name="Outlay"
      component={OutlayScreen}
      options={{
        tabBarIcon:()=>(
          <Entypo name="pie-chart" size={24} color={iconColor}/>
        )
      }}
      />
      <Tab.Screen 
      name="Preferences"
      component={PreferencesScreen}
      options={{
        tabBarIcon:()=>(
          <MaterialIcons name="account-circle" size={24} color={iconColor} />
        )
      }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    mainscreen: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

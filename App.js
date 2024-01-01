import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './app/MainScreen';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { StatusBar } from 'expo-status-bar';
import { primaryColor } from './constants';

export default function App() {
  const Stack = createStackNavigator();  
  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <Stack.Navigator 
        screenOptions={{headerShown:false}}
        initialRouteName='Main'>
          <Stack.Screen 
          name='Main' 
          component={MainScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar backgroundColor='black'/>
    </SafeAreaView>
  );
}



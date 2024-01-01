import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { darkColor1 } from "../constants";

export default function OutlayScreen(){
    return(
        <View style={styles.outlayscreen}>
            <View>
                <Text>Outlay Screen</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    outlayscreen:{
        flex:1,
    },
})

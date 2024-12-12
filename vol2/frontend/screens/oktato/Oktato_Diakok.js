import React from "react";
import { View, Text, Button } from "react-native";



export default function Oktato_Diakok({atkuld}){
    return(
        <View style={Styles.oktatodiakok}>
            <View>
            <Text>Aktuális Diákok </Text>
            <Text> {atkuld} </Text>
            </View>
        </View>
    );
}
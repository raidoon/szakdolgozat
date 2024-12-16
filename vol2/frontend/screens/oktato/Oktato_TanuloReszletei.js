import React from "react";
import { View, Text, Button } from "react-native";
import Styles from "../../Styles";


export default function Oktato_TanuloReszletei({route}){
    const {tanulo}=route.params
    return(
        <View style={Styles.bejelentkezes_Container}>
            <View>
            <Text>Részletek {tanulo.tanulo_neve}</Text>
            </View>
        </View>
    );
}
import React from "react";
import { View, Text } from "react-native";
import Styles from "../../Styles";

export default function Oktato_Kezdolap({atkuld}){
    return(
        <View style={Styles.bejelentkezes_Container}>
            <View>
            <Text>Sikeres bejelentkezés! </Text>
            <Text>{atkuld ? `Felhasználó ID: ${atkuld}` : "Nincs adat"}</Text>
            </View>
        </View>
    );
}
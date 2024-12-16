import React from "react";
import { View, Text } from "react-native";
import Styles from "../../Styles";

export default function Tanulo_Kezdolap({atkuld}){
    console.log("Atküldött adat a Kezdőlapon: ", atkuld);
    return(
        <View style={Styles.bejelentkezes_Container}>
            <View>
            <Text>Sikeres bejelentkezés! </Text>
            <Text>{atkuld ? `Felhasználó ID: ${atkuld[0].felhasznalo_id}` : "Nincs adat"}</Text>
            </View>
        </View>
    );
}
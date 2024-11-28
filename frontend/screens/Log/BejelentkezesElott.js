import React from "react";
import { View, Text, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Styles from "../../Styles";

export default function BejelentkezesElott() {
  return (
    <View style={Styles.bejelentkezes_Container}>
       <Ripple
            rippleColor="rgb(0,0,0)"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleFades={false}
            rippleContainerBorderRadius={20}
            style={[Styles.bejelentkezes_Gomb,Styles.bejelentkezes_regisztaciosGomb,{width: '60%'}]}
            onPress={() => navigation.navigate("")}
        >
            <Text style={Styles.bejelentkezes_regiGombSzoveg}>
                <Ionicons name="car-sport-outline" size={20} color="#0005"/>
                Oktató vagyok
            </Text>
        </Ripple>
        <Ripple
            rippleColor="rgb(0,0,0)"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleFades={false}
            rippleContainerBorderRadius={20}
            style={[Styles.bejelentkezes_Gomb,Styles.bejelentkezes_regisztaciosGomb,{width: '60%'}]}
            onPress={() => navigation.navigate("")}
        >
            <Text style={Styles.bejelentkezes_regiGombSzoveg}>
                <Ionicons name="accessibility-outline" size={20} color="#0005"/>
                Tanuló vagyok
            </Text>
        </Ripple>
    </View>
  );
}
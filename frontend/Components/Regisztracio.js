import React from "react";
import { View, TextInput, Text } from "react-native";
import Styles from "../Styles";
import Ripple from "react-native-material-ripple";
import { Octicons } from "@expo/vector-icons";

export default function Regisztracio() {
  return (
    <View style={Styles.bejelentkezes_Container}>
        
        <View style={Styles.bejelentkezes_FormInputWrapper}>
            <Octicons name="person" size={20} color="#0005" />
            <TextInput
            cursorColor={"#000"}
            style={Styles.input}
            placeholder="TELJES NÉV"
            //value={felhasznalonev}
            //onChangeText={(felhasznalo) => setFelhasznalonev(felhasznalo)}
            />
      </View>

      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="person" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.input}
          placeholder="FELHASZNÁLÓNÉV"
          //value={felhasznalonev}
          //onChangeText={(felhasznalo) => setFelhasznalonev(felhasznalo)}
        />
      </View>

      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="shield-lock" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.input}
          placeholder="JELSZÓ"
          secureTextEntry={true}
          //value={jelszo}
          //onChangeText={(szoveg) => setJelszo(szoveg)}
          maxLength={20} //max 20 karaktert lehet jelszónak --> Fanni állítsd be az adatbázisba!!!
        />
      </View>

      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="shield-lock" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.input}
          placeholder="JELSZÓ MÉGEGYSZER"
          secureTextEntry={true}
          //value={jelszo}
          //onChangeText={(szoveg) => setJelszo(szoveg)}
          maxLength={20} //max 20 karaktert lehet jelszónak --> Fanni állítsd be az adatbázisba!!!
        />
      </View>

      <Ripple
            rippleColor="rgb(0,0,0)"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleFades={false}
            rippleContainerBorderRadius={20}
            style={[Styles.bejelentkezes_Gomb,Styles.bejelentkezes_regisztaciosGomb,{marginLeft: 100,marginRight:100}]}
            //onPress={() => navigation.navigate("")}
        >
            <Text style={Styles.bejelentkezes_regiGombSzoveg}>Regisztráció</Text>
        </Ripple>

    </View>
  );
}
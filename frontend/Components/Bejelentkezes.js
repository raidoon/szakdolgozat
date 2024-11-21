import { Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import Styles from "../Styles";
//const [betoltes, setBetoltes] = useState(false);
export default function Bejelentkezes({navigation}) {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");
  return (
    <View style={Styles.bejelentkezes_Container}>
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="person" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.input}
          placeholder="Felhasználónév"
          value={felhasznalonev}
          onChangeText={(felhasznalo) => setFelhasznalonev(felhasznalo)}
        />
      </View>
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="shield-lock" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.input}
          placeholder="Jelszó"
          secureTextEntry={true}
          value={jelszo}
          onChangeText={(szoveg) => setJelszo(szoveg)}
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
            style={Styles.bejelentkezes_Gomb}
        >
            <Text style={Styles.bejelentkezes_bejelentkezoGomb}>Bejelentkezés</Text>
      </Ripple>
      <View style={Styles.bejelentkezes_kerdes}>
        <Text style={Styles.bejelentkezes_kerdesSzoveg}>Nincs fiókod?</Text>
        <Ripple
            rippleColor="rgb(0,0,0)"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleFades={false}
            rippleContainerBorderRadius={20}
            style={[Styles.bejelentkezes_Gomb,Styles.bejelentkezes_regisztaciosGomb]}
            onPress={() => navigation.navigate("Regisztracio")}
        >
            <Text style={Styles.bejelentkezes_regiGombSzoveg}>Regisztráció</Text>
        </Ripple>
      </View>
    </View>
  );
}
/*<View style={Styles.nemEngedBejelentkezni}>
    <Text>Problémád van a bejelentkezéssel?</Text>
        <TouchableOpacity activeOpacity={0.7}>
            <Text style={Styles.support}>Vedd fel velünk a kapcsolatot!</Text>
        </TouchableOpacity>
</View>*/
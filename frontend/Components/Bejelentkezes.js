import { Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import Styles from "../Styles";
import { useAuth } from "./authContext";

export default function Bejelentkezes({ navigation }) {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");
  const { setIsAuthenticated } = useAuth();

  {
    /*
       ASYNC STORAGE, ADATBÁZIS 
    */
  }

  const handleLogin = () => {
    if (felhasznalonev === "admin" && jelszo === "password123") {
      setIsAuthenticated(true);
      navigation.navigate("Kezdőlap");
    } else {
      alert("Hibás felhasználónév vagy jelszó!");
    }
  };

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
        onPress={handleLogin}  // Itt hívjuk meg a bejelentkezési logikát
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
          style={[Styles.bejelentkezes_Gomb, Styles.bejelentkezes_regisztaciosGomb]}
          onPress={() => navigation.navigate("Regisztracio")}
        >
          <Text style={Styles.bejelentkezes_regiGombSzoveg}>Regisztráció</Text>
        </Ripple>
      </View>
    </View>
  );
}
import { Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import Styles from "../../Styles";
import { useAuth } from "./authContext";

export default function Bejelentkezes({ navigation }) {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");
  const { setIsAuthenticated } = useAuth();
  const [adatok, setAdatok] = useState([]);
  
  const handleLogin = async () => {
    const adatok = {
      bevitel1: felhasznalonev,
      bevitel2: jelszo
    };
    try {
      const response = await fetch("http://192.168.10.57:3000/bejelentkezes", {
        method: "POST",
        body: JSON.stringify(adatok),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const data = await response.json();
      setAdatok(data);
      if (data.length > 0) {
        setIsAuthenticated(true);
        navigation.navigate("BejelentkezesUtan", {atkuld: felhasznalonev});
      } else {
        alert("Hibás felhasználónév vagy jelszó!");
      }
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      alert("Hiba történt a bejelentkezés során!");
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
          maxLength={20}
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
        onPress={handleLogin}
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
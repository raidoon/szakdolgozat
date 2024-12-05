import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../../Styles';
import { Octicons } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";


export default function LoginScreen({ navigation }) {
  const [felhasznalonev, setFelhasznalonev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [adatok,setAdatok] = useState([]);
//192.168.1.190 ||192.168.10.57 ||192.168.10.58
  const handleLogin = async () => {
    const adatok={
        felhasznalonev: felhasznalonev,
        jelszo: jelszo
    }
    try{
        const response = await fetch("http://192.168.1.190:3000/bejelentkezes", {
            method: "POST",
            body: JSON.stringify(adatok),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });
          const adat = await response.json();
          setAdatok(adat);
          if (adat.length > 0) {
            console.log(adat)
            if(adat[0].felhasznalo_tipus===1){
                Alert.alert("Sikeres bejelentkezés!");
                navigation.replace("Oktato_Kezdolap",);
            }
            else{
                Alert.alert("Sikeres bejelentkezés!");
                navigation.replace("Tanulo_BejelentkezesUtan",);
            }
          } else {
            alert("Hibás felhasználónév vagy jelszó!");
          }
    }
    catch (error) {
        console.error("Bejelentkezési hiba:", error);
        alert("Hiba történt a bejelentkezés során!");
    }
};

  return (
    <View style={Styles.bejelentkezes_Container}>
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="person" size={20} color="#FF6C00" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.jelszoInput}
          placeholder="Felhasználónév"
          value={felhasznalonev}
          onChangeText={(felhasznalo) => setFelhasznalonev(felhasznalo)}
        />
      </View>
      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="shield-lock" size={20} color="#FF6C00" />
        <TextInput
          cursorColor={"#000"}
          style={Styles.jelszoInput}
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
          onPress={() => navigation.replace("Regisztracio")}
        >
          <Text style={Styles.bejelentkezes_regiGombSzoveg}>Regisztálj!</Text>
        </Ripple>
      </View>
    </View>
  );
}

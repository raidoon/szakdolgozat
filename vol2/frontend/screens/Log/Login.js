import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert,TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styles from '../../Styles';
import { Octicons, Ionicons } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";


export default function LoginScreen({ navigation }) {
  const [felhasznalonev, setFelhasznalonev] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [jelszoMutatasa, setJelszoMutatasa] = useState(false);
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
                var felhasznalo = adat[0].felhasznalo_nev;
                Alert.alert("Üdvözöllek " + felhasznalo + "!");
                navigation.replace("Oktato_Kezdolap", {atkuld: felhasznalo});
            }
            else{
                var felhasznalo = adat[0].felhasznalo_nev;
                Alert.alert("Üdvözöllek " + felhasznalo + "!");
                navigation.replace("Tanulo_BejelentkezesUtan",{atkuld: adat[0].felhasznalo_id});
            }
          } else {
            Alert.alert("Hibás felhasználónév vagy jelszó!");
          }
    }
    catch (error) {
        console.error("Bejelentkezési hiba:", error);
        alert("Hiba történt a bejelentkezés során!");
    }
};

  return (
    <View style={Styles.bejelentkezes_Container}>
      <View style={styles.inputWrapper}>
        <Octicons name="person" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Felhasználónév"
          value={felhasznalonev}
          onChangeText={setFelhasznalonev}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Octicons name="lock" size={20} color="#FF6C00" />
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          secureTextEntry={!jelszoMutatasa}
          value={jelszo}
          onChangeText={setJelszo}
        />
        <TouchableOpacity onPress={() => setJelszoMutatasa(!jelszoMutatasa)}>
          <Ionicons
            name={jelszoMutatasa ? "eye" : "eye-off"}
            size={20}
            color="#FF6C00"
          />
        </TouchableOpacity>
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
const styles = StyleSheet.create({
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f7f7f7",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingHorizontal: 10,
      width: "100%",
      height: 50,
      marginBottom: 15,
    },
    input: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: "#000",
    },
    signupButton: {
      backgroundColor: "#020202",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginTop: 20,
    },
    signupButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    bottomText: {
      color: "#888",
      fontSize: 14,
    },
    linkText: {
      color: "#FF6C00",
      fontWeight: "bold",
    },
});
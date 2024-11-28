import React from "react";
import { View, TextInput, Text } from "react-native";
import Styles from "../../Styles";
import Ripple from "react-native-material-ripple";
import { Octicons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function Regisztracio({navigation}) {
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
        <Ionicons name="call-outline" size={20} color="#0005"/>
        <TextInput
          cursorColor={"#000"}
          style={Styles.input}
          placeholder="TELEFONSZÁM"
        />
      </View>

      <View style={Styles.bejelentkezes_FormInputWrapper}>
        <Octicons name="key" size={20} color="#0005" />
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
        <Octicons name="key" size={20} color="#0005" />
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
            style={[Styles.bejelentkezes_Gomb,Styles.bejelentkezes_regisztaciosGomb,{width: '60%'}]}
            onPress={() => navigation.navigate("Kezdolap")}
        >
            <Text style={Styles.bejelentkezes_regiGombSzoveg}>Regisztráció</Text>
        </Ripple>

    </View>
  );
}
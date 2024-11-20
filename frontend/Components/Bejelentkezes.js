import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import ripple from 'react-native-material-ripple'
import Ripple from "react-native-material-ripple";

/**
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [betoltes, setBetoltes] = useState(false);



  value={felhasznalonev=>setFelhasznalonev(felhasznalonev)}



  value={jelszo=>setJelszo(jelszo)}

  
 */



export default function Bejelentkezes() {
  
  return (
    <View style={styles.container}>
      <View style={styles.formInputWrapper}>
        <Octicons name="person" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={styles.input}
          placeholder="Felhasználónév"
          
        />
      </View>
      <View style={styles.formInputWrapper}>
        <Octicons name="shield-lock" size={20} color="#0005" />
        <TextInput
          cursorColor={"#000"}
          style={styles.input}
          placeholder="Jelszó"
          secureTextEntry={true}
        />
      </View>
      <Ripple
            rippleColor="rgb(0,0,0)"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleFades={false}
            rippleContainerBorderRadius={20}
            style={[styles.Gomb,styles.bejelentkezoGomb]}
        >
            <Text>Bejelentkezés</Text>
      </Ripple>
       
      
      <View style={styles.atuh_question}>
        <Text style={styles.question_text}>Nincs fiókod?</Text>
        <Ripple
            rippleColor="rgb(0,0,0)"
            rippleOpacity={0.05}
            rippleDuration={300}
            rippleCentered={true}
            rippleFades={false}
            rippleContainerBorderRadius={20}
            style={[styles.Gomb,styles.regisztaciosGomb]}
        >
            <Text styles={styles.signup_button_text}>Regisztráció</Text>
        </Ripple>
      </View>
    </View>
  );
}

/*
<View style={styles.nemEngedBejelentkezni}>
    <Text>Problémád van a bejelentkezéssel?</Text>
        <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.support}>Vedd fel velünk a kapcsolatot!</Text>
        </TouchableOpacity>
</View>
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formInputWrapper: {
    width: "90%",
    height: 55,
    backgroundColor: "#f7f9ef",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    marginBottom: 10
  },
  input: {
    width: "90%",
    height: "100%",
    marginLeft: 10,
  },
  Gomb:{
    padding:15,
    backgroundColor:'#17469F',
    alignItems:'center',
    borderRadius:10,
    width:'90%',
    marginTop:20,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  bejelentkezoGomb:{
    backgroundColor: '#17469F'
  },
  regisztaciosGomb:{
    width:'100%',
    marginTop:7,
    borderColor:'#17469F',
    backgroundColor:'#fff',
    borderWidth:1,
    paddingVertical:10
  },
  atuh_question:{
    width:'90%',
    marginTop:20
  },
  question_text:{
    fontSize:16,
    marginRight:5,
    marginTop:10
  },
  signup_button_text:{
    color:'#17469F'
  },
  /**
   support:{
    fontSize:17,
    fontWeight: '600'
   },
   nemEngedBejelentkezni:{
    width:'90%',
    alignItems:'center',
    marginTop:20
   }
   */
});

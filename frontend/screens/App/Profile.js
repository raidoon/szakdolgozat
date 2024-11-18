import React, { useState,useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";

export default function Profil() {
  const [adatok,setAdatok] = useState([]);
  const letoltes = async()=>{
    const x = await fetch("http://192.168.10.57:3000/tanuloLista"); //Fanni: 58 --> EH: 57
    const y = await x.json();
    setAdatok(y);
  };
  useEffect(() => {
    letoltes();
  }, []);
  return(
    <View style={styles.default}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Felhasználó Profilja</Text>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
    default: {
      
    },
  });
  
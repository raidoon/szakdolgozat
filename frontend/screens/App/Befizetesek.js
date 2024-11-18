import React from "react";
import { useState,useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function Befizetesek() {
  const [adatok, setAdatok] = useState([]);
  const letoltes = async () => {
    const x = await fetch("http://192.168.10.57:3000/tanuloLista"); //Fanni: 58 --> EH: 57
    const y = await x.json();
    setAdatok(y);
    //alert(JSON.stringify(y))
  };
  useEffect(() => {
    letoltes();
  }, []);
  return (
    <View style={styles.default}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Adatok betöltése az adatbázisból:
      </Text>
      <FlatList
        data={adatok}
        renderItem={({ item }) => (
          <View style={styles.felsorolas}>
            <Text>Tanuló neve: {item.tanulo_nev}</Text>
            <Text>Tanuló eddigi óráinak száma: {item.tanulo_orak}</Text>
            <Text>
              Tanuló eddig kifizetett óráinak száma: {item.tanulo_befizetett}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.tanulo_id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  felsorolas: {
    margin: 30,
  },
});

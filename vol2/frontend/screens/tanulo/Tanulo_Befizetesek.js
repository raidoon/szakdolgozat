import React from "react";
import { useState,useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function Tanulo_Befizetesek() {
  
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

import React from "react";
import { useState,useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function Oktato_Kifizetesek() {
  
  return (
    <View style={styles.default}>
        <Text>Tanulók kifizetései</Text>
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

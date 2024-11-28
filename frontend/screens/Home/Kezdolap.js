import React from "react";
import { View, Text, Button } from "react-native";

export default function Kezdolap({ route }) {
  const { atkuld } = route?.params || {};

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {atkuld ? (
        <Text>{atkuld}</Text>
      ) : (
        <Text>Hiba történt a felhasználónév átadásában!</Text>
      )}
    </View>
  );
}

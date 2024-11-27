import React from "react";
import { View, Text, Button } from "react-native";

export default function Kezdolap({ route }) {
  // Ellenőrizzük, hogy az atkuld paraméter létezik-e
  const { atkuld } = route?.params || {};  // Ha route.params nem található, üres objektumot adunk vissza

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {atkuld ? (
        <Text>{atkuld}</Text>  // Ha atkuld létezik, megjelenítjük
      ) : (
        <Text>Hiba történt a felhasználónév átadásában!</Text>  // Ha atkuld nem létezik, hibát jelez
      )}
    </View>
  );
}

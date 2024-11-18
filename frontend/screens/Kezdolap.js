import React from "react";
import { View, Text, Button } from "react-native";

export default function Kezdolap({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Kezdőlap</Text>
      <Button
        title="Tovább a felhasználói oldalra"
        onPress={() => navigation.navigate("Profil")}
      />
    </View>
  );
}

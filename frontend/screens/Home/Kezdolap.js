import React from "react";
import { View, Text, Button } from "react-native";

export default function Kezdolap({ navigation,route }) {
  const {atkuld} = route.params;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{atkuld}</Text>
      
    </View>
  );
}

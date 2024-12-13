import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Styles from "../../../Styles";

export default function Kapcsolat() {
  return (
    <View style={styles.default}>
      <View style={{ textAlign: "left", width: "100%" }}>
        <Text
          style={{
            fontSize: 16,
            color: "grey",
            textAlign: "center",
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          Az alábbi elérhetőségeken bármikor felveheted velünk a kapcsolatot. Csapatunk amilyen hamar csak lehet válaszolni fog.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          marginTop: 30,
          alignItems: "center",
          textAlign: "center",
          width: 250,
          padding: 15,
          height: 100
        }}
      >
        <Text>Customer Support</Text>
        <Text>Email cím</Text>
        <Text>segitseg@gmail.com</Text>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          marginTop: 50,
          alignItems: "center",
          textAlign: 'center',
          width: 250,
          padding: 15,
          height: 100
        }}
      >
                <Text>social media elérhetőségek</Text>
                <Text>github pl ?</Text>
                <Text>akarunk egyáltalán marketinget?</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#grey",
    alignItems: 'center'
  },
});

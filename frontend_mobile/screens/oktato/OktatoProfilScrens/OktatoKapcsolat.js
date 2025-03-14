import React from "react";
import { View, Text, } from "react-native";
import Styles from "../../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function OktatoKapcsolat() {
  return (
    <View style={Styles.kapcsolatNagyDiv}>

      <Text>Lépjen velünk kapcsolatba!</Text>

      <View style={{ textAlign: "left", width: "100%" }}>
        <Text
          style={Styles.alcim2}
        >
          Az alábbi elérhetőségeken bármikor felveheted velünk a kapcsolatot.
          Csapatunk amilyen hamar csak lehet válaszolni fog.
        </Text>
      </View>

      <View style={Styles.kapcsolatBuborek}>
        <Text><Ionicons name="mail" size={40} color="orange" /></Text>
        <Text>Ügyfélszolgálat</Text>
        <Text>slashtactics@gmail.com</Text>
      </View>

      <View style={Styles.kapcsolatBuborek}>
        <Text>Az app készítői:</Text>
        <Text>BF</Text>
        <Text>EH</Text>
      </View>
    </View>
  );
}
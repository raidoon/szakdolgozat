import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Modal, TouchableOpacity } from "react-native";
import Ripple from "react-native-material-ripple";
import Styles from "../../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tanulo_Profil = ({ atkuld }) => {
  const navigation = useNavigation();
  const [kijelentkeztetesAlertLathato, setKijelentkeztetesAlertLathato] = useState(false);
  const modalCsukas = () => {
    setKijelentkeztetesAlertLathato(false);
  };
  const kijelentkeztetes = async () => {
    await AsyncStorage.removeItem("bejelentkezve");
    navigation.navigate("Bejelentkezes");
  };
  return (
    <View style={styles.container}>
      <View style={Styles.profilView}>
        <Text style={Styles.profilNev}>{atkuld.tanulo_neve}</Text>
        <Text style={Styles.profilEmail}>{atkuld.felhasznalo_email}</Text>
      </View>

      <View style={Styles.profilGombokView}>
        <Ripple
          style={Styles.gombRipple}
          onPress={() => navigation.navigate("Tanuló Profil", { screen: "SzemelyesAdatok" })}
        >
          <Ionicons name="person-outline" size={24} color="#4CAF50" />
          <Text style={Styles.gombText}>Személyes adatok</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </Ripple>

        <Ripple
          style={Styles.gombRipple}
          onPress={() => navigation.navigate("Tanuló Profil", { screen: "JelszoMegvaltoztatasa" })}
        >
          <Ionicons name="shield-half-outline" size={24} color="#2196F3" />
          <Text style={Styles.gombText}>Jelszó megváltoztatása</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </Ripple>

        <Ripple
          style={Styles.gombRipple}
          onPress={() => navigation.navigate("Tanuló Profil", { screen: "Kapcsolat" })}
        >
          <Ionicons name="information-circle-outline" size={24} color="#333" />
          <Text style={Styles.gombText}>Kapcsolat</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </Ripple>
      </View>

      <Ripple
        style={Styles.kijelentkezesGomb}
        onPress={() => setKijelentkeztetesAlertLathato(true)}
      >
        <Text style={Styles.kijelentkezesGombText}>Kijelentkezés</Text>
      </Ripple>

      <Modal 
        transparent={true} 
        visible={kijelentkeztetesAlertLathato} 
        onRequestClose={modalCsukas}
      >
        <View style={Styles.modalNagyView}>
          <View style={Styles.modalKisView}>
            <Text style={Styles.modalCim}>Figyelem!</Text>
            <Text style={Styles.modalLeiras}>Biztosan ki szeretne jelentkezni?</Text>

            <View style={Styles.modalGombView}>
              <TouchableOpacity
                style={Styles.modalMegseGomb}
                onPress={modalCsukas}
              >
                <Text style={Styles.modalMegseGombText}>Mégse</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={Styles.modalKijelentkezesGomb}
                onPress={kijelentkeztetes}
              >
                <Text style={Styles.modalKijelentkezesGombText}>Kijelentkezés</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
});

export default Tanulo_Profil;
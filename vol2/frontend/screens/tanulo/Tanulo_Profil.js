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

  const kijelentkeztetesAlert = () => {
    Alert.alert("Figyelem!", "Biztosan ki szeretne jelentkezni?", [
      {
        text: "Mégse",
        onPress: () => console.log("mégse megnyomva"),
        style: "cancel",
      },
      {
        text: "Igen",
        onPress: () => kijelentkeztetes(),
      },
    ]);
  };

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

      <View style={styles.menuContainer}>
        <Ripple
          style={styles.menuItem}
          onPress={() => navigation.navigate("Tanuló Profil", { screen: "SzemelyesAdatok" })}
        >
          <Ionicons name="person-outline" size={24} color="#4CAF50" />
          <Text style={styles.menuItemText}>Személyes adatok</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </Ripple>

        <Ripple
          style={styles.menuItem}
          onPress={() => navigation.navigate("Tanuló Profil", { screen: "JelszoMegvaltoztatasa" })}
        >
          <Ionicons name="shield-half-outline" size={24} color="#2196F3" />
          <Text style={styles.menuItemText}>Jelszó megváltoztatása</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </Ripple>

        <Ripple
          style={styles.menuItem}
          onPress={() => navigation.navigate("Tanuló Profil", { screen: "Kapcsolat" })}
        >
          <Ionicons name="information-circle-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Kapcsolat</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </Ripple>
      </View>

      <Ripple
        style={styles.logoutButton}
        onPress={() => setKijelentkeztetesAlertLathato(true)}
      >
        <Text style={styles.logoutButtonText}>Kijelentkezés</Text>
      </Ripple>

      <Modal 
        transparent={true} 
        visible={kijelentkeztetesAlertLathato} 
        onRequestClose={modalCsukas}
      >
        <View style={styles.modalNagyView}>
          <View style={styles.modalKisView}>
            <Text style={styles.modalCim}>Kijelentkezés</Text>
            <Text style={styles.modalLeiras}>Biztos benne, hogy ki szeretne jelentkezni?</Text>

            <View style={styles.modalGombView}>
              <TouchableOpacity
                style={styles.modalMegseGomb}
                onPress={modalCsukas}
              >
                <Text style={styles.modalMegseGombText}>Mégse</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalKijelentkezesGomb}
                onPress={kijelentkeztetes}
              >
                <Text style={styles.modalKijelentkezesGombText}>Kijelentkezés</Text>
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
  profileImagePlaceholder: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuItemText: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: "#FF4444",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 30,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  modalNagyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalKisView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalCim: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLeiras: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalGombView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalMegseGomb: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalMegseGombText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalKijelentkezesGomb: {
    backgroundColor: '#FF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalKijelentkezesGombText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tanulo_Profil;
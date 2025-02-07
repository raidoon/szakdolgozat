import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const OktatonakAkarokFizetni = ({ navigation }) => {
  const [osszeg, setOsszeg] = useState("");
  //-------------------------------------------------------------

  const handlePayment = () => {
    // Handle payment logic here
    alert(`Fizetés elküldve: ${osszeg} Ft`);
  };

  return (
    <LinearGradient colors={["#ffffff", "#f0f4ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Oktatónak fizetés</Text>
        <Text style={styles.subtitle}>
          A felvenni kívánt összeget az oktatód fogja jóváhagyni, amennyiben
          tényleg kifizetted neki!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Összeg (Ft)"
          keyboardType="numeric"
          value={osszeg}
          onChangeText={setOsszeg}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.gradient}
          >
            <Ionicons name="card" size={24} color="#fff" />
            <Text style={styles.payButtonText}>Fizetés elküldése</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  payButton: {
    width: "100%",
    height: 60,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  nincsOra: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
  },
  modalCloseBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6B6054", //barnás earth vibes
    //backgroundColor: '#6A5AE0',
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "#f3f0fa",
    alignItems: "center",
    padding: 20,
  },
  container2: {
    flex: 1,
    backgroundColor: "#f3f0fa",
    alignItems: "center",
    padding: 20,
  },
  cim: {
    fontSize: 24,
    fontWeight: "bold",
    //color: "#3BC14A", //zöld
    //color: "#6A5AE0", //lila
    color: "#6B6054", //earthy vibes
    marginBottom: 20,
  },
  osszegBeiras: {
    fontSize: 40,
    fontWeight: "bold",
    //color: "#3BC14A", //zöld
    //color:"#6A5AE0", //lila
    color: "#6B6054", //earthy vibes
    textAlign: "center",
    marginBottom: 10,
  },
  figyelmeztetes: {
    fontSize: 16,
    color: "#8e8e93",
    marginBottom: 5,
    textAlign: "center",
  },
  felvetelGomb: {
    backgroundColor: "#4DA167", //zöld
    //backgroundColor: "#6A5AE0", //lila
    //backgroundColor: '#FF6B6B',
    //backgroundColor: '#6B6054', //earthy vibes
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 10,
  },
  felvetelGombSzoveg: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  szamologepView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  szamologepGomb: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderColor: "#EDE7E3",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  szamologepSzoveg: {
    fontSize: 24,
    color: "#6B6054",
    fontWeight: "bold",
  },
  szamologepSzovegC: {
    fontSize: 24,
    color: "#FFA62B",
    fontWeight: "bold",
  },
  szamologepSzovegDEL: {
    fontSize: 24,
    color: "red",
    fontWeight: "bold",
  },
  tranzakcioContainer: {
    backgroundColor: "#f3f0fa",
    margin: 20,
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legutobbiTranzakciok: {
    flexDirection: "row",
    alignItems: "center", // Az elemek középre igazítása függőlegesen
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },

  tranzakciosTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  tranzakciosText: {
    fontSize: 16,
    marginRight: 3,
  },
  tranzakciosOsszeg: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#d63031",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    borderRadius: 30,
  },
  checkedCheckbox: {
    //backgroundColor: "#FFA62B", //narancs a zöldhöz
    //borderColor: '#FFA62B' //narancs a zöldhöz
    backgroundColor: "#FFA62B",
    //borderColor: '#cae9ff'
  },
  checkboxView: {
    flexDirection: "row",
    alignContent: "space-between",
  },
});

export default OktatonakAkarokFizetni;

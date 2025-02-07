import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const AutosiskolanakAkarokFizetni = ({ navigation }) => {
  const [osszeg, setOsszeg] = useState("");

  const handlePayment = () => {
    // Handle payment logic here
    alert(`Fizetés elküldve: ${osszeg} Ft`);
  };

  return (
    <LinearGradient colors={["#ffffff", "#f0f4ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Autósiskolának fizetés</Text>
        <Text style={styles.subtitle}>Add meg az összeget, amit kifizettél az autósiskolának.</Text>

        <TextInput
          style={styles.input}
          placeholder="Összeg (Ft)"
          keyboardType="numeric"
          value={osszeg}
          onChangeText={setOsszeg}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={styles.gradient}>
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
});

export default AutosiskolanakAkarokFizetni;
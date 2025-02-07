import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import OktatonakAkarokFizetni from "./Tanuloi_Befizetesek/OktatonakAkarokFizetni";
const Tanulo_KinekAkarszBefizetni = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={["#ffffff", "#f0f4ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Kinek szeretnél befizetni?</Text>
        <Text style={styles.subtitle}>Válaszd ki, hogy kinél fizetted be a tanóra/vizsga díjat.</Text>

        {/* FIZETÉS AZ OKTATÓNAK */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Tanuló Pénzügyek", {
              screen: "OktatonakAkarokFizetni",
            })}
        >
          {/*<LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.gradient}>*/}
          <LinearGradient colors={["#6A5AE0", "#6a11cb"]} style={styles.gradient}>
            <Ionicons name="person" size={30} color="#fff" />
            <Text style={styles.buttonText}>Oktatónak fizetek</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/*  FIZETÉS AZ AUTÓSISKOLÁNAK */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Tanuló Pénzügyek", {
              screen: "AutosiskolanakAkarokFizetni",
            })}
        >
          {/*  <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={styles.gradient}> */}
          <LinearGradient colors={["#ff7e5f", "#FF6B6B"]} style={styles.gradient}>
            <Ionicons name="school" size={30} color="#fff" />
            <Text style={styles.buttonText}>Autósiskolának fizetek</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* FIZETÉSI ELŐZMÉNYEK AZ ÖSSZES BEFIZETÉSHEZ !!! */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() =>
            navigation.navigate("Tanuló Pénzügyek", {
              screen: "FizetesiElozmenyek",
            })}
        >
          <Ionicons name="time" size={24} color="#2575fc" />
          <Text style={styles.historyButtonText}>Fizetési előzmények</Text>
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
  button: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
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
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  historyButtonText: {
    fontSize: 16,
    color: "#2575fc",
    marginLeft: 10,
  },
});

export default Tanulo_KinekAkarszBefizetni;
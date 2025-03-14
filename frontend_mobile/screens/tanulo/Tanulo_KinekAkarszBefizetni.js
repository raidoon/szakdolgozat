import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
const Tanulo_KinekAkarszBefizetni = ({atkuld}) => {
  const navigation = useNavigation();
  return (
    <LinearGradient colors={["#ffffff", "#f0f4ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Válassza ki, hogy kinél fizette be a felvenni kívánt összeget!</Text>
        <Text style={styles.subtitle}>
        Az itt rögzített tranzakciók kizárólag szemléltető jellegűek, és nem vonódnak le a bankkártyájáról!
        </Text>
        {/* FIZETÉS AZ OKTATÓNAK */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Tanuló Pénzügyek", {
              screen: "OktatonakAkarokFizetni",
              params: {atkuld} //tovább adjuk az oktatóshoz
            })
          }
        >
          <LinearGradient
             colors={["#2EC0F9", "#0057FF"]}
            style={styles.gradient}
          >
            <Ionicons name="person" size={30} color="#fff" />
            <Text style={styles.buttonText}>Az oktatónál fizetett</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/*  FIZETÉS AZ AUTÓSISKOLÁNAK */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Tanuló Pénzügyek", {
              screen: "AutosiskolanakAkarokFizetni",
              params: {atkuld} //tovább adjuk az autósiskoláshoz
            })
          }
        >
          <LinearGradient
            colors={["#ff7e5f", "#FF6B6B"]}
            style={styles.gradient}
          >
            <Ionicons name="school" size={30} color="#fff" />
            <Text style={styles.buttonText}>Az autósiskolánál fizetett</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* FIZETÉSI ELŐZMÉNYEK AZ ÖSSZES BEFIZETÉSHEZ !!! */}
        <TouchableOpacity
          style={styles.fizetesiElozmenyekGomb}
          onPress={() => navigation.navigate("Tanuló Pénzügyek", {
            screen: "Tanulo_Befizetesek", 
            params: { atkuld: atkuld }
          })}
          
        >
          <Ionicons
            name="time"
            size={24}
            color="#2575fc"
          />
          <Text style={styles.fizetesiElozmenyekGombText}>Fizetési előzmények</Text>
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
  fizetesiElozmenyekGomb: {
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
  fizetesiElozmenyekGombText: {
    fontSize: 16,
    color: "#2575fc",
    marginLeft: 10,
  },
});

export default Tanulo_KinekAkarszBefizetni;

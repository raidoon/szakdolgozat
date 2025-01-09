import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Ipcim from "../../Ipcim";

const Tanulo_Kezdolap = ({ atkuld }) => {
  console.log("Atküldött adat a bejelentkezés után: ", atkuld);
  const [adatok,setAdatok]=useState([])
  const letoltes = async () => {
    const adat={
      "felhasznalo_id": atkuld.felhasznalo_id,
    };
    const x=await fetch(Ipcim.Ipcim + "/tanuloSUMbefizetes", {
        method: "POST",
        body: JSON.stringify(adat),
        headers: {"Content-type": "application/json; charset=UTF-8"},
    });
    const y=await x.json();
    setAdatok(y)
  }
  useEffect(()=>{
    letoltes();
  },[]);

  return (
    <ScrollView style={styles.egeszOldal}>
      <View style={styles.udvozloView}>
        <Text style={styles.udvozloSzoveg}>Üdvözlünk</Text>
        <Text style={styles.userNev}>{atkuld.tanulo_neve}</Text>
      </View>
      <View style={styles.befizetesContainer}>
        <Text style={styles.befizetesTitle}>Eddigi befizetések</Text>
        <Text style={styles.befizetesOsszeg}>{adatok[0].osszesBefizetes} Ft</Text>
      </View>
      <View style={styles.tranzakcioContainer}>
        <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text>
       
        <View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Vizsga díj</Text>
          <Text style={styles.tranzakciosOsszeg}>-25.0000 Ft</Text>
        </View>
        <View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Órai befizetés</Text>
          <Text style={styles.tranzakciosOsszeg}>-22.000 Ft</Text>
        </View>
      </View>
    </ScrollView>
  );
};
export default Tanulo_Kezdolap;

const styles = StyleSheet.create({
  egeszOldal: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  udvozloView: {
    backgroundColor: "#dfe6e9", //#dfe6e9
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "left",
  },
  udvozloSzoveg: {
    fontSize: 18,
    color: "#636e72", 
    fontWeight: "bold",
  },
  userNev: {
    fontSize: 22,
    color: "#2d3436",
    fontWeight: "bold",
  },
  befizetesContainer: {
    margin: 20,
    backgroundColor: "#8338ec", //"#5A4FCF", //#6c5ce7
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  befizetesTitle: {
    fontSize: 16,
    color: '#fff',
  },
  befizetesOsszeg: {
    fontSize: 24,
    fontWeight: "bold",
    color:'#fff',
    marginTop: 5,
  },
  tranzakcioContainer: {
    margin: 20
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legutobbiTranzakciok: {
    flexDirection: "row",
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
  tranzakciosText: {
    fontSize: 16,
    color: "#2d3436",
  },
  tranzakciosOsszeg: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63031",
  },
});
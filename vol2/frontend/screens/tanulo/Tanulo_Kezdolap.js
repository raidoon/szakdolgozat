import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Tanulo_Kezdolap = ({ atkuld }) => {
  console.log("Atküldött adat a Kezdőlapon: ", atkuld);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Üdvözlünk</Text>
        <Text style={styles.nameText}>{atkuld.tanulo_neve}</Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Eddigi befizetések</Text>
        <Text style={styles.balanceAmount}>47.000 Ft</Text>
      </View>
      <View style={styles.paymentsContainer}>
        <Text style={styles.paymentsTitle}>Legutóbbi Tranzakciók</Text>
       
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>Vizsga díj</Text>
          <Text style={styles.paymentAmount}>-25.0000 Ft</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>Órai befizetés</Text>
          <Text style={styles.paymentAmount}>-22.000 Ft</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Tanulo_Kezdolap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#dfe6e9",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "left",
  },
  welcomeText: {
    fontSize: 18,
    color: "#636e72",
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 22,
    color: "#2d3436",
    fontWeight: "bold",
  },
  balanceContainer: {
    margin: 20,
    backgroundColor: "#6c5ce7",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  balanceTitle: {
    fontSize: 16,
    color: '#fff',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color:'#fff',
    marginTop: 5,
  },
  paymentsContainer: {
    margin: 20
  },
  paymentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentRow: {
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
  paymentText: {
    fontSize: 16,
    color: "#2d3436",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63031",
  },
});

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const FizetesiElozmenyek = ({ navigation }) => {
  // Mock payment history data
  const paymentHistory = [
    {
      id: 1,
      type: "Tanóra díj",
      amount: "7800 Ft",
      date: "2023.10.15",
      status: "completed",
    },
    {
      id: 2,
      type: "Vizsga díj",
      amount: "20000 Ft",
      date: "2023.10.10",
      status: "pending",
    },
    {
      id: 3,
      type: "Tanóra díj",
      amount: "15600 Ft",
      date: "2023.10.05",
      status: "rejected",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />;
      case "pending":
        return <Ionicons name="time" size={20} color="#FFA000" />;
      case "rejected":
        return <Ionicons name="close-circle" size={20} color="#F44336" />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#f0f4ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Fizetési előzmények</Text>
        <Text style={styles.subtitle}>
          Itt láthatod az összes korábbi és folyamatban lévő tranzakciót.
        </Text>

        {paymentHistory.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentType}>{payment.type}</Text>
              {getStatusIcon(payment.status)}
            </View>
            <Text style={styles.paymentAmount}>{payment.amount}</Text>
            <Text style={styles.paymentDate}>{payment.date}</Text>
          </View>
        ))}
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
    marginBottom: 20,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  paymentType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  paymentAmount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  paymentDate: {
    fontSize: 14,
    color: "#999",
  },
});

export default FizetesiElozmenyek;
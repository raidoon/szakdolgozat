import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Alerts = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Hiba!</Text>
          <Text style={styles.alertMessage}>
            A befizetni kívánt összeg nem lehet 0!
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.okButtonText}>Értem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Alerts;

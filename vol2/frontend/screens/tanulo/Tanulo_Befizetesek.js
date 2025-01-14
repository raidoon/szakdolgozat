import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

const Tanulo_Befizetesek = () => {
  const [amount, setAmount] = useState("");
  const [showNumberPad, setShowNumberPad] = useState(false);

  const handleNumberPress = (num) => {
    setAmount((prev) => prev + num);
  };

  const handleClear = () => {
    setAmount("");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input Section */}
      <KeyboardAvoidingView style={styles.topSection}>
        <Text style={styles.title}>Add meg az összeget</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowNumberPad(true)}
        >
          <Text style={styles.inputText}>
            {amount ? `${amount} Ft` : "kattints a beíráshoz"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.subText}>...</Text>
        <Text style={styles.subAmount}>{amount || "0.00"} Ft</Text>
      </KeyboardAvoidingView>

      {/* --------------------------------------SZÁMOLÓGÉP---------------------------------------- */}
      {showNumberPad && (
        <View style={styles.numberPad}>
          <View style={styles.numberRow}>
            {["1", "2", "3"].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleNumberPress(num)}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberRow}>
            {["4", "5", "6"].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleNumberPress(num)}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberRow}>
            {["7", "8", "9"].map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numberButton}
                onPress={() => handleNumberPress(num)}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.numberRow}>
            <TouchableOpacity style={styles.numberButton} onPress={handleClear}>
              <Text style={styles.numberText}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => handleNumberPress("0")}
            >
              <Text style={styles.numberText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => setShowNumberPad(false)}
            >
              <Text style={styles.numberText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓS LISTA IDE (flatlist legyen)---------------------------------------- */}
      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓ---------------------------------------- */}
      <View style={styles.tranzakcioContainer}>
        <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text>

        <View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View>
        <View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    minWidth: "80%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "italic",
    color: "grey",
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: "#777",
  },
  subAmount: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 5,
    color: "#4CAF50",
  },
  numberPad: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  numberButton: {
    backgroundColor: "#e0e0e0",
    padding: 20,
    borderRadius: 10,
    minWidth: 70,
    alignItems: "center",
  },
  numberText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
  tranzakcioContainer: {
    margin: 20,
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

export default Tanulo_Befizetesek;

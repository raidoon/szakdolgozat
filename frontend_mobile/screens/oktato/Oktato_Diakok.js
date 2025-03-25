import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";

export default function Oktato_Diakok({ atkuld }) {
  const [adatok, setAdatok] = useState([]);
  const navigation = useNavigation();
  console.log(atkuld);

  const letoltes = async () => {
    var adat = {
      "oktatoid": atkuld.oktato_id
    }
    const x = await fetch(Ipcim.Ipcim + "/aktualisDiakok/levizsgazottDiakok", {
      method: "POST",
      body: JSON.stringify(adat),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    
    console.log(x);
    const y = await x.json();
    setAdatok(y);
    alert(JSON.stringify(y));
    console.log(y);
  };

  useEffect(() => {
    letoltes();
  }, []);

  const kattaktual = (tanulo) => {
    navigation.navigate("Oktato_AKTUALIS", { tanulo });
  };
  
  const kattlevi = (tanulo) => {
    navigation.navigate("Oktato_LEVIZSGAZOTT", { tanulo });
  };

  return (
    <View style={styles.container}>
      {/* Header matching Kezdolap */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diákok</Text>
        <FlatList
        data={adatok}
        
      />
      </View>

      
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Oktato_AKTUALIS", { atkuld })}
        >
          <Text style={styles.buttonText}>Aktuális Diákok Adatai</Text>
          <View style={styles.greenCircle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Oktato_LEVIZSGAZOTT", { atkuld })}
        >
          <Text style={styles.secondaryButtonText}>Levizsgázott Diákok Adatai</Text>
          <View style={styles.blueCircle} />
        </TouchableOpacity>
      </View>

     
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5FBFF", // Light blue background
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#E0F7FA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#00796B", // Dark teal/green
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    textAlign: "center",
    color: "#4CAF50", // Green color
  },
  buttonGroup: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#4CAF50", // Green
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#388E3C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: "#E8F5E9", // Very light green
    padding: 30,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C8E6C9", // Light green border
    position: 'relative',
    overflow: 'hidden',
  },
  greenCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    right: -15,
    top: -15,
  },
  blueCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    right: -15,
    top: -15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  secondaryButtonText: {
    color: "#2E7D32", // Dark green
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  }
});
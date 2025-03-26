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
      
      <View style={styles.header}>
        <Text style={styles.headerCim}>Diákok</Text>
        <FlatList
        data={adatok}
        
      />
      </View>

      
      <View style={styles.gombok}>
        <TouchableOpacity
          style={styles.elsoGomb}
          onPress={() => navigation.navigate("Oktato_AKTUALIS", { atkuld })}
        >
          <Text style={styles.elsogombText}>Aktuális Diákok Adatai</Text>
          <View style={styles.zold} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.masodikGomb}
          onPress={() => navigation.navigate("Oktato_LEVIZSGAZOTT", { atkuld })}
        >
          <Text style={styles.masodikgombText}>Levizsgázott Diákok Adatai</Text>
          <View style={styles.kek} />
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
  headerCim: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#00796B", // Dark teal/green
  },
  gombok: {
    marginBottom: 20,
  },
  elsoGomb: {
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
  masodikGomb: {
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
  zold: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    right: -15,
    top: -15,
  },
  kek: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    right: -15,
    top: -15,
  },
  elsogombText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  masodikgombText: {
    color: "#2E7D32", // Dark green
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  }
});
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';

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
      <LinearGradient colors={['#f5f7fa', '#e4f2fe']} style={styles.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerCim}>Diákkezelés</Text>
        <Text style={styles.headerSubtitle}>Válassz a diákok listázásához</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_AKTUALIS", { atkuld })}
        >
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="school" size={32} color="white" style={styles.icon} />
            <Text style={styles.cardTitle}>Aktuális Diákok</Text>
            <Text style={styles.cardSubtitle}>Megtekintés és kezelés</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_LEVIZSGAZOTT", { atkuld })}
        >
          <LinearGradient
            colors={['#2196F3', '#1565C0']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="assignment-turned-in" size={32} color="white" style={styles.icon} />
            <Text style={styles.cardTitle}>Levizsgázott Diákok</Text>
            <Text style={styles.cardSubtitle}>Előzmények megtekintése</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#607D8B',
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  headerCim: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#263238",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#607D8B",
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    height: 120,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 20,
    opacity: 0.3,
  },
});
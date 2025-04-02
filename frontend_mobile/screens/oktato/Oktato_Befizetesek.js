import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function Oktato_Befizetesek({ atkuld }) {
  const [adatok, setAdatok] = useState([]);
  const navigation = useNavigation();
  console.log(atkuld);

  const letoltes = async () => {
    var adat = {
      "oktatoid": atkuld.oktato_id
    }
    const x = await fetch(Ipcim.Ipcim + "/", {
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

  const katt = (tanulo) => {
    navigation.navigate("Oktato_BefizetesRogzites", { tanulo });
  };

  const kattaktual = (tanulo) => {
    navigation.navigate("Oktato_ATBefizetesek", { tanulo });
  };

  const kattmaradek = (tanulo) => {
    navigation.navigate("Oktato_MegerositesrevaroFizetes", { tanulo });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f5faf6', '#e0f2e1']} style={styles.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Befizetés Kezelés</Text>
        <Text style={styles.headerSubtitle}>Diákok fizetési tranzakciói</Text>
      </View>

      <FlatList 
        data={adatok}
        style={styles.list}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Action Cards */}
      <View style={styles.cardsContainer}>
        {/* New Payment */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_BefizetesRogzites", { atkuld })}
        >
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="add-circle" size={28} color="white" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Új befizetés</Text>
              <Text style={styles.cardSubtitle}>Rögzítés</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* View Payments */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_ATBefizetesek", { atkuld })}
        >
          <LinearGradient
            colors={['#66BB6A', '#388E3C']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="list-alt" size={28} color="white" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Diák befizetések</Text>
              <Text style={styles.cardSubtitle}>Teljes lista</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Pending Payments */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_MegerositBefizetes", { atkuld })}
        >
          <LinearGradient
            colors={['#8BC34A', '#689F38']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="pending-actions" size={28} color="white" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Jóváhagyásra vár</Text>
              <Text style={styles.cardSubtitle}>Függő tranzakciók</Text>
            </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32', // Dark green
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#689F38', // Medium green
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    padding: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardText: {
    flex: 1,
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
});
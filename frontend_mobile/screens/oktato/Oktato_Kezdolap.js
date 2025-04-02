import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Oktato_Kezdolap({ atkuld }) {
  const [adatok, setAdatok] = useState([]);
  const [kovetkezoOra, setKovetkezoOra] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const letoltes = async () => {
    try {
      const response = await fetch(Ipcim.Ipcim + "/aktualisDiakok", {
        method: "POST",
        body: JSON.stringify({ oktatoid: atkuld.oktato_id }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
      const data = await response.json();
      setAdatok(data);
    } catch (error) {
      console.error("Hiba az adatok letöltésekor:", error);
    }
  };

  const kovetkezoOraLetoltes = async () => {
    try {
      const response = await fetch(Ipcim.Ipcim + "/koviOra", {
        method: "POST",
        body: JSON.stringify({ oktato_id: atkuld.oktato_id }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
      const data = await response.json();
      if (data.length > 0) {
        setKovetkezoOra(data[0].ora_datuma);
      }
    } catch (error) {
      console.error("Hiba a következő óra letöltésekor:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await letoltes();
    await kovetkezoOraLetoltes();
    setRefreshing(false);
  };

  useEffect(() => {
    letoltes();
    kovetkezoOraLetoltes();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };


  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f5f7fa', '#e4f2fe']} style={styles.background} />
      
      {/* Header */}
      <View >
        <Text style={styles.welcomeText}>Üdvözlünk</Text>
        <Text style={styles.teacherName}>{atkuld?.oktato_neve || "Kedves Oktató"}</Text>
        <View style={styles.headerDivider} />
      </View>

      <FlatList
        data={adatok}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#4CAF50"
            colors={["#4CAF50"]} 
          />
        }
        style={styles.list}
      />

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        {/* Next Lesson Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_KovetkezoOra", { atkuld })}
        >
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="time" size={28} color="white" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Következő óra</Text>
              <Text style={styles.cardSubtitle}>
                {kovetkezoOra ? formatDateTime(kovetkezoOra) : "Nincs rögzített óra"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Lessons Management Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
        >
          <LinearGradient
            colors={['#2196F3', '#1565C0']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="calendar" size={28} color="white" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Órák kezelése</Text>
              <Text style={styles.cardSubtitle}>Diákok órái</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Payments Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Oktato_MegerositBefizetes", { atkuld })}
        >
          <LinearGradient
            colors={['#00796B', '#00796B']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="cash" size={28} color="white" style={styles.cardIcon} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Befizetések</Text>
              <Text style={styles.cardSubtitle}>Kezeletlen tranzakciók</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
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
  welcomeText: {
    padding:20,
    fontSize: 18,
    color: '#607D8B',
    textAlign: 'center',
  },
  teacherName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#263238',
    textAlign: 'center',
    marginTop: 4,
  },
  headerDivider: {
    height: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
    width: '40%',
    alignSelf: 'center'
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
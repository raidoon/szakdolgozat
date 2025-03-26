import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";
import Ionicons from '@expo/vector-icons/Ionicons';

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerCim}>Üdvözlünk</Text>
        <Text style={styles.oktatoNev}>{atkuld?.oktato_neve || "Kedves Oktató"}</Text>
      </View>

      <FlatList
        data={adatok}
        
        keyExtractor={(item) => item.id.toString()}
        
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
        }
      />

      {/* Kártyák */}
      <View style={styles.kartyaContainer}>
        {/* Következő óra kártya */}
        <TouchableOpacity 
          style={[styles.Kartyak, styles.kovetkezoOraKartya]}
          onPress={() => navigation.navigate("Oktato_KovetkezoOra", { atkuld })}
        >
          <View style={styles.kartyaContent}>
            <View>
              <Text style={styles.kartyaLabel}>Következő óra</Text>
              <Text style={styles.kartyaValue}>
                {kovetkezoOra ? formatDateTime(kovetkezoOra) : "Nincs rögzített óra"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
          </View>
          <View style={styles.zold} />
        </TouchableOpacity>

        {/* Órák kártya */}
        <TouchableOpacity
          style={[styles.Kartyak, styles.orakKartya]}
          onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
        >
          <View style={styles.kartyaContent}>
            <View>
              <Text style={styles.kartyaLabel}>Órák</Text>
              <Text style={styles.kartyaValue}>Módosítható órák</Text>
            </View>
            
          </View>
          <View style={styles.kek} />
        </TouchableOpacity>

        {/* Pénz kártya*/}
        <TouchableOpacity
          style={[styles.Kartyak, styles.penzKartya]}
          onPress={() => navigation.navigate("Oktato_MegerositBefizetes", { atkuld })}
        >
          <View style={styles.kartyaContent}>
            <View>
              <Text style={styles.kartyaLabel}>Befizetések</Text>
              <Text style={styles.kartyaValue}>Befizetések jóváhagyása</Text>
            </View>
            
          </View>
          <View style={styles.zoldeskek} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFF',
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 15,
    shadowColor: '#E1F5FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerCim: {
    fontSize: 22,
    color: '#78909C',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  oktatoNev: {
    fontSize: 26,
    color: '#00796B',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    marginTop: 5,
  },
  kartyaContainer: {
    marginBottom: 15,
  },
  Kartyak: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  kovetkezoOraKartya: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  orakKartya: {
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  penzKartya: {
    borderLeftWidth: 5,
    borderLeftColor: '#00838F',
  },
  kartyaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  kartyaLabel: {
    fontSize: 14,
    color: '#78909C',
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },
  kartyaValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  zold: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    right: -20,
    top: -20,
  },
  kek: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    right: -20,
    top: -20,
  },
  zoldeskek: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 131, 143, 0.1)',
    right: -20,
    top: -20,
  }
});
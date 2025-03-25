import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";

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


  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.nev}</Text>
      <Text style={styles.itemEmail}>{item.email}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Üdvözlünk</Text>
        <Text style={styles.teacherName}>{atkuld?.oktato_neve || "Kedves Oktató"}</Text>
      </View>

      <FlatList
        data={adatok}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
        }
      />


      {/* Action Cards */}
      <View style={styles.cardsContainer}>
        {/* Next Lesson Card */}
        <TouchableOpacity 
          style={[styles.actionCard, styles.nextLessonCard]}
          onPress={() => navigation.navigate("Oktato_KovetkezoOra", { atkuld })}
        >
          <Text style={styles.cardLabel}>Következő óra</Text>
          <Text style={styles.cardValue}>
            {kovetkezoOra ? formatDateTime(kovetkezoOra) : "Nincs rögzített óra"}
          </Text>
          <View style={styles.greenCircle} />
        </TouchableOpacity>

        {/* Modifiable Lessons Card */}
        <TouchableOpacity
          style={[styles.actionCard, styles.modifiableCard]}
          onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
        >
          <Text style={styles.cardLabel}>orak</Text>
          <Text style={styles.cardValue}>Módosítható órák</Text>
          <View style={styles.blueCircle} />
        </TouchableOpacity>

        {/* Payments Card */}
        <TouchableOpacity
          style={[styles.actionCard, styles.paymentCard]}
          onPress={() => navigation.navigate("Oktato_MegerositesrevaroFizetes", { atkuld })}
        >
          <Text style={styles.cardLabel}>befizuk</Text>
          <Text style={styles.cardValue}>Befizetések</Text>
          <View style={styles.tealCircle} />
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
  headerTitle: {
    fontSize: 22,
    color: '#78909C',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  teacherName: {
    fontSize: 26,
    color: '#00796B',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    marginTop: 5,
  },
  cardsContainer: {
    marginBottom: 15,
  },
  actionCard: {
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
  nextLessonCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  modifiableCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
  },
  paymentCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#00838F',
  },
  cardLabel: {
    fontSize: 14,
    color: '#78909C',
    fontFamily: 'Inter-Medium',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  nextLessonCard: {
    borderLeftColor: '#4CAF50',
  },
  greenCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    right: -20,
    top: -20,
  },
  blueCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    right: -20,
    top: -20,
  },
  tealCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 131, 143, 0.1)',
    right: -20,
    top: -20,
  }
});
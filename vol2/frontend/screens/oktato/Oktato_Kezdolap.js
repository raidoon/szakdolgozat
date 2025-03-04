import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Oktato_Styles from "../../Oktato_Styles";
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
      <Text style={styles.itemText}>{item.nev}</Text>
      <Text style={styles.itemText}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kezdőlap</Text>
      <Text style={styles.welcomeText}>{atkuld ? `Üdvözlünk: ${atkuld.oktato_neve}!` : "Nincs adat"}</Text>

      <FlatList
        data={adatok}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Oktato_KovetkezoOra", { atkuld })}
      >
        <Text style={styles.buttonText}>
          Következő Óra: {kovetkezoOra ? formatDateTime(kovetkezoOra) : "Még nincs rögzített óra"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
      >
        <Text style={styles.buttonText}>Megerősítésre váró órák</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroFizetes", { atkuld })}
      >
        <Text style={styles.buttonText}>Jóváhagyásra váró befizetések</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  list: {
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

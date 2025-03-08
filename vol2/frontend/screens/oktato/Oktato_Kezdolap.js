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
      <Text style={styles.title}>Kezdőlap</Text>
      <Text style={styles.welcomeText}>{atkuld ? `Üdvözlünk, ${atkuld.oktato_neve}!` : "Nincs adat"}</Text>

      <FlatList
        data={adatok}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
        }
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Oktato_KovetkezoOra", { atkuld })}
      >
        <Text style={styles.buttonText}>
          Következő Óra: {kovetkezoOra ? formatDateTime(kovetkezoOra) : "Még nincs rögzített óra"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroOrak", { atkuld })}
      >
        <Text style={styles.secondaryButtonText}>Még módosítható órák</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tertiaryButton}
        onPress={() => navigation.navigate("Oktato_MegerositesrevaroFizetes", { atkuld })}
      >
        <Text style={styles.tertiaryButtonText}>Jóváhagyásra váró befizetések</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#2C3E50",
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    marginBottom: 24,
    textAlign: "center",
    color: "#4CAF50", // Green color for welcome text
  },
  list: {
    marginBottom: 24,
  },
  itemContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  itemName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#2C3E50",
  },
  itemEmail: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#7F8C8D",
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#4CAF50", // Green color for primary button
    padding: 30,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#4CAF50", // Green shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50", // Green border for secondary button
  },
  tertiaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9ECEF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  secondaryButtonText: {
    color: "#4CAF50", // Green text for secondary button
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  tertiaryButtonText: {
    color: "#2C3E50",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
});
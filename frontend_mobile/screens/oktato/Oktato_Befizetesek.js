import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ipcim from "../../Ipcim";

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Befizetések</Text>
      </View>

      <FlatList data={adatok}/>
      {/* kártyák */}
      <View style={styles.kartyakContainer}>
        <TouchableOpacity
          style={[styles.Kartyak, styles.elsoKartya]}
          onPress={() => navigation.navigate("Oktato_BefizetesRogzites", { atkuld })}
        >
          <Text style={styles.kartyaCim}>Új befizetés hozzáadása</Text>
          <Text style={styles.kartyaSzoveg}>Rögzítés</Text>
          <View style={styles.zold} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.Kartyak, styles.masodikKartya]}
          onPress={() => navigation.navigate("Oktato_ATBefizetesek", { atkuld })}
        >
          <Text style={styles.kartyaCim}>Diákok Befizetései</Text>
          <Text style={styles.kartyaSzoveg}>Megtekintés</Text>
          <View style={styles.kek} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.Kartyak, styles.harmadikKartya]}
          onPress={() => navigation.navigate("Oktato_MegerositBefizetes", { atkuld })}
        >
          <Text style={styles.kartyaCim}>Jóváhagyásra váró befizetések</Text>
          <Text style={styles.kartyaSzoveg}>Kezeletlen tranzakciók</Text>
          <View style={styles.zoldeskek} />
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
  kartyakContainer: {
    marginBottom: 20,
  },
  Kartyak: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#B2DFDB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  elsoKartya: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50", // Green
  },
  masodikKartya: {
    borderLeftWidth: 5,
    borderLeftColor: "#2196F3", // Blue
  },
  harmadikKartya: {
    borderLeftWidth: 5,
    borderLeftColor: "#00838F", // Teal
  },
  kartyaCim: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#00796B", // Dark teal
    marginBottom: 4,
  },
  kartyaSzoveg: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#78909C", // Gray-blue
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
  zoldeskek: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 131, 143, 0.1)',
    right: -15,
    top: -15,
  },
});

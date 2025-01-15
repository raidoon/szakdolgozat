import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Tanulo_Befizetesek() {
  const [osszeg, setOsszeg] = useState("");
  const [szamologepLathatoe, setSzamologepLathatoe] = useState(false);

  {/* --------------------------------------SZÁMOLÓGÉP KINÉZET ÉS FUNKCIÓ---------------------------------------- */}
  const osszegMegnyomas = () => {
    setSzamologepLathatoe(!szamologepLathatoe);
  };
  const szamologepGombNyomas = (key) => {
    if (key === "torles") {
      setOsszeg(osszeg.slice(0, -1));
    } else if (key === "C") {
      setOsszeg("");
    } else {
      setOsszeg(osszeg + key);
    }
  };
  const szamologepBetoltes = () => (
    <View style={styles.szamologepView}>
      {[...Array(9).keys()].map((_, i) => (
        <TouchableOpacity
          key={i + 1}
          onPress={() => szamologepGombNyomas((i + 1).toString())}
          style={styles.szamologepGomb}
        >
          <Text style={styles.szamologepSzoveg}>{i + 1}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => szamologepGombNyomas("C")}
        style={styles.szamologepGomb}
      >
        <Text style={styles.szamologepSzoveg}>C</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => szamologepGombNyomas("0")}
        style={styles.szamologepGomb}
      >
        <Text style={styles.szamologepSzoveg}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => szamologepGombNyomas("torles")}
        style={styles.szamologepGomb}
      >
        <Text style={styles.szamologepSzoveg}>⌫</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
      {/* --------------------------------------SZÁMOLÓGÉP---------------------------------------- */}
      <Text style={styles.cim}>Add meg a befizetett összeget</Text>
      <TouchableOpacity onPress={osszegMegnyomas}>
        <Text style={styles.osszegBeiras}>
          {osszeg ? `${osszeg} Ft` : "0.00 Ft"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.balanceInfo}>felvétel az eddigi tranzakciókhoz</Text>
      <Text style={styles.currentBalance}>Felvenni kívánt összeg: 0 Ft</Text> 
      <TouchableOpacity style={styles.felvetelGomb}>
        <Text style={styles.felvetelGombSzoveg}>Összeg felvétele</Text>
      </TouchableOpacity>
      {szamologepLathatoe && szamologepBetoltes()}
      </View>
      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓS LISTA IDE (flatlist legyen)---------------------------------------- */}
      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓ---------------------------------------- */}
      <View style={styles.tranzakcioContainer}>
        <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text>

        <View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View>
        <View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View><View style={styles.legutobbiTranzakciok}>
          <Text style={styles.tranzakciosText}>Tanóra díj</Text>
          <Text style={styles.tranzakciosOsszeg}> - 0 Ft</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f0fa",
    alignItems: "center",
    padding: 20,
  },
  cim: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5c4ce3",
    marginBottom: 20,
  },
  osszegBeiras: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5c4ce3",
    textAlign: "center",
    marginBottom: 10,
  },
  balanceInfo: {
    fontSize: 16,
    color: "#8e8e93",
    marginBottom: 5,
  },
  currentBalance: {
    fontSize: 18,
    color: "#5c4ce3",
    marginBottom: 30,
  },
  felvetelGomb: {
    backgroundColor: "#5c4ce3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  felvetelGombSzoveg: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  szamologepView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  szamologepGomb: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderColor: "#dcdcdc",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  szamologepSzoveg: {
    fontSize: 24,
    color: "#5c4ce3",
    fontWeight: "bold",
  },
  tranzakcioContainer: {
    margin: 20,
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legutobbiTranzakciok: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  tranzakciosText: {
    fontSize: 16,
    color: "#2d3436",
  },
  tranzakciosOsszeg: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63031",
  },
});
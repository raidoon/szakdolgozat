import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";
import Penz from '../../assets/bitcoin-cash-money.svg';

const Tanulo_Kezdolap = ({ atkuld }) => {
  const navigation = useNavigation();
  const [sumBefizetes, setSumBefizetes] = useState([]);
  const [sumTartozas, setSumTartozas] = useState([]);
  const [befizetLista, setBefizetLista] = useState([]);
  const [koviOra, setKoviOra] = useState([]);
  const [betolt, setBetolt] = useState(true);
  const [hiba, setHiba] = useState(null);
  const adatokBetoltese = async () => {
    try {
      const adat = {
        felhasznalo_id: atkuld.felhasznalo_id,
      };
      const oraAdat = {
        ora_diakja: atkuld.tanulo_id,
      };
      if (oraAdat) {
        const ora = await fetch(Ipcim.Ipcim + "/tanuloKovetkezoOraja", {
          method: "POST",
          body: JSON.stringify(oraAdat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const oraResponse = await ora.json();
        setKoviOra(oraResponse);
      }
      if (adat) {
        const osszeg = await fetch(Ipcim.Ipcim + "/tanuloSUMbefizetes", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const befizetesek = await fetch(Ipcim.Ipcim + "/befizetesListaT", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const tartozas = await fetch(Ipcim.Ipcim + "/tanuloSUMtartozas", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (!osszeg.ok || !befizetesek.ok || !tartozas.ok) {
          throw new Error("Hiba történt a fizetések betöltésekor!");
        }
        const osszegResponse = await osszeg.json();
        const befizetesekResponse = await befizetesek.json();
        const tartozasResponse = await tartozas.json();

        setSumBefizetes(osszegResponse);
        setBefizetLista(befizetesekResponse);
        setSumTartozas(tartozasResponse);
      }
    } catch (err) {
      setHiba(err.message);
    } finally {
      setBetolt(false);
    }
  };
  useEffect(() => {
    adatokBetoltese();
  }, []);
  if (betolt) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Adatok betöltése folyamatban...</Text>
      </View>
    );
  }
  const koviOraFormazasa = (adatBresponseJSON) => {
    const datum = new Date(adatBresponseJSON);
    const honapNevekMagyarul = [
      "január",
      "Február",
      "Március",
      "Április",
      "Május",
      "Június",
      "Július",
      "Augusztus",
      "Szeptember",
      "Október",
      "November",
      "December",
    ];
    const nap = datum.getDate();
    const honap = honapNevekMagyarul[datum.getMonth()].toUpperCase();
    const ora = datum.getHours();
    const perc = datum.getMinutes().toString().padStart(2, "0");
    return `${honap} ${nap} - ${ora}:${perc} óra`;
  };
  if (hiba) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Hiba: {hiba}</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.egeszOldal}>
      {/* ---------------------------------------ÜDVÖZLÉS---------------------------------------- */}
      <View style={styles.udvozloView}>
        <Text style={styles.udvozloSzoveg}>Üdvözöljük!</Text>
        <Text style={styles.userNev}>{atkuld.tanulo_neve}</Text>
      </View>
      {/* ----------------------------------BEFIZETÉSEK---------------------------------------- */}
      <TouchableOpacity
        style={styles.befizetesContainer}
        onPress={() => navigation.navigate("Tanulo_Befizetesek")}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.befizetesTitle}>Eddig befizetve:</Text>
            <Text style={styles.befizetesOsszeg}>
              {sumBefizetes[0].osszesBefizetes === null
                ? "0 Ft"
                : `${sumBefizetes[0].osszesBefizetes} Ft`}
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={30} color="#fff" />
        </View>
      </TouchableOpacity>
      {/* ----------------------------------TARTOZÁSOK---------------------------------------- */}
      <View style={styles.tartozasContainer}>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.tartozasTitle}>Tartozás/elfogadásra váró befizetés:</Text>
            <Text style={styles.tartozasOsszeg}>
              {sumTartozas[0].osszesTartozas === null
                ? "0 Ft"
                : `${sumTartozas[0].osszesTartozas} Ft`}
            </Text>
          </View>
        </View>
      </View>
      {/* --------------------------------------KÖVETKEZŐ ÓRA---------------------------------------- */}
      <TouchableOpacity
        style={styles.oraContainer}
        onPress={() => navigation.navigate("Tanulo_Datumok")}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.oraTitle}>Következő óra időpontja:</Text>
            <Text style={styles.oraOsszeg}>
              {koviOra.length > 0
                ? koviOraFormazasa(koviOra[0].ora_datuma)
                : "Egyelőre még nincs beírva következő óra!"}
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={30} color="#6A5AE0" />
        </View>
      </TouchableOpacity>
      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓ---------------------------------------- */}
      <View style={styles.tranzakcioContainer}>
        <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text>
        {befizetLista.length === 0 ? (
          <View style={{alignItems: 'center'}}>

            <Penz width={100} height={100}/>
        
            <Text style={styles.nincsOra}>Itt fognak megjelenni a legutóbbi tranzakciók, de egyelőre még nem történt befizetés!</Text>
          </View>
        ) : (
          befizetLista
            .sort((a, b) => new Date(b.befizetesek_ideje) - new Date(a.befizetesek_ideje))
            .slice(0, 3)
            .map((item) => (
              <View style={styles.legutobbiTranzakciok} key={item.befizetesek_id}>
                <Text style={styles.tranzakciosText}>
                  {item.befizetesek_tipusID == 1 ? "Tanóra díj" : "Vizsga díj"}
                </Text>
                <Text style={styles.tranzakciosOsszeg}>- {item.befizetesek_osszeg} Ft</Text>
              </View>
            ))
        )}
      </View>
    </ScrollView>
  );
};
export default Tanulo_Kezdolap;

const styles = StyleSheet.create({
  egeszOldal: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    height: '100%',
    paddingTop: 0
  },
  udvozloView: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingTop: 30
  },
  udvozloSzoveg: {
    fontSize: 20,
    color: "#6A5AE0",
    fontWeight: "600",
    paddingTop: 20
  },
  userNev: {
    fontSize: 24,
    color: "#2d3436",
    fontWeight: "700",
    marginTop: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  befizetesContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#6A5AE0",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  befizetesTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  befizetesOsszeg: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 5,
  },
  tartozasContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#FF6B6B",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tartozasTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  tartozasOsszeg: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 5,
  },
  oraContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  oraTitle: {
    fontSize: 16,
    color: "#6A5AE0",
    fontWeight: "500",
  },
  oraOsszeg: {
    fontSize: 20,
    color: "#2d3436",
    fontWeight: "600",
    marginTop: 5,
  },
  tranzakcioContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tranzakcioTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 15,
    marginTop: 20
  },
  nincsOra: {
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
  legutobbiTranzakciok: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tranzakciosText: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "500",
  },
  tranzakciosOsszeg: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
});
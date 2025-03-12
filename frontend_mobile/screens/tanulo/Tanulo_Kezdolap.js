import {View,Text,StyleSheet,ScrollView,TouchableOpacity,RefreshControl} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import Styles from "../../Styles";
import Ipcim from "../../Ipcim";
import { ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const Tanulo_Kezdolap = ({ atkuld }) => {
  const navigation = useNavigation();
  const [frissites, setFrissites] = useState(false); //https://reactnative.dev/docs/refreshcontrol
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
  };//-------------------------------------------------------------  OLDAL FRISSÍTÉSE
    const frissitesKozben = useCallback(() => {
      setFrissites(true);
      setBetolt(true);
      setTimeout(() => {
        adatokBetoltese();
        setFrissites(false);
        setBetolt(false);
      }, 2000);
    }, []);
  useEffect(() => {
    adatokBetoltese();
  }, []);//------------------------------------------------------- MONDAT TÖMB ------------------------
  const vezetoMondatok = [
    "Nem a gyorsaság, hanem a stílus a lényeg!",
    "A gyorsulás csak akkor menő, ha a kanyar is jól sikerül.",
    "Ne csak gyorsan, hanem okosan is vezess!",
    "A kressz már megvan, úgyhogy jöhet a vezetés!",
    "A legjobb sofőr mindig tudja, hogy mikor kell lassítani.",
    "A jó vezető nem hajt, hanem uralja az utat.",
    "Vezetni menő, de biztonságban maradni még menőbb.",
    "A legjobb vezetők nem a gyorsulásban, hanem az irányításban jeleskednek.",
    "A volán mögött minden döntés számít – válaszd meg okosan!",
    "A forgalom nem akadály, hanem kihívás. Kezeld ügyesen!",
    "Ne csak a gázt pörgesd, hanem az agyad is!", //nem gáz hanem izé az a másik mutató
  ];
  const maiNap = new Date().getDate();
  const kivalasztottMondat =
    vezetoMondatok[(maiNap - 1) % vezetoMondatok.length];
  if (betolt) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.betoltesText}>Adatok betöltése folyamatban...</Text>
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
    <ScrollView
      style={styles.egeszOldal}
      refreshControl={
        <RefreshControl refreshing={frissites} onRefresh={frissitesKozben} />
      }
    >
      {/* ---------------------------------------ÜDVÖZLÉS---------------------------------------- */}
      <View style={styles.udvozloView}>
        <Text style={styles.udvozloSzoveg}>Üdvözöljük!</Text>
        <Text style={styles.userNev}>{atkuld.tanulo_neve}</Text>
      </View>
      {/* ----------------------------------BEFIZETÉSEK---------------------------------------- */}
      <TouchableOpacity
        style={styles.befizetesContainer}
        onPress={() => navigation.navigate("Tanulo_KinekAkarszBefizetni")}
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
            <Text style={styles.tartozasTitle}>
              Tartozás/elfogadásra váró befizetés:
            </Text>
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
          <Ionicons name="chevron-forward-outline" size={30} color="#0096FF" />
        </View>
      </TouchableOpacity>
       {/*----------------------------------- NAPONTA VÁLTOZÓ MONDATOK RÉSZE -------------------------------- */}
       <View style={styles.tranzakcioContainer}>
       <Text style={styles.tranzakcioTitle}>Napi jótanács:</Text>
       </View>
       <LinearGradient
        colors={["#6A5AE0", "#2EC0F9"]}
        start={{ x: 0, y: 0 }} // színátmenet iránya
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 2, // szegély
          marginHorizontal: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 5,
          marginTop: 0,
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 18,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontStyle: "italic",
              color: "#333",
              fontWeight: "500",
            }}
          >
            {kivalasztottMondat} 🚗💨
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};
export default Tanulo_Kezdolap;

const styles = StyleSheet.create({
  betoltesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  egeszOldal: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    height: "100%",
    paddingTop: 0,
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
    paddingTop: 30,
  },
  udvozloSzoveg: {
    fontSize: 20,
    color: "#0057FF",
    fontWeight: "600",
    paddingTop: 20,
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
    backgroundColor: "#0096FF",
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
    color: "#0096FF",
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
    marginTop: 20,
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

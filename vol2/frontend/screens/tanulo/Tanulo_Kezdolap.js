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

const Tanulo_Kezdolap = ({ atkuld }) => {
  const navigation = useNavigation();
  console.log("Atküldött adat a bejelentkezés után: ", atkuld);
  const [sumBefizetes, setSumBefizetes] = useState([]);
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
        ora_diakja: atkuld.ora_diakja,
      }
      if(oraAdat){
        //---------- a következő óra időpontja
        const ora = await fetch(Ipcim.Ipcim + "/tanuloKovetkezoOraja", {
          method: "POST",
          body: JSON.stringify(oraAdat),
          headers: {"Content-type": "application/json; charset=UTF-8" },
        });
        const oraResponse = await ora.json();
        setKoviOra(oraResponse);
        console.log("következő óra: ", oraResponse);
      }
      if (adat) {  
        //---------- eddigi befizetések összege
        const osszeg = await fetch(Ipcim.Ipcim + "/tanuloSUMbefizetes", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        //----------- az összes eddigi befizetés listája
        const befizetesek = await fetch(Ipcim.Ipcim + "/befizetesListaT", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        //----------- ellenőrzések
        if (!osszeg.ok || !befizetesek.ok) {
          throw new Error("Hiba történt a fizetések betöltésekor!");
        }
        const osszegResponse = await osszeg.json();
        const befizetesekResponse = await befizetesek.json();

        setSumBefizetes(osszegResponse);
        setBefizetLista(befizetesekResponse);
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
  //---------------------------------- ADATOK BETÖLTÉSE
  if (betolt) {
    return (
      <View style={Styles.bejelentkezes_Container}>
        <Text>Adatok betöltése folyamatban...</Text>
      </View>
    );
  }
  //---------------------------------- DÁTUM FORMÁZÁSA AZ ÓRÁHOZ
  const koviOraFormazasa = (adatBresponseJSON) => {
    const datum = new Date(adatBresponseJSON);
    // Külön formázott dátum (pl. JANUÁR 31)
    const honapNevekMagyarul = [
      'január', 'Február', 'Március', 'Április', 'Május', 'Június',
      'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ];
    const nap = datum.getDate();
    const honap = honapNevekMagyarul[datum.getMonth()].toUpperCase();
    // Külön formázott idő (pl. 7:00)
    const ora = datum.getHours();
    const perc = datum.getMinutes().toString().padStart(2, '0'); // 2 számjegyre formázva
    return `${honap} ${nap} - ${ora}:${perc} óra`;
  };
  //-------------------------------- HIBA KEZELÉS
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
            <Text style={styles.befizetesTitle}>Eddigi befizetései</Text>
            <Text style={styles.befizetesOsszeg}>
              {sumBefizetes[0].osszesBefizetes} Ft
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={40} color="white"/>
        </View>
      </TouchableOpacity>
      {/* --------------------------------------KÖVETKEZŐ ÓRA---------------------------------------- */}
      <TouchableOpacity
        style={styles.oraContainer}
        onPress={() => navigation.navigate("Tanulo_Datumok")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
        <Text style={styles.oraTitle}>Következő óra időpontja:</Text>
        <Text style={styles.oraOsszeg}>
        {koviOra.length > 0 ? koviOraFormazasa(koviOra[0].ora_datuma) : "Egyenlőre még nincs beírva következő óra!"}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={40} color="black"/>
        </View>
      </TouchableOpacity>
      {/* --------------------------------------LEGUTÓBBI TRANZAKCIÓ---------------------------------------- */}
      <View style={styles.tranzakcioContainer}>
        <Text style={styles.tranzakcioTitle}>Legutóbbi Tranzakciók</Text>

        {befizetLista
          .sort(
            (a, b) =>
              new Date(b.befizetesek_ideje) - new Date(a.befizetesek_ideje)
          ) //dátum szerint csökkenő sorrendbe tesszük a lista elemeit
          .slice(0, 3) //csak az utolsó 3 befizetést akarom kiíratni, a többi majd a "Befizetéseim" fülön lesz
          .map((item) => {
            if (item.befizetesek_tipusID == 1) {
              return (
                <View
                  style={styles.legutobbiTranzakciok}
                  key={item.befizetesek_id}
                >
                  <Text style={styles.tranzakciosText}>Tanóra díj</Text>
                  <Text style={styles.tranzakciosOsszeg}>
                    {" "}
                    - {item.befizetesek_osszeg} Ft
                  </Text>
                </View>
              );
            }
            return (
              <View
                style={styles.legutobbiTranzakciok}
                key={item.befizetesek_id}
              >
                <Text style={styles.tranzakciosText}>Vizsga díj</Text>
                <Text style={styles.tranzakciosOsszeg}>
                  {" "}
                  - {item.befizetesek_osszeg} Ft
                </Text>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};
export default Tanulo_Kezdolap;

const styles = StyleSheet.create({
  egeszOldal: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  udvozloView: {
    backgroundColor: "#dfe6e9", //#dfe6e9
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "left",
    marginTop: 45,
  },
  udvozloSzoveg: {
    fontSize: 18,
    color: "#636e72",
    fontWeight: "bold",
  },
  userNev: {
    fontSize: 22,
    color: "#2d3436",
    fontWeight: "bold",
  },
  befizetesContainer: {
    margin: 20,
    backgroundColor: "#5A4FCF", //"#8338ec", //"#5A4FCF", //#6c5ce7
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  befizetesTitle: {
    fontSize: 16,
    color: "#fff",
  },
  befizetesOsszeg: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  oraContainer: {
    margin: 20,
    backgroundColor: "#ccccff", //"#C49991", //"#5E7CE2", //"#A06CD5",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  oraTitle: {
    fontSize: 16,
    color: "black",
  },
  oraOsszeg: {
    fontSize: 24,
    color: "#32174d",
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
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Ipcim from "../../../Ipcim";
import HibaModal from "../../../extra/HibaModal";
import SikerModal from "../../../extra/SikerModal";
const OktatonakAkarokFizetni = ({ route }) => {
  const { atkuld } = route.params;
  const [osszeg, setOsszeg] = useState("");
  const [szamologepLathatoe, setSzamologepLathatoe] = useState(false);
  const [tanora, setTanora] = useState(true);
  const [vizsga, setVizsga] = useState(false);
  //------------------------------------------------------------- MODÁLOK
  const [hibaModal, setHibaModal] = useState(false);
  const [hibaModalCim, setHibaModalCim] = useState('');
  const [hibaModalSzoveg, setHibaModalSzoveg] = useState('');
  const [sikerModal, setSikerModal] = useState(false);
  const [sikerModalCim, setSikerModalCim] = useState('');
  const [sikerModalSzoveg, setSikerModalSzoveg] = useState('');
  //------------------------------------------------------------- CHECKBOX
  function SajatCheckbox({ szoveg, bepipalva, haRakattintanak }) {
    return (
      <TouchableOpacity style={styles.checkboxContainer} onPress={haRakattintanak}>
        <View style={[styles.checkbox, bepipalva && styles.bepipaltCheckbox]} />
        <Text style={{ fontSize: 17 }}>{szoveg}</Text>
      </TouchableOpacity>
    );
  }
  /* -------------------------------------- ÖSSZEG FELVITELE AZ ADATBÁZISBA ---------------------------------------- */
  const osszegFelvitele = async () => {
    if (osszeg === "" || parseFloat(osszeg) === 0) {
      setHibaModalCim("Hoppá!");
      setHibaModalSzoveg("Úgy tűnik, hogy elfelejtette beírni az összeget!");
      setHibaModal(true);
      return;
    }
    else if (osszeg.startsWith("0") && osszeg !== "0") {
      setHibaModalCim("Hoppá!");
      setHibaModalSzoveg("A felvenni kívánt összeg nem kezdődhet nullával!");
      setHibaModal(true);
      return;
    }
    else {
      const tipusID = tanora ? 1 : vizsga ? 2 : null;
      const datum = new Date();
      const formazottDatum =
        datum.getFullYear() +
        "-" +
        ("0" + (datum.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + datum.getDate()).slice(-2) +
        " " +
        ("0" + datum.getHours()).slice(-2) +
        ":" +
        ("0" + datum.getMinutes()).slice(-2) +
        ":" +
        ("0" + datum.getSeconds()).slice(-2);
      const adat = {
        befizetesek_tanuloID: atkuld.tanulo_id, //5
        befizetesek_oktatoID: atkuld.tanulo_oktatoja, //7
        befizetesek_tipusID: tipusID, //1 vagy 2
        befizetesek_osszeg: osszeg, //összeg
        befizetesek_ideje: formazottDatum,
        befizetesek_kinek: 1, // 1=oktatónál történt befizetés
      };
      try {
        const valasz = await fetch(Ipcim.Ipcim + "/tanuloBefizetesFelvitel", {
          method: "POST",
          body: JSON.stringify(adat),
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        });
        if (valasz.ok) {
          setSikerModalCim("Sikeres befizetés!");
          setSikerModalSzoveg("A tranzakció sikeresen rögzítésre került az alkalmazásban! Amennyiben nem jelenik meg azonnal fizetési előzmények között, próbáljon meg ráfrissíteni!");
          setSikerModal(true);
        } else {
          setHibaModalCim("Hoppá!");
          setHibaModalSzoveg(`A befizetés nem sikerült! Kérjük próbálja meg újra!`);
          setHibaModal(true);
        }
      } catch (error) {
        setHibaModalCim("Hiba!");
        setHibaModalSzoveg(`Kérjük küldje el ezt a hibaüzenetet a fejlesztőknek: ${error.message}`);
        setHibaModal(true);
      }
      setOsszeg(""); // Törlöm a beírt összeget a felvitel után!!!
      adatokBetoltese();
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
        <Text style={styles.szamologepSzovegC}>C</Text>
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
        <Text style={styles.szamologepSzovegDEL}>⌫</Text>
      </TouchableOpacity>
    </View>
  );
  const osszegMegnyomas = () => {
    setSzamologepLathatoe(!szamologepLathatoe);
  };
  const szamologepGombNyomas = (key) => {
    if (key === "torles") {
      setOsszeg((elozoOsszeg) => {
        const ujOsszeg = elozoOsszeg.slice(0, -1);
        return ujOsszeg;
      });
    } else if (key === "C") {
      setOsszeg("");
    } else {
      setOsszeg((elozoOsszeg) => {
        const ujOsszeg = elozoOsszeg + key;
        return ujOsszeg;
      });
    }
  };
  return (
    <LinearGradient
      colors={["#ffffff", "#f0f4ff"]}
      style={styles.lineargradientContainer}
    >
      {szamologepLathatoe ? (
        <ScrollView contentContainerStyle={{ alignContent: "center" }}>
          <View style={styles.container2}>
            {/*-------------------------------------- SZÁMOLÓGÉP LÁTHATÓ -----------------------*/}
            <Text style={styles.nagybetusSzoveg}>FONTOS!</Text>

            <Text style={styles.kisbetusSzoveg}>
              Adja meg, hogy a befizetett összeg milyen típusú.
            </Text>
            <Text style={styles.kisbetusSzoveg}>
              Válasszon az alábbi lehetőségek közül:
            </Text>
            {/*---------------------------------- CHECKBOX --------------------------------*/}
            <View style={styles.checkboxView}>
              <SajatCheckbox
                szoveg="Gyakorlati óra"
                bepipalva={tanora}
                haRakattintanak={() => {
                  setTanora(true);
                  setVizsga(false);
                }}
              />
              <SajatCheckbox
                szoveg="Vizsga"
                bepipalva={vizsga}
                haRakattintanak={() => {
                  setVizsga(true);
                  setTanora(false);
                }}
              />
            </View>
            <TouchableOpacity onPress={osszegMegnyomas} style={styles.input}>
              <Text style={styles.osszegBeiras}>
                {osszeg ? `${osszeg} Ft` : "Összeg (Ft)"}
              </Text>
            </TouchableOpacity>
            {/*----------------------------------- FIZETÉS ELKÜLDÉSE GOMB ----------------- */}
            <TouchableOpacity
              style={styles.fizetesGomb}
              onPress={osszegFelvitele}
            >
              <LinearGradient
                colors={["#2EC0F9", "#0057FF"]}
                style={styles.gradient}
              >
                <Ionicons name="card" size={24} color="#fff" />
                <Text style={styles.fizetesGombSzoveg}>Tranzakció felvétele</Text>
              </LinearGradient>
            </TouchableOpacity>
            {szamologepBetoltes()}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.nagybetusSzoveg}>FIGYELEM!</Text>
          <Text style={styles.kisbetusSzoveg}>
            Ez az oldal az oktatónál történő befizetéseket kezeli.
          </Text>
          <Text style={styles.kisbetusSzoveg}>
            Az itt felvenni kívánt összeget az oktatója fogja jóváhagyni a saját alkalmazásában, amennyiben annak befizetése valóban megtörtént.
          </Text>

          <TouchableOpacity onPress={osszegMegnyomas} style={styles.input}>
            <Text style={styles.osszegBeiras}>
              {osszeg ? `${osszeg} Ft` : "Összeg (Ft)"}
            </Text>
          </TouchableOpacity>
          {/*----------------------------------- FIZETÉS ELKÜLDÉSE GOMB ----------------- */}
          <TouchableOpacity style={styles.fizetesGomb} onPress={osszegFelvitele}>
            <LinearGradient
              colors={["#2EC0F9", "#0057FF"]}
              style={styles.gradient}
            >
              <Ionicons name="card" size={24} color="#fff" />
              <Text style={styles.fizetesGombSzoveg}>Tranzakció felvétele</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      )}
      <HibaModal
        visible={hibaModal}
        onClose={() => setHibaModal(false)}
        title={hibaModalCim}
        body={hibaModalSzoveg}
        buttonText={"Rendben"}
      />
      <SikerModal
        visible={sikerModal}
        onClose={() => setSikerModal(false)}
        title={sikerModalCim}
        body={sikerModalSzoveg}
        buttonText={"Rendben"}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  lineargradientContainer: {
    flex: 1,
  },
  container2: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  nagybetusSzoveg: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  kisbetusSzoveg: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10
  },
  input: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  osszegBeiras: {
    color: "gray",
    fontSize: 18,
  },
  fizetesGomb: {
    width: "100%",
    height: 60,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  fizetesGombSzoveg: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  szamologepView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  szamologepGomb: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderColor: "#4169E1",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 10,
    elevation: 2,
  },
  szamologepSzoveg: {
    fontSize: 24,
    color: "#000080",
    fontWeight: "bold",
  },
  szamologepSzovegC: {
    fontSize: 24,
    color: "#FFA62B",
    fontWeight: "bold",
  },
  szamologepSzovegDEL: {
    fontSize: 24,
    color: "red",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
    borderRadius: 30,
  },
  bepipaltCheckbox: {
    backgroundColor: "#87CEFA",
  },
  checkboxView: {
    flexDirection: "row",
    alignContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
});
export default OktatonakAkarokFizetni;
